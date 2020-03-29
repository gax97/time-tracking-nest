import { ModelCtor } from 'sequelize-typescript';

export class BaseService {
	private model: ModelCtor<any>;

	constructor(model){
		this.model = model;
	}

	create(data){
		this.model.create(data);
	}
}
