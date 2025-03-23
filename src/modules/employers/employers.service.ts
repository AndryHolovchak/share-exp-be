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
import { EmployerSourceType } from '../../common/types/employer.types';

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

  async findByExternalId(externalId: string, sourceType: EmployerSourceType) {
    return this.employerModel.findOne({
      'source.type': sourceType,
      'source.externalId': externalId,
    });
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

    const [review] = await Promise.all([
      this.reviewService.create(request),

      this.employerModel.updateOne({ _id: request.employer }, [
        {
          $set: {
            totalReviews: { $add: ['$totalReviews', 1] },
            averageRating: {
              $round: [
                {
                  $divide: [
                    {
                      $add: [
                        { $multiply: ['$averageRating', '$totalReviews'] },
                        request.rating,
                      ],
                    },
                    { $add: ['$totalReviews', 1] },
                  ],
                },
              ],
            },
          },
        },
      ]),
    ]);

    return review;
  }

  async updateReview(userId: Types.ObjectId, request: IUpdateReviewRequest) {
    const oldReview = await this.reviewService.findById(request.review);

    if (oldReview && !oldReview.author.equals(userId)) {
      throw new ForbiddenException();
    }

    const updatedReview = await this.reviewService.update(request);

    console.log({ oldReview, updatedReview });

    if (!updatedReview) {
      throw new NotFoundException('Review not found');
    }

    await this.employerModel.updateOne({ _id: oldReview!.employer }, [
      {
        $set: {
          averageRating: {
            $round: [
              {
                $divide: [
                  {
                    $add: [
                      { $multiply: ['$averageRating', '$totalReviews'] },
                      updatedReview.rating,
                      { $multiply: [-1, oldReview!.rating] },
                    ],
                  },
                  '$totalReviews',
                ],
              },
              2,
            ],
          },
        },
      },
    ]);

    return updatedReview;
  }

  async deleteReview(userId: Types.ObjectId, reviewId: string) {
    // const session = await this.connection.startSession();

    try {
      // await session.withTransaction(async () => {
      const review = await this.reviewService.findById(reviewId);
      // .session(session);

      if (!review) {
        throw new NotFoundException('Review not found');
      }

      if (!review.author.equals(userId)) {
        throw new ForbiddenException();
      }

      await review.deleteOne(); //.session(session);

      const stats = await this.reviewModel.aggregate<{
        _id: string;
        averageRating: number;
        totalReviews: number;
      }>([
        { $match: { employer: review.employer } },
        {
          $group: {
            _id: '$employer',
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
          },
        },
      ]);
      // .session(session);

      await this.employerModel.updateOne(
        { _id: review.employer },
        {
          $set: {
            averageRating: stats[0]?.averageRating ?? 0,
            totalReviews: stats[0]?.totalReviews ?? 0,
          },
        },
        // { session },
      );
      // });
    } finally {
      // await session.endSession();
    }
  }
}
