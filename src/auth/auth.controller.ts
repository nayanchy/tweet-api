import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    return await this.authService.login(email, password);
  }
}
