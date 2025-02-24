import { Controller, Get, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ApiResponse } from '@nestjs/swagger';
import { PaginationOutputEntity } from '../../common/entities/pagination-output.entity';
import { PaginationDto } from '../../common/dto/common.dto';
import { Review } from '../../common/database/schemas/review.schema';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewService: ReviewsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: PaginationOutputEntity<Review>,
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.reviewService.findAll(paginationDto);
  }
}
