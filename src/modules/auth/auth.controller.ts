import { Controller, Delete, Get, Post } from '@nestjs/common';


@Controller('auth')
export class AuthController {
	@Get('sign-up')
	signUp(){
		return "SMOG";
	}
	@Post('sign-in')
	signIn(){
		return "SMOG";
	}
	@Delete('sign-out')
	signOut(){
		return "sign out"
	}
}
