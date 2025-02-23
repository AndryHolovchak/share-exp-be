import { OmitType } from '@nestjs/swagger';
import { CreateReviewDto } from '../../reviews/dto/create-review.dto';

export class CreateEmployerReviewDto extends OmitType(CreateReviewDto, [
  'employerId',
] as const) {}
