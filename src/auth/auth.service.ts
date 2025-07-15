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
import { HashingProvider } from './provider/hashing.provider';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,

    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
  ) {}

  isAuthenticated: boolean = false;
  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        throw new UnauthorizedException(`User with email ${email} not found`);
      }

      const isPasswordValid =
        (await this.hashingProvider.comparePassword(password, user.password)) ||
        false;

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      const token = await this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          secret: this.authConfiguration.secret,
          expiresIn: this.authConfiguration.expiresIn,
          audience: this.authConfiguration.audience,
          issuer: this.authConfiguration.issuer,
        },
      );

      return {
        token,
        success: true,
        message: 'Login successful',
      };
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
