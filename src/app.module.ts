import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './shared/models/user.model';
import { UsersModule } from './modules/user/user.module';
import { Time } from './shared/models/times.model';
import { OAuthAccessToken } from './shared/models/oAuthAccessToken.model';
import { OAuthClient } from './shared/models/oAuthClient.model';
import { TimeModule } from './modules/time/time.module';

@Module({
	imports: [
		AuthModule,
		SequelizeModule.forRoot({
			dialect: 'postgres',
			host: 'localhost',
			port: 5432,
			username: '',
			password: '',
			database: 'database2',
			autoLoadModels: true,
			synchronize: true,
			models: [User, Time, OAuthAccessToken, OAuthClient],
		}),
		UsersModule,
		TimeModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
