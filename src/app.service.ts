import { Injectable } from '@nestjs/common';

export interface Users {
	name: string,
	password: string,
	age: number,
}
@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}
	getSomethingElse = (defaultUser? : Users) : Users => {
		if(defaultUser){
			return defaultUser;
		}
		return {
			name: 'Mark',
			password: '123123123',
			age: 15,
		}
	}
}
