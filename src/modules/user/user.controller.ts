import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PaginationOutputEntity } from '../../common/entities/pagination-output.entity';
import { Review } from '../../common/database/schemas/review.schema';
import { PaginationDto } from '../../common/dto/common.dto';
import { ReviewsService } from '../reviews/reviews.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { GetUser } from '../../common/decorators/get-user-decorator';
import { User } from '../../common/database/schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private reviewService: ReviewsService) {}

  @Get('reviews')
  @ApiResponse({
    status: 200,
    type: PaginationOutputEntity<Review>,
  })
  @UseGuards(AuthGuard)
  findAll(@Query() paginationDto: PaginationDto, @GetUser() user: User) {
    return this.reviewService.findByUser(paginationDto, user._id);
  }
}
