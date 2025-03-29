import { IsEnum, Max, Min } from 'class-validator';
import { Rating, RatingEnum } from '../types/review.types';

export class ReviewRatingsDTO {
  @IsEnum(RatingEnum)
  @Min(0)
  @Max(5)
  salary_and_benefits: Rating;

  @IsEnum(RatingEnum)
  @Min(0)
  @Max(5)
  work_life_balance: Rating;

  @IsEnum(RatingEnum)
  @Min(0)
  @Max(5)
  justice_and_equality: Rating;

  @IsEnum(RatingEnum)
  @Min(0)
  @Max(5)
  career_growth: Rating;

  @IsEnum(RatingEnum)
  @Min(0)
  @Max(5)
  management: Rating;
}
