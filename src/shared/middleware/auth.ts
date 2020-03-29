import * as OAuth2Server from 'oauth2-server';
import {oauth} from '../../lib/oauth'
import { HttpException } from '@nestjs/common';
export function authenticateUser(req, res, next) {

	const request = new OAuth2Server.Request(req);
	const response = new OAuth2Server.Response(res);

	oauth.authenticate(request, response)
		.then((token) => {
			res.locals.token = token;
			next(null);
		})
		.catch((err) => next(new HttpException(err, 401)));

}
