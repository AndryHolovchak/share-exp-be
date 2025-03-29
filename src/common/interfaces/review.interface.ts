import { Types } from 'mongoose';
import { ReviewRatings } from '../types/review.types';
import { Employer } from '../database/schemas/employer.schema';
import { User } from '../database/schemas/user.schema';
import { Vote } from '../types/vote.types';
import { ReviewContentDto } from '../../modules/reviews/dto/review-content.dto';

export interface ICreateReviewRequest extends ReviewContentDto {
  employer: string;
  author: Types.ObjectId;
}

export interface IUpdateReviewRequest extends ReviewContentDto {
  review: string;
}

export interface IFullReview {
  _id: string;
  content?: string;
  ratings: ReviewRatings;
  employer: Employer;
  author: User;
  anonymous: boolean;
}

// todo: create DTO
export interface IReviewResponse extends Omit<IFullReview, 'author'> {
  author: IFullReview['author'] | null;
  isCurrentUserReview: boolean;
  currentUserVote: Vote | null;
}
