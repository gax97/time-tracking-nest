import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../shared/models/user.model';
import { Time } from '../../shared/models/times.model';
import { BaseService } from '../../shared/services/base.service';

@Injectable()
export class UsersService extends BaseService{
	constructor(
		@InjectModel(User)
		private userModel: typeof User,
	) {
		super(userModel);
	}
	async getUserByEmail(email : string): Promise<User>{
		return this.userModel.findOne({
			where: {
				email: email
			},
		})
	}

	async getUserByEmailWithStartTime(email : string) : Promise <User>{
		return this.userModel.findOne({
			where: {
				email: email
			},
			include:[{
				model: Time,
				where: {
					endTime: null,
				},
				required: false,
			}]
		})
	}
}
