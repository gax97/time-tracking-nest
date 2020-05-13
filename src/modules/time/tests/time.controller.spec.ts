import { Test, TestingModule } from '@nestjs/testing';
import { TimeController } from '../time.controller';
import { UsersService } from '../../user/user.service';
import { TimeService } from '../time.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { configService } from '../../../shared/services/config.service';
import { Time } from '../../../shared/models/times.model';
import { User } from '../../../shared/models/user.model';
import { NestApplication } from '@nestjs/core';
import moment = require('moment');

describe('Time Controller', () => {
	let controller: TimeController;
	let app: NestApplication;
	let userService: UsersService;
	let timeService: TimeService;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TimeController],
			providers: [UsersService, TimeService],
			imports: [
				SequelizeModule.forRoot({
					...configService.getTestPostgresConfig(),
				}),
				SequelizeModule.forFeature([Time, User]),
			],
		}).compile();

		controller = module.get<TimeController>(TimeController);
		userService = module.get<UsersService>(UsersService);
		timeService = module.get<TimeService>(TimeService);
		app = module.createNestApplication();
		await app.init();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
		expect(app).toBeDefined();
		expect(userService).toBeDefined();
		expect(timeService).toBeDefined();
	});

	describe('path /time/ (GET)', () => {
		let user;
		let time;
		beforeEach(async () => {
			user = await userService.create({
				email: 'randomuser@email.com',
				fullName: 'userPassword',
				passwordPlain: 'randomPassword123',
			});
			const dummyStartTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
			const dummyEndTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
			time = await timeService.create({
				label: 'label1',
				startTime: dummyStartTime,
				endTime: dummyEndTime,
			});
			await user.addTime(time);
		});

		afterEach(async () => {
			await user.destroy();
			await time.destroy();
		});

		it('should return list of times', async () => {
			// @ts-ignore mock logged in user id
			const data = await controller.getAll({
				locals: { token: { user: { id: user.id } } },
			});
			expect(data).toBeDefined();
			expect(data.length).toBeGreaterThanOrEqual(1);
			expect(data[0].id).toBe(time.id);
		});
		it('should throw error', async () => {
			// @ts-ignore mock logged out user id
			controller.getAll({ locals: { token: null } }).catch(error => {
				expect(error).toBeDefined();
				expect(error.response.statusCode).toBe(401);
				expect(error.response.error).toBe('Unauthorized');
			});
		});
		describe('path /time/clock-in/:label (POST)', () => {
			let unfinishedTime;
			it('should return new time', async () => {
				// @ts-ignore mock logged in user
				const response = await controller.clockIn('test-label2', {
					locals: { token: { user: { email: user.email } } },
				});
				expect(response.success).toBe(true);
				expect(response.time).toBeDefined();
				expect(response.time.id).toBeDefined();
				expect(response.time.endTime).toBeNull();
				expect(response.time.label).toBe('test-label2');
				await response.time.destroy();
			});
			it('should throw unauthorized error', async () => {
				let response;
				try {
					response = await controller
						// @ts-ignore mock logged out user
						.clockIn('test-label', {
							locals: { token: null },
						});
				} catch (error) {
					expect(error).toBeDefined();
					expect(error.response.statusCode).toBe(401);
					expect(error.response.error).toBe('Unauthorized');
				}
				expect(response).not.toBeDefined();
			});

			it('should throw bad request error', async () => {
				// @ts-ignore
				jest.spyOn(userService, 'getUserByEmailWithStartTime').mockImplementation(()=>({times: ['time1', 'time2']}))
				let response;
				try {
					response = await controller
						// @ts-ignore mock logged in user
						.clockIn('test-label', {
							locals: { token: { user: { email: user.email } } },
						});
				} catch (error) {
					expect(error).toBeDefined();
					expect(error.response.statusCode).toBe(400);
					expect(error.response.error).toBe('Bad Request');
				}
				expect(response).not.toBeDefined();
			});
		});
		describe('path /time/clock-out/:timerId (POST)', () => {
			let unfinishedTime;
			beforeEach(async () => {
				unfinishedTime = await timeService.create({
					startTime: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
					endTime: null,
				});
				await user.addTime(unfinishedTime);
			});
			afterEach(async () => {
				await unfinishedTime.destroy();
			});
			it('should throw bad request error', async () => {
				// wrong time id
				let response;
				try {
					response = await controller.clockOut('7565d992-ce3b-467a-b558-dcb4fccc3329');
				} catch (error) {
					expect(error).toBeDefined();
					expect(error.response.statusCode).toBe(400);
					expect(error.response.error).toBe('Bad Request');
				}
				expect(response).not.toBeDefined();
			});
			it('should return finished time object', async () => {
				const response = await controller.clockOut(unfinishedTime.id);
				expect(response.success).toBe(true);
				expect(response.timerId).toBe(unfinishedTime.id);
			});
		});
	});
});
