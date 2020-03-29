import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../shared/models/user.model';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
	imports: [SequelizeModule.forFeature([User])],
	providers: [UsersService],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}
