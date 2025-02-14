import { Module } from '@nestjs/common';
import { ReviewModel } from '../../common/database/models/review.model';
import { ReviewsController } from './reivews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [ReviewModel],
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [ReviewModel],
})
export class ReviewsModule {}
