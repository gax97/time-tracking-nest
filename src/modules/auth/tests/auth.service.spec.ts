import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { configService } from '../../../shared/services/config.service';
import { Time } from '../../../shared/models/times.model';
import { User } from '../../../shared/models/user.model';
import { OAuthClient } from '../../../shared/models/oAuthClient.model';
import { OAuthAccessToken } from '../../../shared/models/oAuthAccessToken.model';
import { AuthService } from '../auth.service';

const getTestingModule = () => {
	return Test.createTestingModule({
		providers: [AuthService],
		imports: [
			SequelizeModule.forRoot({
				...configService.getTestPostgresConfig(),
			}),
			SequelizeModule.forFeature([User, OAuthClient, OAuthAccessToken, Time]),
		],
	}).compile();
};
describe('AuthService', () => {
	let service: AuthService;
	let client: OAuthClient;
	beforeEach(async () => {
		const module: TestingModule = await getTestingModule();

		service = module.get<AuthService>(AuthService);
		client = await service.createClient({id: 'someClient'});
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
	it('should create a client', async () => {
		const client = await service.createClient({id: 'randomclientid'});
		expect(client).toBeDefined();
		expect(client.id).toBeDefined();
	});
	it('should return existing client', async () => {
		const foundClient = await service.getClient(client.id);
		expect(foundClient).toBeDefined();
		expect(foundClient.id).toEqual(client.id);
	});
	it('should return null', async () => {
		const foundClient = await service.getClient('non existent client id');
		expect(foundClient).toBeNull();
	});
});
