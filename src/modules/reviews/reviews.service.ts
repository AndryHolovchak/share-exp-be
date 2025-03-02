import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { Review } from '../../common/database/schemas/review.schema';
import { PaginationDto } from '../../common/dto/common.dto';
import {
  ICreateReviewRequest,
  IFullReview,
  IReviewResponse,
} from '../../common/interfaces/review.interface';
import { getPaginationOptions } from '../../common/helpers/pagination.helper';
import { User } from '../../common/database/schemas/user.schema';
import { Employer } from '../../common/database/schemas/employer.schema';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  create(request: ICreateReviewRequest) {
    const newReview = new this.reviewModel(request);
    return newReview.save();
  }

  private sanitizeReview(
    review: IFullReview,
    currentUser?: Types.ObjectId,
  ): IReviewResponse {
    return {
      ...review,
      author: review.anonymous ? null : review.author,
      isCurrentUserReview:
        !!currentUser &&
        review.author._id.toString() === currentUser.toString(),
    };
  }

  async findAll(
    paginationDto: PaginationDto,
    employer?: string,
    userId?: Types.ObjectId,
  ) {
    const filters: RootFilterQuery<Review> = employer ? { employer } : {};

    const [count, rows] = await Promise.all([
      this.reviewModel.countDocuments(filters),
      this.reviewModel
        .find(filters, employer ? { employer: 0 } : {}, {
          sort: { updatedAt: -1 },
          ...getPaginationOptions(paginationDto),
        })
        .populate<{ author: User }>('author')
        .lean<IFullReview[]>(),
    ]);

    return {
      count,
      rows: rows.map((review) => this.sanitizeReview(review, userId)),
    };
  }

  async findByUser(paginationDto: PaginationDto, userId: Types.ObjectId) {
    const filters = { author: userId };

    const [count, rows] = await Promise.all([
      this.reviewModel.countDocuments(filters),
      this.reviewModel
        .find(
          filters,
          {},
          { sort: { updatedAt: -1 }, ...getPaginationOptions(paginationDto) },
        )
        .populate<{ author: User; employer: Employer }>(['author', 'employer'])
        .lean<IFullReview[]>(),
    ]);

    return {
      count,
      rows: rows.map((review) => this.sanitizeReview(review, userId)),
    };
  }
}
