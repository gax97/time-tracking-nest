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

	/**
	 * Retrieve single user by his email address
	 * @param email - email of the user
	 */
	async getUserByEmail(email : string): Promise<User>{
		return this.userModel.findOne({
			where: {
				email: email
			},
		})
	}

	/**
	 * Retrieve single user by his email with his activity that is currently in progress
	 * @param email - email of the user
	 */
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
