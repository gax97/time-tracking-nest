import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../shared/models/user.model';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User)
		private userModel: typeof User,
	) {}

	async findAll(): Promise<User[]> {
		return this.userModel.findAll();
	}

	findOne(id: string): Promise<User> {
		return this.userModel.findOne({
			where: {
				id,
			},
		});
	}

	async remove(id: string): Promise<void> {
		const user = await this.findOne(id);
		await user.destroy();
	}
}
