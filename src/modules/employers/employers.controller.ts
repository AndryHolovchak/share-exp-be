import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmployersService } from './employers.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { GetListDto, PaginationDto } from '../../common/dto/common.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Employer } from '../../common/database/schemas/employer.schema';
import { PaginationOutputEntity } from '../../common/entities/pagination-output.entity';
import { Review } from '../../common/database/schemas/review.schema';
import { CreateEmployerReviewDto } from './dto/create-employer-review.dto';
import { ReviewsService } from '../reviews/reviews.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { GetUser } from '../../common/decorators/get-user-decorator';
import { User } from '../../common/database/schemas/user.schema';

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
  async findById(@Param('id') id: string) {
    return this.employerService.findById(id);
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
  @UseGuards(AuthGuard)
  async createReview(
    @GetUser() user: User,
    @Param('id') employerId: string,
    @Body() createReviewDto: CreateEmployerReviewDto,
  ) {
    return this.reviewService.create({
      employerId,
      ...createReviewDto,
    });
  }
}
