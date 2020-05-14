import { Test, TestingModule } from '@nestjs/testing';
import { TimeService } from '../time.service';
import { getModelToken } from '@nestjs/sequelize';
import { Time } from '../../../shared/models/times.model';
import moment = require('moment');
import { TimeModelMock } from '../../../shared/models/mockModels/index.js';

describe('TimeService', () => {
	let service: TimeService;
	const dummyStartTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TimeService,
				{
					provide: getModelToken(Time),
					useValue: TimeModelMock,
				},
			],
		}).compile();
		service = module.get<TimeService>(TimeService);
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
	});

	describe('getTimeFromId', () => {
		it('should return found time', async () => {
			jest.spyOn(TimeModelMock, 'findOne').mockImplementation(() => ({
				id: 123123123,
				label: 'test-label',
				startTime: 'startTime',
				endTime: 'endTime',
			}));
			const foundTime = await service.getTimeFromId(123123123);
			expect(foundTime).toBeDefined();
			expect(foundTime.id).toEqual(123123123);
			expect(foundTime.label).toEqual('test-label');
		});
		it('should return null', async () => {
			jest.spyOn(TimeModelMock, 'findOne').mockImplementation(() => null);
			const foundTime = await service.getTimeFromId(null);
			expect(foundTime).toBe(null);
		});
	});
	describe('getTimesFromUserIdDescending', () => {
		it('should return list of times', async () => {
			const times = await service.getTimesFromUserIdDescending('id');
			expect(times).toBeDefined();
			expect(times.length).toBe(2);
		});
		it('should return list of times that is sorted by latest', async () => {
			const times = await service.getTimesFromUserIdDescending('id');
			expect(
				moment(times[0].startTime).isAfter(moment(times[1].startTime)),
			).toBe(true);
		});
		it('should return empty array', async () => {
			jest.spyOn(TimeModelMock, 'findAll').mockImplementation(() => []);
			const times = await service.getTimesFromUserIdDescending(null);
			expect(times.length).toBe(0);
		});
	});
});
