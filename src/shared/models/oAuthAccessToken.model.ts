import { Column, DataType, Index, Model, Table, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from './user.model';
import { OAuthClient } from './oAuthClient.model';

@Table
export class OAuthAccessToken extends Model<OAuthAccessToken> {
	@Column({
		type: DataType.STRING,
	})
	@Index
	accessToken: string;

	@Column({
		type: DataType.STRING,
	})
	@Index
	refreshToken: string;

	@Column({
		type: DataType.DATE,
	})
	accessTokenExpiresAt: Date;

	@Column({
		type: DataType.DATE,
	})
	refreshTokenExpires: Date;


	@ForeignKey(()=> User)
	userId: string;

	@ForeignKey(()=> OAuthClient)
	clientId: string;

	@BelongsTo(() => User)
	user: User;

	@BelongsTo(() => OAuthClient)
	oAuthClient: OAuthClient;
}
