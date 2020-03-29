import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TimeService } from './time.service';
import { TimeController } from './time.controller';
import { UsersModule } from '../user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../shared/models/user.model';
import { Time } from '../../shared/models/times.model';
import { authenticateUser } from '../../shared/middleware/auth';

@Module({
	imports: [UsersModule, SequelizeModule.forFeature([Time])],
	providers: [TimeService],
	controllers: [TimeController]
})
export class TimeModule  implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(authenticateUser).forRoutes(TimeController)
	}
}
