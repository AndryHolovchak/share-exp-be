import { Module } from '@nestjs/common';
import { ReviewModel } from '../../common/database/models/review.model';

@Module({
  imports: [ReviewModel],
  providers: [],
  controllers: [],
  exports: [ReviewModel],
})
export class ReviewsModule {}
