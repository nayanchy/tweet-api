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
import { RefreshTokenDto } from './dto/refresh-toke.dto';
import { User } from 'src/users/user.entity';

type ExpirationKey = 'expiresIn' | 'refreshTokenExpiration';

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

      const token = await this.signToken(user.id, 'expiresIn', {
        email: user.email,
      });

      const refreshToken = await this.signToken(
        user.id,
        'refreshTokenExpiration',
      );

      return {
        token,
        refreshToken,
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

  private async signToken<T>(
    userId: number,
    expirationKey: ExpirationKey,
    payload?: T,
  ) {
    const token = await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.authConfiguration.secret,
        expiresIn: this.authConfiguration[expirationKey],
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      },
    );

    return token;
  }

  private async generateToken(user: User) {
    const accessToken = await this.signToken(user.id, 'expiresIn', {
      email: user.email,
    });

    const refreshToken = await this.signToken(
      user.id,
      'refreshTokenExpiration',
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    // Verify the refresh token
    try {
      const { sub }: { sub: number } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.authConfiguration.secret,
          audience: this.authConfiguration.audience,
          issuer: this.authConfiguration.issuer,
        },
      );

      const user = await this.userService.getUserById(sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newToken = await this.generateToken(user as User);

      return newToken;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error);
    }
  }
}
