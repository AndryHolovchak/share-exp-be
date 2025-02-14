import { Module } from '@nestjs/common';
import { ReviewModel } from '../../common/database/models/review.model';
import { ReviewsController } from './reivews.controller';

@Module({
  imports: [ReviewModel],
  providers: [],
  controllers: [ReviewsController],
  exports: [ReviewModel],
})
export class ReviewsModule {}
