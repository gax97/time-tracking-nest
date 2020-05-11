import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/filters/HttpExceptionFilter';
import { ResponseFormatInterceptor } from './shared/interceptors/ResponseFormatInterceptor';
import { OAuthErrorFilter } from './shared/filters/OAuthErrorFilter';
import { configService } from './shared/services/config.service';

/**
 * Application entry point
 */
async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({}),
	);

	app.useGlobalFilters(new HttpExceptionFilter(), new OAuthErrorFilter());

	app.useGlobalInterceptors(new ResponseFormatInterceptor());

	await app.listen(configService.getPort());
}
bootstrap();
