import { Post, Body, Get, Inject } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { SigninUserDto, SignupUserDto } from './dto';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post('signup')
  async registerUser(@Body() signupUserDto: SignupUserDto) {
    try {

      return await firstValueFrom(this.client.send('auth.signup.user', signupUserDto));
      
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('signin')
  loginUser(@Body() signinUserDto: SigninUserDto) {
    return this.client.send('auth.signin.user', signinUserDto);
  }


  @Get('verify')
  verifyToken() {
  }
}
