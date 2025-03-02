import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { Review } from '../../common/database/schemas/review.schema';
import { PaginationDto } from '../../common/dto/common.dto';
import { ICreateReviewRequest } from '../../common/interfaces/review.interface';
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

  async findAll(paginationDto: PaginationDto, employer?: string) {
    const filters: RootFilterQuery<Review> = employer ? { employer } : {};

    const [count, rows] = await Promise.all([
      this.reviewModel.countDocuments(filters),
      this.reviewModel
        .find(filters, employer ? { employer: 0 } : {}, {
          sort: { updatedAt: -1 },
          ...getPaginationOptions(paginationDto),
        })
        .populate<{ author: User }>('author'),
    ]);

    return { rows, count };
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
        .populate<{ author: User; employer: Employer }>(['author', 'employer']),
    ]);

    return { rows, count };
  }
}
