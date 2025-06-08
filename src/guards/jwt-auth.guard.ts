// jwt-auth.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthService } from 'src/auth/auth.service'; // ajuste o path conforme seu projeto
  import { Reflector } from '@nestjs/core';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(private authService: AuthService) {}
  
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
  
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Token não encontrado');
      }
  
      const token = authHeader.split(' ')[1];
      const user = this.authService.verifyToken(token); // chama o método que você criou
  
      if (!user) {
        throw new UnauthorizedException('Usuário inválido');
      }
  
      request.user = user; // salva o user no request pro controller e outros guards usarem
      return true;
    }
  }
  