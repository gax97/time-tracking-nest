import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { OAuthClient } from '../../shared/models/oAuthClient.model';
import { authenticateUser } from '../../shared/middleware/auth';
import { AuthService } from './auth.service';
import { User } from '../../shared/models/user.model';
import { UsersService } from '../user/user.service';
import { OAuthAccessToken } from '../../shared/models/oAuthAccessToken.model';


@Module({
	imports: [SequelizeModule.forFeature([User, OAuthClient, OAuthAccessToken])],
	providers: [UsersService, AuthService],
	controllers: [AuthController]
})
export class AuthModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(authenticateUser).forRoutes({path: '/auth/sign-out', method: RequestMethod.DELETE});
	}
}
