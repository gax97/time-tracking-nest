import { BadRequestException, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { TimeService } from './time.service';
import { Response } from 'express';
import moment = require('moment');

@Controller('time')
export class TimeController {
	constructor(private readonly userService: UsersService, private readonly timesService: TimeService){}

	@Get('/')
	getAll(@Res() res: Response){
		const userId = res.locals.token.user.id;
		const data = this.timesService.getTimesFromUserIdDescending(userId);

		return res.send(data);
	}
	@Post('/clock-in/:label')
	async clockIn(@Param('label') label: string, @Res() res: Response){
		const startTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
		const user = await this.userService.getUserByEmailWithStartTime(res.locals.token.user.email);

		if (user.times.length > 0) {
			throw new BadRequestException("User is already clocked in");

		}
		const time = await this.timesService.create({
			startTime: startTime,
			label: label,
		});

		// @ts-ignore
		await user.addTime(time);
		res.status(200).send({success: true, timerId: time.id})
	}

	@Post('/clock-out/:timerId')
	async clockOut(@Param('timerId') timerId: string){
		const endTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
		const time = await this.timesService.getTimeFromId(timerId);

		if(!time){
			throw new BadRequestException('There is no such activity')
		}
		const newTime = await time.update({endTime: endTime}, {where: {id: timerId}});

		return {
			success: true,
			timerId: time.id,
			newTime
		}
	}
}
