import { Post, Body, Get, Inject } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { SigninUserDto, SignupUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post('signup')
  registerUser(@Body() signupUserDto: SignupUserDto) {
    return this.client.send('auth.signup.user', signupUserDto);
  }

  @Post('signin')
  loginUser(@Body() signinUserDto: SigninUserDto) {
    return this.client.send('auth.signin.user', signinUserDto);
  }


  @Get('verify')
  verifyToken() {
  }
}
