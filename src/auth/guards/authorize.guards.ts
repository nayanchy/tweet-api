import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import authConfig from '../config/auth.config';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from 'src/contants/constants';
import { ActiveUserData } from '../decorators/active-user.interface';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,

    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Read the metadata to check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Authorization token is missing');
    }
    try {
      const payload = await this.jwtService.verifyAsync<ActiveUserData>(
        token,
        this.authConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}
