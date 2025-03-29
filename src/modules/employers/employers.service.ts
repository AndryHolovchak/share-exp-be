import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Employer } from '../../common/database/schemas/employer.schema';
import { Connection, Model, RootFilterQuery, Types } from 'mongoose';
import { GetListDto, PaginationDto } from '../../common/dto/common.dto';
import { getPaginationOptions } from '../../common/helpers/pagination.helper';
import { ReviewsService } from '../reviews/reviews.service';
import { PaginationOutputEntity } from '../../common/entities/pagination-output.entity';
import {
  EmployerDetails,
  IEmployerSource,
  IPopulatedEmployer,
} from '../../common/interfaces/employer.interface';
import {
  ICreateReviewRequest,
  IUpdateReviewRequest,
} from '../../common/interfaces/review.interface';
import { Review } from '../../common/database/schemas/review.schema';
import { ReviewRatingCategory } from '../../common/types/review.types';
import { EMPTY_REVIEW_RATINGS } from '../../common/constants/review.constants';

@Injectable()
export class EmployersService {
  constructor(
    @InjectModel(Employer.name) private employerModel: Model<Employer>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectConnection() private readonly connection: Connection,
    private reviewService: ReviewsService,
  ) {}

  async createOrUpdateBySource(
    source: IEmployerSource,
    data: Omit<EmployerDetails, 'id'>,
  ) {
    return this.employerModel.findOneAndUpdate(
      {
        'source.externalId': source.externalId,
        'source.type': source.type,
      },
      {
        $set: {
          name: data.name,
          shortDescriptionHtml: data.shortDescriptionHtml,
          // fullDescriptionHtml: data.fullDescriptionHtml,
          categoryDescription: data.categoryDescription,
          logoUrl: data.logoUrl,
          website: data.website,
        },
      },
      { upsert: true, new: true },
    );
  }

  async findById(id: string): Promise<IPopulatedEmployer | null> {
    return this.employerModel.findById(id).lean();
  }

  async findAll(
    getListDto: GetListDto,
  ): Promise<PaginationOutputEntity<IPopulatedEmployer>> {
    const filters: RootFilterQuery<Employer> = {
      name: { $regex: getListDto.search ?? '', $options: 'i' },
    };

    const [count, rows] = await Promise.all([
      this.employerModel.countDocuments(filters),
      this.employerModel
        .find(filters, {}, getPaginationOptions(getListDto))
        .lean(),
    ]);

    return {
      count,
      rows,
    };
  }

  private async validateEmployer(id: string) {
    const employer = await this.employerModel.exists({ _id: id });

    if (!employer) {
      throw new BadRequestException('Employer not found');
    }
  }

  async findReviews(
    paginationDto: PaginationDto,
    employerId: string,
    userId?: Types.ObjectId,
  ) {
    await this.validateEmployer(employerId);

    return this.reviewService.findAll(paginationDto, employerId, userId);
  }

  async addReview(request: ICreateReviewRequest) {
    await this.validateEmployer(request.employer);

    const review = await this.reviewService.create(request);

    const updateFields = Object.keys(review.ratings).reduce((acc, category) => {
      acc[`averageRatings.${category}`] = {
        $round: [
          {
            $divide: [
              {
                $add: [
                  {
                    $multiply: [`$averageRatings.${category}`, '$totalReviews'],
                  },
                  review.ratings[category],
                ],
              },
              { $add: ['$totalReviews', 1] },
            ],
          },
          2, // Round to 2 decimal places
        ],
      };
      return acc;
    }, {});

    await this.employerModel.updateOne({ _id: request.employer }, [
      {
        $set: {
          totalReviews: { $add: ['$totalReviews', 1] },
          ...updateFields,
        },
      },
    ]);

    return review;
  }
  async updateReview(userId: Types.ObjectId, request: IUpdateReviewRequest) {
    const oldReview = await this.reviewService.findById(request.review);

    if (!oldReview) {
      throw new NotFoundException('Review not found');
    }

    if (!oldReview.author.equals(userId)) {
      throw new ForbiddenException();
    }

    const updatedReview = await this.reviewService.update(request);

    if (!updatedReview) {
      throw new NotFoundException('Review not found after update');
    }

    const updateFields = Object.keys(updatedReview.ratings).reduce(
      (acc, category) => {
        acc[`averageRatings.${category}`] = {
          $divide: [
            {
              $add: [
                {
                  $multiply: [`$averageRatings.${category}`, '$totalReviews'],
                },
                updatedReview.ratings[category],
                { $multiply: [-1, oldReview.ratings[category]] },
              ],
            },
            '$totalReviews',
          ],
        };
        return acc;
      },
      {},
    );

    await this.employerModel.updateOne({ _id: oldReview.employer }, [
      { $set: updateFields },
    ]);

    return updatedReview;
  }
  async deleteReview(userId: Types.ObjectId, reviewId: string) {
    const review = await this.reviewService.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (!review.author.equals(userId)) {
      throw new ForbiddenException();
    }

    await review.deleteOne();

    const reviews = await this.reviewModel.find({
      employer: review.employer,
    });

    const totalReviews = reviews.length;
    const updatedRatings: Record<ReviewRatingCategory, number> =
      EMPTY_REVIEW_RATINGS;

    // Calculate the sum of ratings for each category
    reviews.forEach((r) => {
      Object.keys(r.ratings).forEach((category) => {
        updatedRatings[category as ReviewRatingCategory] =
          (updatedRatings[category as ReviewRatingCategory] || 0) +
          r.ratings[category as ReviewRatingCategory];
      });
    });

    // Calculate the new average for each category
    const averageRatings: Record<ReviewRatingCategory, number> = {} as Record<
      ReviewRatingCategory,
      number
    >;
    Object.keys(updatedRatings).forEach((category) => {
      averageRatings[category as ReviewRatingCategory] = totalReviews
        ? parseFloat(
            (
              updatedRatings[category as ReviewRatingCategory] / totalReviews
            ).toFixed(2),
          )
        : 0;
    });

    // Update employer's average ratings and total reviews
    await this.employerModel.updateOne(
      { _id: review.employer },
      {
        $set: {
          averageRatings,
          totalReviews,
        },
      },
    );
  }
}
