import { CreateReviewDto } from '../../modules/reviews/dto/create-review.dto';
import { Types } from 'mongoose';

export interface ICreateReviewRequest extends CreateReviewDto {
  author: Types.ObjectId;
}
