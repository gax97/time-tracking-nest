import { Column, DataType, Model, Table } from 'sequelize-typescript';
import * as sequelize from 'sequelize';

/**
 * Represents OAuthClient
 * Only registered clients can have access to the API.
 */
@Table
export class OAuthClient extends Model<OAuthClient> {
	@Column({
		type: DataType.STRING,
		defaultValue: sequelize.UUIDV4,
		primaryKey: true,
		unique: true,
	})
	id: string;

	@Column({
		type: DataType.ARRAY(DataType.STRING)
	})
	grants: string;

	@Column({
		type: DataType.STRING,
		defaultValue: sequelize.UUIDV4,
	})
	clientSecret: Date;

	@Column({
		type: DataType.ENUM,
		values: ['public', 'confidential', 'web_application', 'native_application'],
		defaultValue: 'public',
	})
	clientType: Date;

	@Column(DataType.STRING)
	redirectUri: string;

}
