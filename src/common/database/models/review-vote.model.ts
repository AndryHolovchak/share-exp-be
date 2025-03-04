import { MongooseModule } from '@nestjs/mongoose';
import { ReviewVote, ReviewVoteSchema } from '../schemas/review-vote.schema';

export const ReviewVoteModel = MongooseModule.forFeature([
  { name: ReviewVote.name, schema: ReviewVoteSchema },
]);
