import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '../../common/database/schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { PaginationDto } from '../../common/dto/common.dto';
import { paginate } from '../../common/helpers/pagination.helper';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  create(reviewDto: CreateReviewDto) {
    const newReview = new this.reviewModel(reviewDto);
    return newReview.save();
  }

  findAll(paginationDto: PaginationDto) {
    return paginate(this.reviewModel, {}, paginationDto);
  }
}
