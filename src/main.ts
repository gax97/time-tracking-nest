import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/filters/HttpExceptionFilter';
import { ResponseFormatInterceptor } from './shared/interceptors/ResponseFormatInterceptor';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({}),
	);

	app.useGlobalFilters(new HttpExceptionFilter());

	app.useGlobalInterceptors(new ResponseFormatInterceptor());

	await app.listen(3000);
}
bootstrap();
