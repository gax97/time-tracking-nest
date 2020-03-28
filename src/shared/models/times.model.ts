import { Column, DataType, Model, Table } from 'sequelize-typescript';
import * as sequelize from 'sequelize';

@Table
export class Time extends Model<Time> {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: sequelize.UUIDV4,
	})
	id: string;

	@Column({
		type: DataType.DATE,
		allowNull: false,
		unique: 'Email address already in use!',
		validate: {
			isEmail: true,
		},
	})
	startTime: Date;

	@Column({
		type: DataType.DATE,
		allowNull: true,
		defaultValue: null,
	})
	endTime: Date;

	@Column({
		type: DataType.STRING,
		allowNull: true,
		defaultValue: 'no-label'
	})
	label: string;
}
