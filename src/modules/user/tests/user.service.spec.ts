import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { configService } from '../../../shared/services/config.service';
import { Time } from '../../../shared/models/times.model';
import { User } from '../../../shared/models/user.model';

describe('UserService', () => {
	let service: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UsersService],
			imports: [SequelizeModule.forRoot({
				...configService.getTestPostgresConfig(),
			}), SequelizeModule.forFeature([User, Time])]
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
