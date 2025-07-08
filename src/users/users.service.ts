import { BadRequestException, Injectable } from '@nestjs/common';
import { UserType, UserResponse } from './interfaces/users.interface';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Profile } from 'src/profile/profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}
  public async getUsers(query?: any): Promise<User[]> {
    console.log('Query:', query);
    return await this.userRepository.find({
      relations: {
        profile: true,
      },
    });
  }

  async getUserById(id: number): Promise<CreateUserDto> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  getUserByEmail(email: string): UserType | string {
    console.log(email);
    return `User with email: ${email}`;
  }

  public async createUser(userDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: userDto.email,
      },
    });

    if (user) {
      return 'User already exists';
    }
    userDto.profile = userDto.profile ?? {};
    const newUser = this.userRepository.create(userDto);
    const response = await this.userRepository.save(newUser);

    return response;
  }

  updateUser(id: number, data: Partial<User>): UserResponse {
    console.log(id, data);
    return { status: 'success', message: 'User updated' };
  }

  public async deleteUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const deletedUser = await this.userRepository.delete(id);

    return {
      status: 'success',
      message: 'User deleted',
      deletedUser,
    };
  }
}
