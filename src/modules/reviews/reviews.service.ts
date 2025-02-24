import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '../../common/database/schemas/review.schema';
import { PaginationDto } from '../../common/dto/common.dto';
import { paginate } from '../../common/helpers/pagination.helper';
import { ICreateReviewRequest } from '../../common/interfaces/review.interface';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  create(request: ICreateReviewRequest) {
    const newReview = new this.reviewModel(request);
    return newReview.save();
  }

  findAll(paginationDto: PaginationDto, employerId?: string) {
    return paginate({
      model: this.reviewModel,
      filter: employerId ? { employerId } : {},
      pagination: paginationDto,
      populate: {
        path: 'author',
        select: '_id name email picture',
      },
    });
  }
}
