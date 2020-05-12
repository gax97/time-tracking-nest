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
import * as request from 'supertest';
import { Response } from 'express';

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
			await Promise.all([user.destroy(), time.destroy()]);
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
	});
});
