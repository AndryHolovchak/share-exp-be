import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employer } from '../../common/database/schemas/employer.schema';
import mongoose, { Model, RootFilterQuery } from 'mongoose';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { GetListDto } from '../../common/dto/common.dto';
import { getPaginationOptions } from '../../common/helpers/pagination.helper';
import { ReviewsService } from '../reviews/reviews.service';
import { PaginationOutputEntity } from '../../common/entities/pagination-output.entity';
import { IPopulatedEmployer } from '../../common/interfaces/employer.interface';

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
    const [employer, reviewCount] = await Promise.all([
      this.employerModel.findById(id).lean(),
      this.reviewService.getReviewCountsForEmployers([
        new mongoose.Types.ObjectId(id),
      ]),
    ]);

    return (
      employer && {
        ...employer,
        totalReviews: reviewCount[id.toString()] ?? 0,
      }
    );
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

    const reviewsCount = await this.reviewService.getReviewCountsForEmployers(
      rows.map((row) => row._id),
    );

    return {
      count,
      rows: rows.map((row) => ({
        ...row,
        totalReviews: reviewsCount[row._id.toString()] ?? 0,
      })),
    };
  }
}
