import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  sharedSecret: process.env.AUTH_SHARED_SECRET,
}));
