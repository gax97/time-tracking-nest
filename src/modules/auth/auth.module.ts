import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { OAuthClient } from '../../shared/models/oAuthClient.model';
import { OAuthAccessToken } from '../../shared/models/oAuthAccessToken.model';
import { authenticateUser } from '../../shared/middleware/auth';


@Module({
	imports: [SequelizeModule.forFeature([OAuthClient, OAuthAccessToken])],
	providers: [],
	controllers: [AuthController]
})
export class AuthModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(authenticateUser).forRoutes({path: 'sign-out', method: RequestMethod.DELETE});
	}
}
