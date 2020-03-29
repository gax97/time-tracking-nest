import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
	ArgumentsHost,
	CallHandler,
	Catch, ExceptionFilter,
	ExecutionContext,
	HttpException,
	Injectable,
	NestInterceptor,
	ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		console.log('Before...', context.getHandler());

		return next
			.handle()
			.pipe(
				map((data) => {
					console.log(data)
					return ({
						statusCode: context.switchToHttp().getResponse().statusCode,
						data: data,
					})
				}),
			);
	}
}
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response : Response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		response
			.status(status)
			.json({
				statusCode: status,
				timestamp: new Date().toISOString(),
				path: request.url,
			});
	}
}
async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ['error', 'warn', 'verbose', 'debug','log',],
	});
	app.useGlobalPipes(
		new ValidationPipe({}),
	);

	app.useGlobalInterceptors(new LoggingInterceptor());

	app.useGlobalFilters(new HttpExceptionFilter());
	await app.listen(3000);
}
bootstrap();
