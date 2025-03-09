import { Module } from '@nestjs/common';
import { ReviewModel } from '../../common/database/models/review.model';
import { ReviewsController } from './reivews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewVotesModule } from '../review-votes/review-votes.module';

@Module({
  imports: [ReviewModel, ReviewVotesModule],
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [ReviewModel, ReviewsService],
})
export class ReviewsModule {}
