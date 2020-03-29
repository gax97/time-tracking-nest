import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import * as sequelize from 'sequelize';
import { Time } from './times.model';
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

	isValidPassword(pw: string): boolean{
		return bcrypt.compareSync(pw, this.getDataValue('password'));
	}

	@Column({
		type: DataType.VIRTUAL,
		validate: {
			len: [8, 255],
		},
	})
	set passwordPlain(value: string){
		if(value.length < 8 || value.length > 255){
			throw new Error("Validation error");
		}
		this.setDataValue('password', bcrypt.hashSync(value, bcrypt.genSaltSync(10)));
	}

	@Column({
		type: DataType.STRING,
	})
	password: string;

	@HasMany(()=> Time)
	times: Time[];
}
