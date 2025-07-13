import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination-query.dto';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

@Injectable()
export class PaginationProvider {
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationDto,
    repository: Repository<T>,
    where?: FindOptionsWhere<T>,
  ) {
    const page = paginationQuery?.page || 1;
    const limit = paginationQuery?.limit || 10;
    const findOptions: FindManyOptions<T> = {
      skip: (page - 1) * limit,
      take: limit,
    };
    const res = await repository.find({
      ...findOptions,
      where,
    });

    return res;
  }
}
