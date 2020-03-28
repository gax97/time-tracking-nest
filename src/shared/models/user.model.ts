import { Column, DataType, Model, Table } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import * as sequelize from 'sequelize';
@Table
export class User extends Model<User> {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: sequelize.UUIDV4,
	})
	id: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	email: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		validate: {
			len: [1, 255],
		}
	})
	fullName: boolean;

	@Column({
		type: DataType.VIRTUAL,
		set: function (value) {
			this.setDataValue('password', bcrypt.hashSync(value, bcrypt.genSaltSync(10)));
		},
		validate: {
			len: [8, 255],
		},
	})
	passwordPlain: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	password: string;
}
