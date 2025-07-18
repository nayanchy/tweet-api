import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.JWT_TOKEN_SECRET,
  expiresIn: parseInt(process.env?.JWT_TOKEN_EXPIRATION ?? '3600', 10),
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
  refreshTokenExpiration: parseInt(
    process.env?.REFRESH_TOKEN_EXPIRATION ?? '86400',
    10,
  ),
}));
