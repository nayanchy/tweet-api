import { IsOptional, IsPositive } from 'class-validator';
import { PaginationDto } from './pagination-query.dto';
import { IntersectionType } from '@nestjs/mapped-types';

class QueryBaseDto {
  @IsOptional()
  @IsPositive()
  userId?: number;
}

export class QueryDto extends IntersectionType(QueryBaseDto, PaginationDto) {}
