import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { UsersModule } from '../../user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppModule } from '../../../app.module';
import { AuthModule } from '../auth.module';
import { AuthService } from '../auth.service';
import { UsersService } from '../../user/user.service';
import { User } from '../../../shared/models/user.model';
import { configService } from '../../../shared/services/config.service';
import { TimeController } from '../../time/time.controller';
import { TimeService } from '../../time/time.service';
import { Time } from '../../../shared/models/times.model';
import { OAuthClient } from '../../../shared/models/oAuthClient.model';
import { OAuthAccessToken } from '../../../shared/models/oAuthAccessToken.model';

describe('Auth Controller', () => {
	let controller: AuthController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [UsersService, AuthService],
			imports: [SequelizeModule.forRoot({
				...configService.getTestPostgresConfig(),
			}), SequelizeModule.forFeature([OAuthClient, OAuthAccessToken, User, Time])]
		}).compile();

		controller = module.get<AuthController>(AuthController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
