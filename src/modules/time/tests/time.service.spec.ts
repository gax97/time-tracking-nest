import { Test, TestingModule } from '@nestjs/testing';
import { TimeService } from '../time.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Time } from '../../../shared/models/times.model';
import { configService } from '../../../shared/services/config.service';
import { User } from '../../../shared/models/user.model';
import moment = require('moment');
import { UsersService } from '../../user/user.service';
const getTestingModule = () => {
	return Test.createTestingModule({
		providers: [TimeService, UsersService],
		imports: [
			SequelizeModule.forRoot({
				...configService.getTestPostgresConfig(),
			}),
			SequelizeModule.forFeature([Time, User]),
		],
	}).compile();
};
describe('TimeService', () => {
	let service: TimeService;
	let time: Time;
	let userService: UsersService;
	const dummyStartTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
	const dummyEndTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
	beforeEach(async () => {
		const module: TestingModule = await getTestingModule();
		service = module.get<TimeService>(TimeService);
		userService = module.get<UsersService>(UsersService);
		time = await service.create({
			startTime: dummyStartTime,
			endTime: dummyEndTime,
			label: 'test-label',
		});
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
	it('should create a time', async () => {
		const time = await service.create({
			startTime: dummyStartTime,
			label: 'test-label',
		});
		expect(time).toBeDefined();
		expect(time.startTime).toBeDefined();
		expect(time.label).toEqual('test-label');

		afterAll(async () => {
			await time.destroy();
		});
	});

	describe('getTimeFromId', () => {
		it('should return found time', async () => {
			const foundTime = await service.getTimeFromId(time.id);
			expect(foundTime).toBeDefined();
			expect(foundTime.id).toEqual(time.id);
			expect(foundTime.label).toEqual('test-label');
		});
		it('should return null', async () => {
			const foundTime = await service.getTimeFromId(null);
			expect(foundTime).toBe(null);
		});
	});
	describe('getTimesFromUserIdDescending', () => {
		let user;
		let time1;
		let time2;
		beforeAll(async () => {
			const module: TestingModule = await getTestingModule();
			service = module.get<TimeService>(TimeService);
			userService = module.get<UsersService>(UsersService);

			const dummyStartTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
			const dummyEndTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
			time1 = await service.create({
				label: 'label1',
				startTime: dummyStartTime,
				endTime: dummyEndTime,
			});
			time2 = await service.create({
				label: 'label2',
				startTime: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
				endTime: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
			});
			user = await userService.create({
				fullName: 'fulname',
				email: 'randomemail@email.com',
			});
			await user.addTimes([time1, time2]);
		});
		afterAll(async () => {
			await time1.destroy();
			await time2.destroy();
			await user.destroy();
		});
		it('should return list of times', async () => {
			const times = await service.getTimesFromUserIdDescending(user.id);
			expect(times).toBeDefined();
			expect(times.length).toBe(2);
		});
		it('should return list of times that is sorted by latest', async () => {
			const times = await service.getTimesFromUserIdDescending(user.id);
			expect(
				moment(times[0].startTime).isAfter(moment(times[1].startTime)),
			).toBe(true);
		});
		it('should return empty array', async () => {
			// random uuid
			const times = await service.getTimesFromUserIdDescending(
				'20b068e0-b55b-4494-be17-e4e107092ffb',
			);
			expect(times.length).toBe(0);
		});
	});
});
