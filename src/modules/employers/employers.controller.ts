import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EmployersService } from './employers.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { GetListDto, IdDto, PaginationDto } from '../../common/dto/common.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Employer } from '../../common/database/schemas/employer.schema';
import { PaginationOutputEntity } from '../../common/entities/pagination-output.entity';
import { Review } from '../../common/database/schemas/review.schema';
import { CreateEmployerReviewDto } from './dto/create-employer-review.dto';
import { ReviewsService } from '../reviews/reviews.service';

@Controller('employers')
export class EmployersController {
  constructor(
    private employerService: EmployersService,
    private reviewService: ReviewsService,
  ) {}
  @Post()
  @ApiResponse({
    status: 201,
    type: Employer,
  })
  create(@Body() createEmployerDto: CreateEmployerDto) {
    return this.employerService.create(createEmployerDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: PaginationOutputEntity<Employer>,
  })
  async findAll(@Query() getListDto: GetListDto) {
    return this.employerService.findAll(getListDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Employer,
  })
  async findById(@Param() idDto: IdDto) {
    return this.employerService.findById(idDto.id);
  }

  @Get(':id/reviews')
  @ApiResponse({
    status: 200,
    type: PaginationOutputEntity<Review>,
  })
  async findAllReviews(
    @Param('id') employerId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.reviewService.findAll(paginationDto, employerId);
  }

  @Post(':id/reviews')
  @ApiResponse({
    status: 201,
    type: Review,
  })
  async createReview(
    @Param('id') employerId: string,
    @Body() createReviewDto: CreateEmployerReviewDto,
  ) {
    return this.reviewService.create({
      employerId,
      ...createReviewDto,
    });
  }
}
