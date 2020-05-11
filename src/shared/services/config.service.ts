import { SequelizeModuleOptions } from '@nestjs/sequelize/dist/interfaces/sequelize-options.interface';

require('dotenv').config();

class ConfigService {

	constructor(private env: { [k: string]: string | undefined }) { }

	private getValue(key: string, throwOnMissing = true): string {
		const value = this.env[key];
		if (typeof value === 'undefined' && throwOnMissing) {
			throw new Error(`config error - missing env.${key}`);
		}

		return value;
	}

	public ensureValues(keys: string[]) {
		keys.forEach(k => this.getValue(k, true));
		return this;
	}

	public getPort() {
		return this.getValue('PORT', true);
	}

	public isProduction() {
		const mode = this.getValue('MODE', false);
		return mode != 'DEV';
	}

	/**
	 * Retrieve postgres config for production and development
	 */
	public getPostgresConfig(): SequelizeModuleOptions {
		return {
			dialect: 'postgres',
			host: this.getValue('POSTGRES_HOST'),
			port: parseInt(this.getValue('POSTGRES_PORT')),
			username: this.getValue('POSTGRES_USERNAME'),
			password: this.getValue('POSTGRES_PASSWORD'),
			database: this.getValue('POSTGRES_DATABASE'),
			autoLoadModels: this.getValue('POSTGRES_AUTO_LOAD_MODELS') === 'true',
			synchronize: this.getValue('POSTGRES_SYNCRONIZE') === 'true',
		};
	}

	/**
	 * Retrieve postgres config for testing
	 */
	public getTestPostgresConfig(): SequelizeModuleOptions {
		return {
			dialect: 'postgres',
			host: this.getValue('POSTGRES_HOST'),
			port: parseInt(this.getValue('POSTGRES_PORT')),
			username: this.getValue('POSTGRES_USERNAME'),
			password: this.getValue('POSTGRES_PASSWORD'),
			database: 'database_test',
			autoLoadModels: true,
			synchronize: true,
		};
	}

}

const configService = new ConfigService(process.env)
	.ensureValues([
		'POSTGRES_HOST',
		'POSTGRES_PORT',
		'POSTGRES_USERNAME',
		'POSTGRES_PASSWORD',
		'POSTGRES_DATABASE',
		'POSTGRES_AUTO_LOAD_MODELS',
		'POSTGRES_SYNCRONIZE',
		'PORT',
	]);

export { configService };
