import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { OAuthError } from 'oauth2-server'

@Catch(OAuthError)
export class OAuthErrorFilter implements ExceptionFilter {
	catch(exception: OAuthError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response: Response = ctx.getResponse<Response>();
		const request: Request = ctx.getRequest<Request>();
		// @ts-ignore
		console.log(exception)
		response
			.status(exception.code)
			.json({
				statusCode: exception.code,
				timestamp: new Date().toISOString(),
				path: request.url,
				// @ts-ignore
				message: exception.message,
				stack: exception.stack,
			});
	}
}
