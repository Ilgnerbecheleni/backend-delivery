// self-or-admin.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  
  @Injectable()
  export class SelfOrAdminGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user; // já deve estar preenchido com os dados do token
      const paramId = request.params.id;
  console.log(user)
      if (!user) {
        throw new ForbiddenException('Usuário não autenticado');
      }
  
      if (user.role?.includes('ADMIN')) {
        return true; // admin pode tudo
      }
  
      if (user.id == paramId) {
        return true; // usuário acessando o próprio recurso
      }
  
      throw new ForbiddenException('Acesso negado');
    }
  }
  