import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ReviewVote } from '../../common/database/schemas/review-vote.schema';
import { ReviewVoteDto } from './dto/crete-review-vote.dto';

@Injectable()
export class ReviewVotesService {
  constructor(
    @InjectModel(ReviewVote.name) private reviewVoteModel: Model<ReviewVote>,
  ) {}

  async updateVote(userId: string, { vote, reviewId }: ReviewVoteDto) {
    if (!vote) {
      await this.reviewVoteModel.deleteOne({
        user: userId,
        review: reviewId,
      });

      return { vote: null };
    }

    const updatedVote = await this.reviewVoteModel.findOneAndUpdate(
      { user: userId, review: reviewId },
      { $set: { vote } },
      { upsert: true, new: true },
    );

    return { vote: updatedVote };
  }
}
