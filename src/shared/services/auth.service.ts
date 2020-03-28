import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as OAuth2Server from 'oauth2-server';
import {OAuthClient} from '../models/oAuthClient.model';
import {OAuthAccessToken} from '../models/oAuthAccessToken.model';
import {User} from '../models/user.model';
import {Time} from '../models/times.model';
import * as bcrypt from 'bcrypt';
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
			return callback(null, {user: {},
					accessToken: '123',
					accessTokenExpiresAt: new Date(),
					refreshToken: '123',
					refreshTokenExpiresAt: new Date()});
			if (!token) {
				return callback(new Error('Token is invalid'));
			}

			return callback(null, {
				user: token.user,
				accessToken: token.accessToken,
				accessTokenExpiresAt: token.accessTokenExpiresAt,
				refreshToken: token.refreshToken,
				refreshTokenExpiresAt: token.refreshTokenExpires,
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
				return callback(new Error('Refresh token is invalid'));
			}

			return callback(null, {
				client: token.oAuthClient,
				user: token.user,
				refreshToken: token.refreshToken,
				refreshTokenExpiresAt: token.refreshTokenExpires,
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
			include: [{
				model: Time,
				where: {
					endTime: null,
				},
				required: false
			}
			]

		}).then((user) => {
			if(!user || bcrypt.compareSync(user.password, password)) {
				callback(new Error())
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
				accessToken,
				user,
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
		return undefined;
	}

	revokeAuthorizationCode(code: OAuth2Server.AuthorizationCode, callback?: (err?: any, result?: boolean) => void): Promise<boolean> {
		return undefined;
	}

	saveAuthorizationCode(code: Pick<OAuth2Server.AuthorizationCode, "authorizationCode" | "expiresAt" | "redirectUri" | "scope">, client: OAuth2Server.Client, user: OAuth2Server.User, callback?: (err?: any, result?: OAuth2Server.AuthorizationCode) => void): Promise<OAuth2Server.AuthorizationCode | OAuth2Server.Falsey> {
		return undefined;
	}
}
