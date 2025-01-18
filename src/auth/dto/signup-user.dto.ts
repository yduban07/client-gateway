import { IsEmail, IsString, IsStrongPassword } from "class-validator";


export class SignupUserDto {

    @IsString()
    name: string;
  
    @IsString()
    @IsEmail()
    email:string;
  
    @IsString()
    @IsStrongPassword()
    password: string;
  
  }