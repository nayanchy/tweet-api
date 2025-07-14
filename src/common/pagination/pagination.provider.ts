import { Inject, Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination-query.dto';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from './pagination.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationDto,
    repository: Repository<T>,
    where?: FindOptionsWhere<T>,
  ): Promise<Paginated<T>> {
    const page = paginationQuery?.page || 1;
    const limit = paginationQuery?.limit || 10;

    const findOptions: FindManyOptions<T> = {
      skip: (page - 1) * limit,
      take: limit,
    };
    const result = await repository.findAndCount({
      ...findOptions,
      where,
    });

    const [data, totalItems] = result;
    const totalPages = Math.ceil(totalItems / limit);
    const baseUrl =
      this.request.protocol +
      '://' +
      this.request.host +
      this.request.originalUrl.split('?')[0];

    const firstPageLink = `${baseUrl}?page=1&limit=${limit}`;
    const lastPageLink = `${baseUrl}?page=${totalPages}&limit=${limit}`;
    const currentPageLink = `${baseUrl}?page=${page}&limit=${limit}`;
    const nextPageLink =
      page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null;
    const previousPageLink =
      page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null;

    const res: Paginated<T> = {
      data,
      meta: {
        itemsPerPage: limit,
        totalItems,
        currentPage: page,
        totalPages,
      },
      links: {
        first: firstPageLink,
        last: lastPageLink,
        current: currentPageLink,
        next: nextPageLink,
        previous: previousPageLink,
      },
    };

    return res;
  }
}
