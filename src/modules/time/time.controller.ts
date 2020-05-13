import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Post,
	Res,
	UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { TimeService } from './time.service';
import { Response } from 'express';
import moment = require('moment');

@Controller('time')
export class TimeController {
	constructor(
		private readonly userService: UsersService,
		private readonly timesService: TimeService,
	) {}

	/**
	 * Get all tracked activities from one user
	 * @param res - response object used to get current authenticated user
	 * @throws UnauthorizedException
	 */
	@Get('/')
	async getAll(@Res() res: Response) {
		const userId = res.locals.token?.user?.id;
		if (!userId) {
			throw new UnauthorizedException('User not logged in');
		}
		return await this.timesService.getTimesFromUserIdDescending(userId);
	}

	/**
	 * Start single activity
	 * @param label - label or the name of the activity
	 * @param res - response object used to get current authenticated user
	 * @throws BadRequestException
	 * @throws UnauthorizedException
	 */
	@Post('/clock-in/:label')
	async clockIn(@Param('label') label: string, @Res() res: Response) {
		const currentUserEmail = res.locals.token?.user?.email;
		if (!currentUserEmail) {
			throw new UnauthorizedException('User not logged in');
		}
		const startTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
		const user = await this.userService.getUserByEmailWithStartTime(
			currentUserEmail,
		);
		if (user.times.length > 0) {
			throw new BadRequestException('User is already clocked in');
		}
		const time = await this.timesService.create({
			startTime: startTime,
			label: label,
		});

		// @ts-ignore
		await user.addTime(time);
		return { success: true, time };
	}

	/**
	 * Finish single activity from the user
	 * @param timerId - id of the activity to finish
	 * @throws BadRequestException
	 */
	@Post('/clock-out/:timerId')
	async clockOut(@Param('timerId') timerId: string) {
		const endTime = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
		const time = await this.timesService.getTimeFromId(timerId);

		if (!time) {
			throw new BadRequestException('There is no such activity');
		}
		const newTime = await time.update(
			{ endTime: endTime },
			{ where: { id: timerId } },
		);

		return {
			success: true,
			timerId: time.id,
			newTime,
		};
	}
}
