import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Time } from '../../shared/models/times.model';
import * as sequelize from 'sequelize';
import { BaseService } from '../../shared/services/base.service';

@Injectable()
export class TimeService extends BaseService{
	constructor(
		@InjectModel(Time)
		private timeModel: typeof Time,
	){
		super(timeModel)
	}

	/**
	 * Find all user activities sorted by descending
	 * @param userId - id of the user
	 */
	async getTimesFromUserIdDescending(userId: string) : Promise<Time[]> {
		return this.timeModel.findAll({
			where: {
				userId: userId,
				endTime: {
					[sequelize.Op.ne] : null,
				}
			},
			order: [
				['startTime', 'DESC']
			]
		})
	}

	/**
	 * Find particular activity
	 * @param id - id of the timer
	 */
	async getTimeFromId(id) : Promise<Time>{
		return this.timeModel.findOne({
			where: {
				id: id,
			}
		})
	}
}
