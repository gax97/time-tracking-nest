import { ModelCtor } from 'sequelize-typescript';

export abstract class BaseService {

	private model: ModelCtor;

	protected constructor(model : ModelCtor){
		this.model = model;
	}

	/**
	 * Create instance of the model
	 * @param data
	 */
	create(data): any{
		return this.model.create(data);
	}
}
