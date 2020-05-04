import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { OAuthError } from 'oauth2-server'

/**
 * Exception filter for OAuthErrors.
 * These errors can happen during user validation, creation, deletion or during update of the user information.
 */
@Catch(OAuthError)
export class OAuthErrorFilter implements ExceptionFilter {
	catch(exception: OAuthError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response: Response = ctx.getResponse<Response>();
		const request: Request = ctx.getRequest<Request>();
		response
			.status(exception.code)
			.json({
				statusCode: exception.code,
				timestamp: new Date().toISOString(),
				path: request.url,
				message: exception.message,
				stack: exception.stack,
			});
	}
}
