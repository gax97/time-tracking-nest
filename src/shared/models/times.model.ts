import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import * as sequelize from 'sequelize';
import { User } from './user.model';

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
	})
	startTime: Date;

	@Column({
		type: DataType.DATE,
		allowNull: true,
		defaultValue: null,
	})
	endTime: Date;

	@Column({

	})
	label: string;

	@ForeignKey(()=> User)
	userId: string;

	@BelongsTo(() => User)
	user: User;

}
