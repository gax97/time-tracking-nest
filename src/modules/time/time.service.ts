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

	async create(data){
		return this.timeModel.create(data);
	}
	async getTimesFromUserIdDescending(userId) {
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
	async  getTimeFromId(id) {
		return this.timeModel.findOne({
			where: {
				id: id,
			}
		})
	}
}
