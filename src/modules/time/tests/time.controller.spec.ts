import { Test, TestingModule } from '@nestjs/testing';
import { TimeController } from '../time.controller';
import { UsersService } from '../../user/user.service';
import { TimeService } from '../time.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { configService } from '../../../shared/services/config.service';
import { Time } from '../../../shared/models/times.model';
import { User } from '../../../shared/models/user.model';

describe('Time Controller', () => {
	let controller: TimeController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TimeController],
			providers: [UsersService, TimeService],
			imports: [SequelizeModule.forRoot({
				...configService.getTestPostgresConfig(),
			}), SequelizeModule.forFeature([Time, User])]
		}).compile();

		controller = module.get<TimeController>(TimeController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
