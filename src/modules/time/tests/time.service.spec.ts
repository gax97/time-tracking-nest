import { Test, TestingModule } from '@nestjs/testing';
import { TimeService } from '../time.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Time } from '../../../shared/models/times.model';
import { configService } from '../../../shared/services/config.service';
import { User } from '../../../shared/models/user.model';

describe('TimeService', () => {
	let service: TimeService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TimeService],
			imports: [SequelizeModule.forRoot({
				...configService.getTestPostgresConfig(),
			}), SequelizeModule.forFeature([Time, User])]
		}).compile();

		service = module.get<TimeService>(TimeService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
