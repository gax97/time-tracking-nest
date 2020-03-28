import { Controller, Get } from '@nestjs/common';
import {UsersService} from './user.service';
import { User } from '../../shared/models/user.model';

@Controller('user')
export class UsersController {
	constructor(private readonly usersService: UsersService){

	}
	@Get('/users')
	async getAllUsers() : Promise <User[]>{
		return await this.usersService.findAll();
	}
}
