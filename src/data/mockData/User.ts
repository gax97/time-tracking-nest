import { v4 as uuid } from 'uuid';
import { TimeMockDataHigher, TimeMockDataLower, TimeMockDataWithoutEndTime } from './Time';
export const UserMockData = {
	id: uuid(),
	email: 'randomemail@email.com',
	fulName: 'john smith',
	password: 'randomEncryptedPassword',
	times: [],
};
export const UserMockDataWithTimes = {
	...UserMockData,
	times: [TimeMockDataLower, TimeMockDataHigher],
};

export const UserMockDataWithUnfinishedTime = {
	...UserMockData,
	times: [TimeMockDataWithoutEndTime],
}
