import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Exception filter for HttpError
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response: Response = ctx.getResponse<Response>();
		const request: Request = ctx.getRequest<Request>();
		const status = exception.getStatus();
		console.log(exception)
		response
			.status(status)
			.json({
				statusCode: status,
				timestamp: new Date().toISOString(),
				path: request.url,
				message: exception.message,
				stack: exception.stack,
			});
	}
}
