import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashPassword(password: string): Promise<string> {
    try {
      // Generate a Salt
      const salt = await bcrypt.genSalt();
      // Hash the password with the salt
      const hashedPass = await bcrypt.hash(password, salt);
      return hashedPass;
    } catch (error) {
      console.log(error);
      throw new Error('Error hasing password');
    }
  }

  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
