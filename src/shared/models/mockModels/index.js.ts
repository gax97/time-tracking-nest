import moment = require('moment');
import {
	TimeMockData,
	TimeMockDataHigher,
	TimeMockDataLower,
	TimeMockDataWithoutEndTime,
} from '../../../data/mockData/Time';
import { UserMockData } from '../../../data/mockData/User';

export const TimeModelMock = {
	create: data => data,
	findOne: () => TimeMockDataWithoutEndTime,
	findAll: () => [
		TimeMockDataHigher,
		TimeMockDataLower,
	],
};
export const UserModelMock = {
	create: data => data,
	findOne: () => UserMockData,
	findAll: () => [
		TimeMockDataHigher,
		TimeMockDataLower,
	],
	addTime: ()=> ({}),
};
