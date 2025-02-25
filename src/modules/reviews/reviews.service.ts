import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { Review } from '../../common/database/schemas/review.schema';
import { PaginationDto } from '../../common/dto/common.dto';
import { ICreateReviewRequest } from '../../common/interfaces/review.interface';
import { getPaginationOptions } from '../../common/helpers/pagination.helper';

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
      this.reviewModel.find(
        filters,
        {},
        { ...getPaginationOptions(paginationDto), populate: 'author' },
      ),
    ]);

    return { rows, count };
  }
}
