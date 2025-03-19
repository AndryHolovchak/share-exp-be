import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employer } from '../../common/database/schemas/employer.schema';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { GetListDto, PaginationDto } from '../../common/dto/common.dto';
import { getPaginationOptions } from '../../common/helpers/pagination.helper';
import { ReviewsService } from '../reviews/reviews.service';
import { PaginationOutputEntity } from '../../common/entities/pagination-output.entity';
import { IPopulatedEmployer } from '../../common/interfaces/employer.interface';
import {
  ICreateReviewRequest,
  IUpdateReviewRequest,
} from '../../common/interfaces/review.interface';

@Injectable()
export class EmployersService {
  constructor(
    @InjectModel(Employer.name) private employerModel: Model<Employer>,
    private reviewService: ReviewsService,
  ) {}

  create(createEmployerDto: CreateEmployerDto) {
    const newEmployer = new this.employerModel(createEmployerDto);
    return newEmployer.save();
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
}
