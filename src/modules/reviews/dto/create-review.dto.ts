import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Rating, RatingEnum } from '../../../common/types/review.types';

export class CreateReviewDto {
  @ApiProperty({
    example: 5,
    description: 'The rating of the review',
  })
  @IsNotEmpty()
  @IsEnum(RatingEnum)
  rating: Rating;

  @ApiProperty({
    example: 'This is a review content',
    description: 'The content of the review',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: '65c8f9e2a1d5f2001e4f0a56',
    description: 'ID of the employer associated with this review',
  })
  @IsString()
  @IsNotEmpty()
  employerId: string;
}
