import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../database/schemas/user.schema';

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest<{ user?: User }>();

    if (!user) {
      throw new UnauthorizedException('No user found in request');
    }

    return user;
  },
);
