import { IPaginationOutput } from '../interfaces/pagination-output';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationOutputEntity<T> implements IPaginationOutput<T> {
  @ApiProperty({ isArray: true })
  rows: T[];

  @ApiProperty()
  count: number;
}
