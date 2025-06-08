/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCreateDto } from './dto/auth.create.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly emailService: EmailService,

  ) {}

  verifyToken(token: string): any {
    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.SECRET });
      return decoded; // retorna o payload do token
    } catch (err) {
      throw new UnauthorizedException('Token inválido');
    }
  }


  async login (data:LoginDto){
   try {
    const {email , password} = data
    const user = await this.usersService.findByEmail(email)
    if(!user){
      throw new UnauthorizedException("usuario ou senha invalidos")
    }
    const checkpass = await bcrypt.compare(password, user.password)
    if(!checkpass){
      throw new UnauthorizedException("usuario ou senha invalidos")
    }
    const {nome,id , verificado, role }= user;
    const payload = {nome,id,verificado,role}
    const token = await this.jwtService.sign(payload, {
      audience:"login"
    })

    return {token} 
   } catch (error) {
   throw new UnauthorizedException(error.message) 
   }
  }



  async createUser(user: AuthCreateDto) {
    const existingUser = await this.usersService.findByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('Usuário já cadastrado');
    }
  
    // Criar o usuário
    const newUser = await this.usersService.create(user);
  
    // Gerar token de confirmação
    const confirmToken = this.jwtService.sign(
      { userId: newUser.id },
      { secret: process.env.JWT_SECRET, expiresIn: '1d' }
    );
  
    // Link de confirmação
    const confirmLink = `https://${process.env.URL}/auth/confirm?token=${confirmToken}`;
  
    // Enviar e-mail de confirmação usando o template
    await this.emailService.sendMail(
      newUser.email,                     // destinatário
      'Confirme seu cadastro',           // assunto
      'confirm-account.html',            // nome do template
      {
        name: newUser.nome,              // variável {{name}}
        link: confirmLink,               // variável {{link}}
        year: new Date().getFullYear().toString(), // variável {{year}}
      }
    );
  
    return { message: 'Cadastro realizado com sucesso. Verifique seu e-mail para confirmar o cadastro.' };
  }

  async confirmUser(token: string) {
    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.SECRET });
      const user = await this.usersService.findOne(decoded.userId);
console.log(token)
console.log(user)
      if (!user) {
        throw new BadRequestException('Usuário não encontrado');
      }

      if (user.verificado) {
        throw new BadRequestException('Usuário já verificado');
      }

      // Verificar usuário
      await this.usersService.verifyUser(user.id);

      return { message: 'Cadastro confirmado com sucesso!' };
    } catch (error) {
      throw new BadRequestException('Token de confirmação inválido ou expirado', error.message);
    }
  }

  async resetPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }
  
    // Gerar senha temporária de 6 dígitos
    const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();
  
    // Hash da senha temporária
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
  
    // Atualizar senha do usuário
    await this.usersService.updatePassword(user.id, hashedPassword);
  
    // Enviar email com a nova senha usando o template
    await this.emailService.sendMail(
      user.email,                   // destinatário
      'Reset de Senha',             // assunto
      'reset-password.html',        // nome do template
      {
        name: user.nome,            // variável {{name}}
        password: tempPassword,     // variável {{password}}
        year: new Date().getFullYear().toString(), // variável {{year}}
      }
    );
  
    return { message: 'Senha temporária enviada por email' };
  }
  


  async resendConfirmationEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (user.verificado) {
      throw new BadRequestException('Usuário já verificado');
    }

    // Gerar novo token de confirmação
    const confirmToken = this.jwtService.sign(
      { userId: user.id },
      { secret: process.env.JWT_SECRET, expiresIn: '1d' }
    );

    // Enviar novo email de confirmação
    const emailSubject = 'Reenvio de Confirmação de Cadastro';
    const confirmLink = `https://${process.env.URL}/auth/confirm?token=${confirmToken}`;
    const emailText = `Clique no link para confirmar seu cadastro: ${confirmLink}`;
    await this.emailService.sendMail(
      user.email,
      'Reenvio de Confirmação de Cadastro',
      'resend-confirmation.html',
      {
        name: user.nome,
        link: confirmLink,
        year: new Date().getFullYear().toString(),
      }
    );

    return { message: 'Email de confirmação reenviado com sucesso. Verifique seu e-mail.' };
  }



}


