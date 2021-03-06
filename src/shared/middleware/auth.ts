import * as OAuth2Server from 'oauth2-server';
import {oauth} from '../../lib/oauth'
import { HttpException } from '@nestjs/common';
import {Response, Request} from 'express';
/**
 * Middleware for token validation
 * @param req - http request object
 * @param res - http response object
 * @param next - next function in middleware to call after successful token validation
 */
export function authenticateUser(req: Request, res: Response, next) {

	const request = new OAuth2Server.Request(req);
	const response = new OAuth2Server.Response(res);

	oauth.authenticate(request, response)
		.then((token) => {
			res.locals.token = token;
			next(null);
		})
		.catch((err) => next(new HttpException(err, 401)));

}
