import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { EmployersService } from './employers.service';
import { GetListDto, IdDto, PaginationDto } from '../../common/dto/common.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Employer } from '../../common/database/schemas/employer.schema';
import { PaginationOutputEntity } from '../../common/entities/pagination-output.entity';
import { Review } from '../../common/database/schemas/review.schema';
import { AuthGuard, NO_AUTH_METADATA } from '../../common/guards/auth.guard';
import { GetUser } from '../../common/decorators/get-user-decorator';
import { User } from '../../common/database/schemas/user.schema';
import { ReviewContentDto } from '../reviews/dto/review-content.dto';

@Controller('employers')
export class EmployersController {
  constructor(private employerService: EmployersService) {}
  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Employer,
  })
  async findById(@Param('id') id: string) {
    const employer = await this.employerService.findById(id);

    if (employer) return employer;

    throw new NotFoundException('Employee not found');
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: PaginationOutputEntity<Employer>,
  })
  async findAll(@Query() getListDto: GetListDto) {
    return this.employerService.findAll(getListDto);
  }

  @Get(':id/reviews')
  @ApiResponse({
    status: 200,
    type: PaginationOutputEntity<Review>,
  })
  @UseGuards(AuthGuard)
  @SetMetadata(NO_AUTH_METADATA, true)
  async findAllReviews(
    @Param() { id }: IdDto,
    @Query() paginationDto: PaginationDto,
    @GetUser() user?: User,
  ) {
    return this.employerService.findReviews(paginationDto, id, user?._id);
  }

  @Post(':id/reviews')
  @ApiResponse({
    status: 201,
    type: Review,
  })
  @UseGuards(AuthGuard)
  async createReview(
    @GetUser() user: User,
    @Param() { id }: IdDto,
    @Body() reviewContentDto: ReviewContentDto,
  ) {
    return this.employerService.addReview({
      employer: id,
      author: user._id,
      ...reviewContentDto,
    });
  }

  @Put('reviews/:id')
  @ApiResponse({
    status: 200,
    type: Review,
  })
  @UseGuards(AuthGuard)
  async updateReview(
    @GetUser() user: User,
    @Param() { id }: IdDto,
    @Body() reviewContentDto: ReviewContentDto,
  ) {
    return this.employerService.updateReview(user._id, {
      review: id,
      ...reviewContentDto,
    });
  }

  @Delete('reviews/:id')
  @UseGuards(AuthGuard)
  async deleteReview(@GetUser() user: User, @Param() { id }: IdDto) {
    return this.employerService.deleteReview(user._id, id);
  }
}
