import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UserService } from 'src/users/users.service';
import authConfig from './config/auth.config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {}

  isAuthenticated: boolean = false;
  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        throw new UnauthorizedException(`User with email ${email} not found`);
      }
      console.log(password);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async signup(userDto: CreateUserDto) {
    const userOrError = await this.userService.createUser(userDto);
    return userOrError;
  }
}
