import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './modules/user/user.module';
import { TimeModule } from './modules/time/time.module';

import { configService } from './shared/services/config.service';

@Module({
	imports: [
		AuthModule,
		SequelizeModule.forRoot({
			...configService.getPostgresConfig(),
		}),
		UsersModule,
		TimeModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
