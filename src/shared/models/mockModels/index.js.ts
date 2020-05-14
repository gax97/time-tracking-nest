import moment = require('moment');

export const TimeModelMock = {
	create: data => data,
	findOne: () => ({ id: 123, startTime: 'sss', endTime: 'endTime' }),
	findAll: () => [
		{ id: 321, startTime: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'), endTime: 'endTime' },
		{ id: 123, startTime: moment().add(-2, 'day').format('YYYY-MM-DDTHH:mm:ss.SSSZ'), endTime: 'endTime' },
	],
};
