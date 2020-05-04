import {
	HttpException,
	HttpStatus,
	UnauthorizedException,
} from '@nestjs/common';
import * as OAuth2Server from 'oauth2-server';
import {OAuthClient} from '../models/oAuthClient.model';
import {OAuthAccessToken} from '../models/oAuthAccessToken.model';
import {User} from '../models/user.model';

import {
	AuthorizationCodeModel,
	ClientCredentialsModel,
	ExtensionModel, OAuthError,
	PasswordModel,
	RefreshTokenModel,
} from 'oauth2-server';
import { Time } from '../models/times.model';

/**
 * Auth service implements all interfaces required by oauth2-server in order to setup oAuth2 server.
 */
export class AuthService implements AuthorizationCodeModel, ExtensionModel, PasswordModel, RefreshTokenModel, ClientCredentialsModel{

	/**
	 *
	 * @param {string} accessToken - id of the accessToken
	 * @param {OAuth2Server.Callback} callback - callback to be executed on success
	 */
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

	/**
	 * Retrieve users refresh token if it valid
	 * @param {string} refreshToken - id of the refresh token
	 * @param {OAuth2Server.Callback} callback - callback to be executed on success
	 */
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

	/**
	 * Destroy user's token by expiring it.
	 * @param {OAuthAccessToken} accessToken - accessToken model.
	 * @param {OAuth2Server.Callback} callback - callback to be executed on success.
	 */
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

	/**
	 * Retrieve single client
	 * @param clientId - id of the Client
	 * @param clientSecret - client secret
	 * @param callback - callback to be executed on success
	 */
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

	/**
	 * Return "dummy" user that belongs to this client
	 */
	getUserFromClient(clientId, callback) : any{
		callback(null, {
			userId: '00000000-0000-0000-0000-000000000000',
		});
	}

	/**
	 * Retrieve single user by email and password
	 * @param {string} email - users email
	 * @param {string} password - users password
	 * @param {function} callback - function to be executed on success
	 */
	getUser(email, password, callback): any {
		User.findOne({
			where: {
				email: email
			},
			include: [
				{
					model: Time
				}
			]
		}).then((user) => {
			if(!user){
				return callback(new OAuthError(undefined, {code: 404, message: 'No such user'}))
			}
			if(!user.isValidPassword(password)) {
				return callback(new OAuthError(undefined, {code: 401, message: 'Invalid password'}))
			}
			return callback(null, user)
		})
	}

	/**
	 * Saves access token to the database. If accessToken with the same id exists it will be replaced with a new one.
	 * @param {OAuthAccessToken} accessToken - created access token
	 * @param {OAuthClient} client - oAuth client
	 * @param {User} user
	 * @param {function} callback - callback to be executed on success
	 */
	saveToken(accessToken, client, user, callback) : any{
		OAuthAccessToken.upsert({
			accessToken: accessToken.accessToken,
			refreshToken: accessToken.refreshToken,
			accessTokenExpiresAt: accessToken.accessTokenExpiresAt,
			refreshTokenExpires: accessToken.refreshTokenExpiresAt,
			oAuthClientId: client.id,
			userId: user.id,
		}).then(() => {
			callback(null, {
				user,
				accessToken,
				client,
			});
		});
	}

	/**
	 * @ignore
	 */
	verifyScope(scope, callback) : any{
		callback(null, true);
	}

	/**
	 * @ignore
	 */
	static getAuthCode() {
		throw new Error();
	}

	/**
	 * @ignore
	 */
	static saveAuthCode() {
		throw new Error();
	}

	/**
	 * @ignore
	 */
	getAuthorizationCode(authorizationCode: string, callback?: (err?: any, result?: OAuth2Server.AuthorizationCode) => void): Promise<OAuth2Server.AuthorizationCode | OAuth2Server.Falsey> {
		return undefined;
	}

	/**
	 * @ignore
	 */
	revokeAuthorizationCode(code: OAuth2Server.AuthorizationCode, callback?: (err?: any, result?: boolean) => void): Promise<boolean> {
		return undefined;
	}

	/**
	 * @ignore
	 */
	saveAuthorizationCode(code: Pick<OAuth2Server.AuthorizationCode, "authorizationCode" | "expiresAt" | "redirectUri" | "scope">, client: OAuth2Server.Client, user: OAuth2Server.User, callback?: (err?: any, result?: OAuth2Server.AuthorizationCode) => void): Promise<OAuth2Server.AuthorizationCode | OAuth2Server.Falsey> {
		return undefined;
	}
}
