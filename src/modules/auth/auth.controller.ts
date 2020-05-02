import {
	BadRequestException,
	Body,
	Controller,
	Delete, Get,
	NotFoundException,
	Post, Req, Res, UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import * as OAuth2Server from 'oauth2-server';
import { oauth } from '../../lib/oauth';

import { Request, Response } from 'express';

class SignUpParameters{
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	fullName: string;

	@IsNotEmpty()
	@Length(8, 255, {message: "Password must bet at lest 8 characters long"})
	password: string;

	@IsNotEmpty()
	clientId: string;
}

@Controller('auth')
export class AuthController {
	constructor(private readonly userService: UsersService, private readonly authService: AuthService){}

	@Post('sign-up')
	async signUp(@Body() signUpParameters: SignUpParameters){
		const {
			email,
			fullName,
			password,
			clientId,
		} = signUpParameters;
		console.log(email,
			fullName,
			password,
			clientId,)
		const client = await this.authService.getClient(clientId);

		if(!client){
			throw new NotFoundException(null,'OAuth client not found')
		}
		const user = await this.userService.getUserByEmail(email);
		if(user){
			throw new BadRequestException(null, 'User already exists')
		}
		await this.userService.create({email, fullName, passwordPlain: password});

		return {
			success: true,
			message: 'ok'
		};
	}
	@Post('sign-in')
	async signIn(@Req() req: Request, @Res() res: Response){

		const request = new OAuth2Server.Request(req);
		const response = new OAuth2Server.Response(res);

		const data = await oauth.token(request, response);

		res.status(200).send(data);
	}
	@Delete('sign-out')
	async signOut(@Res() res: Response){
		await this.authService.logout(res.locals.token.accessToken);
		res.status(200).send()
	}
}
