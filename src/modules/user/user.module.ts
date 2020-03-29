import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../shared/models/user.model';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { authenticateUser } from '../../shared/middleware/auth';

@Module({
	imports: [SequelizeModule.forFeature([User])],
	providers: [UsersService],
	controllers: [UsersController],
})
export class UsersModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(authenticateUser).forRoutes(UsersController);
	}
}
