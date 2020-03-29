import { ModelCtor } from 'sequelize-typescript';

export class BaseService {
	private model: ModelCtor;

	constructor(model : ModelCtor){
		this.model = model;
	}

	async create(data){
		return this.model.create(data);
	}
}
