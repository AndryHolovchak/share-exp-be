import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReviewRatingsDTO } from '../../../common/dto/review.dto';

export class ReviewContentDto {
  @ApiProperty({
    description: 'The ratings of the review',
    type: ReviewRatingsDTO,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => ReviewRatingsDTO)
  ratings: ReviewRatingsDTO;

  @ApiProperty({
    example: 'This is a review content',
    description: 'The content of the review',
  })
  @IsString()
  @IsOptional()
  @MaxLength(2048)
  content?: string;

  @ApiProperty({
    example: 'true',
    description: 'Is the review anonymous?',
  })
  @IsBoolean()
  anonymous: boolean;
}
