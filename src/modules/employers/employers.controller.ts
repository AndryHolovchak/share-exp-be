import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { EmployersService } from './employers.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { GetListDto, IdDto, PaginationDto } from '../../common/dto/common.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Employer } from '../../common/database/schemas/employer.schema';
import { PaginationOutputEntity } from '../../common/entities/pagination-output.entity';
import { Review } from '../../common/database/schemas/review.schema';
import { CreateEmployerReviewDto } from './dto/create-employer-review.dto';
import { AuthGuard, NO_AUTH_METADATA } from '../../common/guards/auth.guard';
import { GetUser } from '../../common/decorators/get-user-decorator';
import { User } from '../../common/database/schemas/user.schema';

@Controller('employers')
export class EmployersController {
  constructor(private employerService: EmployersService) {}
  @Post()
  @ApiResponse({
    status: 201,
    type: Employer,
  })
  create(@Body() createEmployerDto: CreateEmployerDto) {
    return this.employerService.create(createEmployerDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Employer,
  })
  async findById(@Param('id') id: string) {
    return this.employerService.findById(id);
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
    @Body() createReviewDto: CreateEmployerReviewDto,
  ) {
    return this.employerService.addReview({
      employer: id,
      author: user._id,
      ...createReviewDto,
    });
  }
}
