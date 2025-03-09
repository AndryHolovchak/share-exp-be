import { Module } from '@nestjs/common';
import { ReviewVoteModel } from '../../common/database/models/review-vote.model';
import { ReviewVotesService } from './review-votes.service';
import { ReviewVotesController } from './review-votes.controller';
import { AuthModule } from '../auth/auth.module';
import { ReviewModel } from '../../common/database/models/review.model';

@Module({
  imports: [ReviewVoteModel, AuthModule, ReviewModel],
  providers: [ReviewVotesService],
  controllers: [ReviewVotesController],
  exports: [ReviewVotesService],
})
export class ReviewVotesModule {}
