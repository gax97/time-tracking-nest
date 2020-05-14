import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../user.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../../../shared/models/user.model';
import { UserModelMock } from '../../../shared/models/mockModels/index.js';
import { UserMockData, UserMockDataWithUnfinishedTime } from '../../../data/mockData/User';
describe('UserService', () => {
	let service: UsersService;
	let user: User;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UsersService, {provide: getModelToken(User), useValue: UserModelMock}],
		}).compile();
		service = module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create a user', async () => {
		user = await service.create(UserMockData);
		expect(user).toBe(UserMockData);
	});

	it('should not create a user', async () => {
		jest.spyOn(UserModelMock, 'create').mockImplementation(()=> {
			throw new Error('User already exists')
		})
		expect.assertions(2);
		try{
			await service.create(UserMockData);
		}catch(error){
			expect(error).toBeDefined()
			expect(error.message).toBe('User already exists')
		}
	});
	describe('getUserByEmail', () => {
		it('should return a user', async () => {
			const foundUser = await service.getUserByEmail(UserMockData.email);
			expect(foundUser).toBe(UserMockData)
		});
		it('should return null', async () => {
			jest.spyOn(UserModelMock, 'findOne').mockImplementation(()=> null);
			const user = await service.getUserByEmail(null);
			expect(user).toEqual(null);
		});
	});

	describe('getUserByEmailWithStartTime', () => {
		it('should return a user with defined start time', async () => {
			jest.spyOn(UserModelMock, 'findOne').mockImplementation(() => UserMockDataWithUnfinishedTime);
			const foundUser = await service.getUserByEmailWithStartTime(UserMockDataWithUnfinishedTime.email);
			expect(foundUser).toBe(UserMockDataWithUnfinishedTime);
		});
		it('should return a user with labeled timer', async () => {
			jest.spyOn(UserModelMock, 'findOne').mockImplementation(() => UserMockDataWithUnfinishedTime);
			const foundUser = await service.getUserByEmailWithStartTime(UserMockDataWithUnfinishedTime.email);
			const [foundTime] = foundUser.times;
			expect(foundTime.label).toBe(UserMockDataWithUnfinishedTime.times[0].label);
		});
		it('should return a user with undefined end time', async () => {
			jest.spyOn(UserModelMock, 'findOne').mockImplementation(() => UserMockDataWithUnfinishedTime);
			const foundUser = await service.getUserByEmailWithStartTime(UserMockDataWithUnfinishedTime.email);
			const [foundTime] = foundUser.times;
			expect(foundTime.endTime).toBe(null);
		});
		it('should return null', async () => {
			jest.spyOn(UserModelMock, 'findOne').mockImplementation(() => null)
			const user = await service.getUserByEmailWithStartTime(
				'nonexistentemail',
			);
			expect(user).toEqual(null);
		});
	});
});
