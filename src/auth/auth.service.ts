import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  isAuthenticated: boolean = false;
  login(email: string, password: string) {
    const userOrError = this.userService.getUserByEmail(email);
    if (typeof userOrError === 'string') {
      return {
        authenticated: false,
        session: null,
        message: 'User not found',
      };
    } else {
      const isPasswordValid = userOrError.password === password;

      if (isPasswordValid) {
        this.isAuthenticated = true;
      }

      if (!isPasswordValid) {
        return {
          authenticated: false,
          session: null,
          message: 'Password does not match',
        };
      }
      return {
        authenticated: true,
        session: {
          userId: userOrError.id,
          email: userOrError.email,
          firstName: userOrError.firstName,
        },
      };
    }
  }
}
