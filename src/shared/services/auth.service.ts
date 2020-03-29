import {
	BadRequestException,
	HttpException,
	HttpStatus,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as OAuth2Server from 'oauth2-server';
import {OAuthClient} from '../models/oAuthClient.model';
import {OAuthAccessToken} from '../models/oAuthAccessToken.model';
import {User} from '../models/user.model';
import {Time} from '../models/times.model';

import {
	AuthorizationCodeModel,
	ClientCredentialsModel,
	ExtensionModel,
	PasswordModel,
	RefreshTokenModel,
} from 'oauth2-server';
export class AuthService implements AuthorizationCodeModel, ExtensionModel, PasswordModel, RefreshTokenModel, ClientCredentialsModel{

	create(data): any{
		return OAuthClient.create(data);
	}

	getAccessToken(accessToken, callback): any {
		OAuthAccessToken.findOne({
			where: {
				accessToken,
			},
			include: [
				{model: User}
			],
		}).then((token) => {
			if (!token) {
				return callback(new UnauthorizedException(null, 'Token is invalid'));
			}

			return callback(null, {
				user: token.user,
				accessToken: token.accessToken,
				accessTokenExpiresAt: token.accessTokenExpiresAt,
				refreshToken: token.refreshToken,
				refreshTokenExpiresAt: null,
			});
		});
	}

	getRefreshToken(refreshToken, callback) : any{
		OAuthAccessToken.findOne({
			where: {
				refreshToken,
			},
			include: [
				{
					model: OAuthClient,
				},
				{
					model: User,
				},
			],
		}).then((token) => {
			if (!token) {
				return callback(new HttpException('Refresh token is invalid', HttpStatus.BAD_REQUEST));
			}

			return callback(null, {
				client: token.oAuthClient,
				user: token.user,
				refreshToken: token.refreshToken,
				refreshTokenExpiresAt: null,
				accessToken: token.accessToken,
				accessTokenExpiresAt: token.refreshTokenExpires,
			});
		});
	}

	revokeToken(accessToken, callback) : any{
		OAuthAccessToken.update({
			accessTokenExpiresAt: 0,
		}, {
			where: {
				accessToken: accessToken.accessToken,
			},
		}).then(() => {
			callback(null, {
				accessToken,
			});
		});
	}

	getClient(clientId: string, clientSecret:string, callback?: any): any {
		return OAuthClient.findOne({
			where: {
				id: clientId,
			},
		}).then((client) => {
			if (!client) {
				callback(new Error("non existent client"))
			}
			callback(null, client)
		})
	}

	getUserFromClient(clientId, callback) : any{
		callback(null, {
			userId: '00000000-0000-0000-0000-000000000000',
		});
	}

	getUser(email, password, callback): any {

		User.findOne({
			where: {
				email: email
			},

		}).then((user) => {
			if(!user){
				return callback(new BadRequestException('No such user'))
			}
			if(!user.isValidPassword(password)) {
				return callback(new UnauthorizedException('Invalid password'))
			}
			callback(null, user)
		})

	}

	saveToken(accessToken, client, user, callback) : any{

		OAuthAccessToken.upsert({
			accessToken: accessToken.accessToken,
			refreshToken: accessToken.refreshToken,
			accessTokenExpiresAt: accessToken.accessTokenExpiresAt,
			refreshTokenExpires: accessToken.refreshTokenExpiresAt,
			oAuthClientId: client.id,
			userId: user.id,
		}).then(() => {

			// OAuthAccessToken.findAll().then((res)=>console.log("tokens", res));
			callback(null, {
				user,
				accessToken,
				client,
			});
		});
	}

	verifyScope(scope, callback) : any{
		callback(null, true);
	}

	static getAuthCode() {
		throw new Error();
	}

	static saveAuthCode() {
		throw new Error();
	}

	getAuthorizationCode(authorizationCode: string, callback?: (err?: any, result?: OAuth2Server.AuthorizationCode) => void): Promise<OAuth2Server.AuthorizationCode | OAuth2Server.Falsey> {
		console.log("NOT HERE")
		return undefined;
	}

	revokeAuthorizationCode(code: OAuth2Server.AuthorizationCode, callback?: (err?: any, result?: boolean) => void): Promise<boolean> {
		console.log("NOT HERE")
		return undefined;
	}

	saveAuthorizationCode(code: Pick<OAuth2Server.AuthorizationCode, "authorizationCode" | "expiresAt" | "redirectUri" | "scope">, client: OAuth2Server.Client, user: OAuth2Server.User, callback?: (err?: any, result?: OAuth2Server.AuthorizationCode) => void): Promise<OAuth2Server.AuthorizationCode | OAuth2Server.Falsey> {
		console.log("NOT HERE")
		return undefined;

	}
}
