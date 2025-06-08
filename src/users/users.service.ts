/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

import { Role, User } from 'generated/prisma';


@Injectable()
export class UsersService {

  constructor(private readonly prisma: PrismaService) { }


  async create(createUserDto: CreateUserDto) {
    try {
      const { password, nome, email , role , cpf} = createUserDto;
      
      const exists = await this.findByEmail(email)

      if (exists) {
        throw new BadRequestException('Usuario ja cadastrado')
      }


      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      const user = await this.prisma.user.create({ data: { nome: nome, email: email, password: hash, role: role as Role, cpf:cpf  } });
      return user;
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      return users
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  async findOne(id: string):Promise<User> {
   try {
    const user = await this.prisma.user.findFirst({where: { id: id}})
    if(!user){
      throw new NotFoundException(`usuario ${id} não encontrado`)
    }
    return user;
   } catch (error) {
    throw new NotFoundException(error.message)
   }

  }

  async updatePassword(userId: string, newPassword: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: newPassword , resetPass: true},
    });
  }

  

  async verifyUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        verificado: true,
       
      },
    });
  }


  async findByEmail(email:string){
    try {
      const user = await this.prisma.user.findFirst({where:{email:email}})
      if(user){
        return user
      }
      return ;
    } catch (error) {
      
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
