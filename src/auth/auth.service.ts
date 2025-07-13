import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UserService } from 'src/users/users.service';
import authConfig from './config/auth.config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {}

  isAuthenticated: boolean = false;
  async login(email: string, password: string) {
    const userOrError = await this.userService.getUserByEmail(email);
    console.log(password, userOrError);

    console.log('Auth Config:', this.authConfiguration);

    return userOrError;
  }
}
