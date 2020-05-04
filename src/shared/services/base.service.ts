import { ModelCtor } from 'sequelize-typescript';

export class BaseService {

	private model: ModelCtor;

	constructor(model : ModelCtor){
		this.model = model;
	}

	/**
	 * Create instance of the model
	 * @param data
	 */
	async create(data){
		return this.model.create(data);
	}
}
