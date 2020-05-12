import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from '../auth.service';
import { UsersService } from '../../user/user.service';
import { User } from '../../../shared/models/user.model';
import { configService } from '../../../shared/services/config.service';
import { Time } from '../../../shared/models/times.model';
import { OAuthClient } from '../../../shared/models/oAuthClient.model';
import { OAuthAccessToken } from '../../../shared/models/oAuthAccessToken.model';

describe('Auth Controller', () => {
	let controller: AuthController;
	let authService;
	let userService;
	let client;
	const email = 'useremail123@email.com'
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [UsersService, AuthService],
			imports: [
				SequelizeModule.forRoot({
					...configService.getTestPostgresConfig(),
				}),
				SequelizeModule.forFeature([OAuthClient, OAuthAccessToken, User, Time]),
			],
		}).compile();

		controller = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(AuthService);
		userService = module.get<UsersService>(UsersService);
		// client = await authService.createClient( {id: "application", clientSecret: "secret", grants: ["password", "refresh_token"]});
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	// describe('sign up route /auth/sign-up (POST)', () => {
	//
	// });
});
