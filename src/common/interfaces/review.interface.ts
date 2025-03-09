import { CreateReviewDto } from '../../modules/reviews/dto/create-review.dto';
import { Types } from 'mongoose';
import { Rating } from '../types/review.types';
import { Employer } from '../database/schemas/employer.schema';
import { User } from '../database/schemas/user.schema';
import { ReviewVote } from '../database/schemas/review-vote.schema';

export interface ICreateReviewRequest extends CreateReviewDto {
  author: Types.ObjectId;
}

export interface IFullReview {
  _id: string;
  content: string;
  rating: Rating;
  employer: Employer;
  author: User;
  anonymous: boolean;
}

// todo: create DTO
export interface IReviewResponse extends Omit<IFullReview, 'author'> {
  author: IFullReview['author'] | null;
  isCurrentUserReview: boolean;
  currentUserVote: ReviewVote | null;
}
