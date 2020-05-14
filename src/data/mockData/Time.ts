import { v4 as uuid } from 'uuid';
import moment = require('moment');
import { defaultFormat } from '../timeFormatStrings';
export const TimeMockData = {
	id: uuid(),
	startTime: moment().format(defaultFormat),
	endTime: moment()
		.add(2, 'hours')
		.format(defaultFormat),
	label: 'test-label',
};
export const TimeMockDataHigher = {
	id: uuid(),
	startTime: moment().add(1, 'day').format(defaultFormat),
	endTime: moment().add(2, 'day')
		.format(defaultFormat),
	label: 'test-label',
};

export const TimeMockDataLower = {
	id: uuid(),
	startTime: moment().format(defaultFormat),
	endTime: moment()
		.add(2, 'hours')
		.format(defaultFormat),
	label: 'test-label',
};

export const TimeMockDataWithoutEndTime = {
	id: uuid(),
	startTime: moment().format(defaultFormat),
	endTime: null,
	label: 'test-label',
};
