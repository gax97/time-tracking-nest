import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../shared/models/user.model';
import { OAuthClient } from '../../shared/models/oAuthClient.model';
import { OAuthAccessToken } from '../../shared/models/oAuthAccessToken.model';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User)
		private userModel: typeof User,
		@InjectModel(OAuthClient)
		private clientModel: typeof OAuthClient,
		@InjectModel(OAuthAccessToken)
		private tokenModel: typeof OAuthAccessToken,
	) {

	}

	createClient(){
		return this.clientModel.create({})
	}
	/**
	 * Find single client.
	 * @param clientId - id of the client
	 */
	async getClient(clientId: string): Promise<OAuthClient>{
		return this.clientModel.findOne({
			where: {
				id: clientId,
			},
		});
	}

	/**
	 * Logout user
	 * @param token - token to be destroyed with the logout
	 */
	async logout(token: string): Promise<boolean>{
		const deletedTokens = await this.tokenModel.destroy({
			where: {
				accessToken: token,
			},
		});
		return deletedTokens <= 0;
	}

}
