import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    example: 1,
    description: 'page number',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'records limit',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit?: number = 10;
}

export class GetListDto extends PaginationDto {
  @ApiProperty({
    example: 'search',
    description: 'search',
    required: false,
  })
  @IsOptional()
  readonly search?: string = '';
}

export class IdDto {
  @ApiProperty({
    example: '67ad10313aca914f3a549f64',
    description: 'record id',
    required: true,
  })
  @Type(() => String)
  readonly id: string;
}
