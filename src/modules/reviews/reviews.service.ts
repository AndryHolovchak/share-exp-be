import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { Review } from '../../common/database/schemas/review.schema';
import { PaginationDto } from '../../common/dto/common.dto';
import { ICreateReviewRequest } from '../../common/interfaces/review.interface';
import { getPaginationOptions } from '../../common/helpers/pagination.helper';
import { User } from '../../common/database/schemas/user.schema';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  create(request: ICreateReviewRequest) {
    const newReview = new this.reviewModel(request);
    return newReview.save();
  }

  async findAll(paginationDto: PaginationDto, employerId?: string) {
    const filters: RootFilterQuery<Review> = employerId ? { employerId } : {};

    const [count, rows] = await Promise.all([
      this.reviewModel.countDocuments(filters),
      this.reviewModel
        .find(
          filters,
          {},
          { sort: { updatedAt: -1 }, ...getPaginationOptions(paginationDto) },
        )
        .populate<{ author: User }>('author'),
    ]);

    return { rows, count };
  }

  async getReviewCountsForEmployers(
    employerIds: Types.ObjectId[],
  ): Promise<Record<string, number>> {
    const reviewCounts: { _id: string; count: number }[] =
      await this.reviewModel.aggregate([
        { $match: { employerId: { $in: employerIds } } }, // Filter by employerId, not employer
        { $group: { _id: '$employerId', count: { $sum: 1 } } }, // Group by employerId and count reviews
      ]);

    // Convert results into an easy-to-use object
    return reviewCounts.reduce(
      (acc, item) => {
        acc[item._id] = item.count;
        return acc;
      },
      {} as Record<string, number>,
    );
  }
}
