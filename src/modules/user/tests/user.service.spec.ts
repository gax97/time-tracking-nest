import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { configService } from '../../../shared/services/config.service';
import { Time } from '../../../shared/models/times.model';
import { User } from '../../../shared/models/user.model';
import { TimeService } from '../../time/time.service';
import moment = require('moment');
const getTestingModule = () => {
	return Test.createTestingModule({
		providers: [UsersService, TimeService],
		imports: [
			SequelizeModule.forRoot({
				...configService.getTestPostgresConfig(),
			}),
			SequelizeModule.forFeature([User, Time]),
		],
	}).compile();
};
describe('UserService', () => {
	let service: UsersService;
	let user: User;
	beforeEach(async () => {
		const module: TestingModule = await getTestingModule();
		service = module.get<UsersService>(UsersService);
	});
	afterEach(async () => {
		user?.destroy();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create a user', async () => {
		user = await service.create({
			email: 'somerandom@email.com',
			fullName: 'randomFullName',
			passwordPlain: 'randomPassword',
		});
		expect(user).toBeDefined();
	});

	it('should not create a user', async () => {
		user = await service.create({
			email: 'somerandom@email.com',
			fullName: 'randomFullName',
			passwordPlain: 'randomPassword',
		});

		await expect(
			service.create({
				id: user.getDataValue('id'),
				email: 'somerandom@email.com',
				fullName: 'randomFullName',
				passwordPlain: 'randomPassword',
			}),
		).rejects;
	});
	describe('getUserByEmail', () => {
		const email = 'somerandom@email.com';
		const fullName = 'somerandom@email.com';
		const passwordPlain = 'randomPassword';
		let user;
		beforeAll(async () => {
			const module: TestingModule = await getTestingModule();
			service = module.get<UsersService>(UsersService);

			user = await service.create({
				email,
				fullName,
				passwordPlain,
			});
		});
		afterEach(async () => {
			user.destroy();
		});

		it('should return a user', async () => {
			const foundUser = await service.getUserByEmail(email);
			expect(foundUser).toBeDefined();
		});
		it('should return null', async () => {
			const user = await service.getUserByEmail('nonexistentemail');
			expect(user).toEqual(null);
		});
	});

	describe('getUserByEmailWithStartTime', () => {
		const email = 'somerandom@email.com';
		const fullName = 'somerandom@email.com';
		const passwordPlain = 'randomPassword';
		let user;
		let timeService;
		beforeAll(async () => {
			const module: TestingModule = await getTestingModule();
			service = module.get<UsersService>(UsersService);
			timeService = module.get<TimeService>(TimeService);
			user = await service.create({
				email,
				fullName,
				passwordPlain,
			});
			const time = await timeService.create({
				startTime: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
				label: 'test-label',
			});
			await user.addTime(time);
		});
		afterAll(async () => {
			user.destroy();
		});

		it('should return a user with defined start time', async () => {
			const foundUser = await service.getUserByEmailWithStartTime(email);
			expect(foundUser).toBeDefined();
		});
		it('should return a user with timer labeled "test-label"', async () => {
			const foundUser = await service.getUserByEmailWithStartTime(email);
			const [foundTime] = foundUser.times;
			expect(foundTime.label).toBe('test-label');
		});
		it('should return a user with undefined end time', async () => {
			const foundUser = await service.getUserByEmailWithStartTime(email);
			const [foundTime] = foundUser.times;
			expect(foundTime.endTime).toBe(null);
		});
		it('should return null', async () => {
			const user = await service.getUserByEmailWithStartTime(
				'nonexistentemail',
			);
			expect(user).toEqual(null);
		});
		it('should return a user with a defined time', async () => {
			const foundUser = await service.getUserByEmailWithStartTime(email);
			expect(foundUser.times).toBeDefined();
			expect(foundUser.times.length).toBeGreaterThanOrEqual(1);
		});
	});
});
