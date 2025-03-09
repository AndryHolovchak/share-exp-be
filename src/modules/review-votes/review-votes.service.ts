import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ReviewVote } from '../../common/database/schemas/review-vote.schema';
import { ReviewVoteDto } from './dto/crete-review-vote.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IReviewVoteUpdateEventPayload,
  REVIEW_VOTE_UPDATE_EVENT,
} from '../../common/events/review-vote.events';

@Injectable()
export class ReviewVotesService {
  constructor(
    @InjectModel(ReviewVote.name) private reviewVoteModel: Model<ReviewVote>,
    private eventEmitter: EventEmitter2,
  ) {}

  findReviewVotes(reviewId: string): Promise<ReviewVote[]> {
    return this.reviewVoteModel.find({ review: reviewId }).exec();
  }

  findUserVoteForReview(
    userId: string,
    reviewId: string,
  ): Promise<ReviewVote | null> {
    return this.reviewVoteModel
      .findOne({ review: reviewId, user: userId })
      .exec();
  }

  async updateVote(userId: string, reviewId: string, { vote }: ReviewVoteDto) {
    let result: ReviewVote | null = null;

    if (!vote) {
      await this.reviewVoteModel.deleteOne({
        user: userId,
        review: reviewId,
      });
    } else {
      result = await this.reviewVoteModel.findOneAndUpdate(
        { user: userId, review: reviewId },
        { $set: { vote } },
        { upsert: true, new: true },
      );
    }

    this.eventEmitter.emit(REVIEW_VOTE_UPDATE_EVENT, {
      reviewId,
    } as IReviewVoteUpdateEventPayload);

    return { vote: result };
  }
}
