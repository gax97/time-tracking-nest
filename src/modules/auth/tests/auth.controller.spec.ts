import { Test, TestingModule } from '@nestjs/testing';
import { AuthController, SignUpParameters } from '../auth.controller';
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
	const userData: SignUpParameters = {
		email: 'email@email.com',
		fullName: 'mike',
		password: 'somepassword',
		clientId: 'application',
	};
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
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
	it('should have sign-up, sign-in and sign-out methods', ()=>{
		expect(controller.signUp).toBeDefined();
		expect(controller.signIn).toBeDefined();
		expect(controller.signOut).toBeDefined();
	})

	describe('sign up route /auth/sign-up (POST)', () => {
		it('should create a new user', async () => {
			jest.spyOn(authService, 'getClient').mockImplementation(() => 'client');
			jest.spyOn(userService, 'getUserByEmail').mockImplementation(() => null);
			jest.spyOn(userService, 'create').mockImplementation(data => data);

			const response = await controller.signUp(userData);
			expect(response.success).toBe(true);
			expect(response.message).toBe('ok');
		});

		it('should throw error when no client is found', async () => {
			jest.spyOn(authService, 'getClient').mockImplementation(() => null);
			expect.assertions(3);
			try {
				await controller.signUp(userData);
			} catch (error) {
				expect(error).toBeDefined();
				expect(error.response.message).toBe('OAuth client not found');
				expect(error.response.statusCode).toBe(404);
			}
		});

		it('should throw error when user already exists', async () => {
			jest.spyOn(authService, 'getClient').mockImplementation(() => 'client');
			jest
				.spyOn(userService, 'getUserByEmail')
				.mockImplementation(() => 'user');
			expect.assertions(3);
			try {
				await controller.signUp(userData);
			} catch (error) {
				expect(error).toBeDefined();
				expect(error.response.message).toBe('User already exists');
				expect(error.response.statusCode).toBe(400);
			}
		});
	});

	// TODO test sign-in and sign-out in E2E testing!

});
