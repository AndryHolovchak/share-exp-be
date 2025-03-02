import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../types/authenticated-request.types';
import { AuthService } from '../../modules/auth/auth.service';
import { Reflector } from '@nestjs/core';

export const NO_AUTH_METADATA = 'allow-no-auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers['authorization'] as string;

    const isOptional = this.reflector.get<boolean>(
      NO_AUTH_METADATA,
      context.getHandler(),
    );

    if (!authHeader) {
      if (isOptional) return true;

      throw new UnauthorizedException();
    }

    const token = authHeader.replace('Bearer ', '');

    const user = await this.authService.verifyAndAuthenticateUser(token);

    if (!user) {
      if (isOptional) return true;

      throw new UnauthorizedException('User does not exist in the system');
    }

    request.user = user;

    return true;
  }
}
