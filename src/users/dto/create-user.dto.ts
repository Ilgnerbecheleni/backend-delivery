/* eslint-disable prettier/prettier */
import { IsEmail, IsIn, IsString, MinLength } from "class-validator";

export class CreateUserDto {
@IsString({message:"Utilize string"})
@MinLength(4,{message:"O nome deve conter no minimo 4 caracteres"})
nome:string;
@IsEmail()
email: string;
@IsString()
password:string;
@IsString()
  @IsIn(['USER', 'ADMIN'], { message: 'Role deve ser USER ou ADMIN' })
  role: string;
@IsString()
cpf:string
}
