/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCreateDto } from './dto/auth.create.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() user: AuthCreateDto) {
    return this.authService.createUser(user);
  }

  @Post('login')
  login(@Body() login: LoginDto) {
    return this.authService.login(login);
  }
  @Post('reset-password')
  async resetPassword(@Body('email') email: string) {
    return this.authService.resetPassword(email);
  }
  @Get('confirm')
  async confirmUser(@Query('token') token: string) {
    return this.authService.confirmUser(token);
  }

  @Post('resend-confirmation')
  async resendConfirmation(@Body('email') email: string) {
    return this.authService.resendConfirmationEmail(email);
  }
}
