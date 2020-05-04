import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interceptor for consistent formatting of the responses.
 */
@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		console.log('Before...', context.getHandler());

		return next
			.handle()
			.pipe(
				map((data) => {
					return ({
						statusCode: context.switchToHttp().getResponse().statusCode,
						data: data,
					});
				}),
			);
	}
}
