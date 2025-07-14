import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginationDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Paginated } from 'src/common/pagination/pagination.interface';
import { HashingProvider } from 'src/auth/provider/hashing.provider';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly paginationProvider: PaginationProvider,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}
  public async getUsers(
    query?: { gender?: string } & PaginationDto,
  ): Promise<Paginated<CreateUserDto>> {
    const allowedQueryParams = ['gender', 'page', 'limit'];

    try {
      if (query) {
        const invalidParams = Object.keys(query).filter(
          (key) => !allowedQueryParams.includes(key),
        );

        if (invalidParams.length > 0) {
          throw new BadRequestException(
            `Invalid query parameters: ${invalidParams.join(', ')}`,
          );
        }
      }
      const where: FindOptionsWhere<CreateUserDto> = {};
      // const qb = this.userRepository
      //   .createQueryBuilder('user')
      //   .leftJoinAndSelect('user.profile', 'profile');

      if (query?.gender) {
        // qb.andWhere('profile.gender = :gender', { gender: query.gender });
        where.profile = { gender: query.gender };
      }

      // return await qb.getMany();

      const users: Paginated<CreateUserDto> =
        await this.paginationProvider.paginateQuery(
          query as PaginationDto,
          this.userRepository,
          where,
        );
      return users;
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        'An error occurred while processing your request. Please try again later.',
      );
    }
  }

  async getUserById(id: number): Promise<CreateUserDto> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username });

    return user;
  }

  public async createUser(userDto: CreateUserDto) {
    try {
      const userByEmail = await this.getUserByEmail(userDto.email);
      const userByUsername = await this.getUserByUsername(userDto.username);

      if (userByEmail) {
        throw new BadRequestException('User with this email already exists');
      }

      if (userByUsername) {
        throw new BadRequestException('User with this username already exists');
      }
      userDto.profile = userDto.profile ?? {};
      const newUser = this.userRepository.create({
        ...userDto,
        password: await this.hashingProvider.hashPassword(userDto.password),
      });
      const response = await this.userRepository.save(newUser);

      return response;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string })?.code === 'ECONNREFUSED'
      ) {
        throw new RequestTimeoutException(
          'An error has ocurred, please try again.',
          {
            description: 'Database connection refused',
          },
        );
      }

      throw error;
    }
  }

  async updateUser(id: number, data: Partial<CreateUserDto>) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const updatedUser = await this.userRepository.save({
        ...user,
        ...data,
      });

      return {
        status: 'success',
        message: 'User updated',
        updatedUser,
      };
    } catch (error) {
      console.error('Error finding user:', error);
      throw new BadRequestException('Failed to find user');
    }
  }

  public async deleteUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    try {
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const deletedUser = await this.userRepository.delete(id);

      return {
        status: 'success',
        message: 'User deleted',
        deletedUser,
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new BadRequestException('Failed to delete user');
    }
  }
}
