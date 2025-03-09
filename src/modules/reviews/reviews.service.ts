import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { Review } from '../../common/database/schemas/review.schema';
import { PaginationDto } from '../../common/dto/common.dto';
import {
  ICreateReviewRequest,
  IFullReview,
  IReviewResponse,
} from '../../common/interfaces/review.interface';
import { getPaginationOptions } from '../../common/helpers/pagination.helper';
import { User } from '../../common/database/schemas/user.schema';
import { Employer } from '../../common/database/schemas/employer.schema';
import { ReviewVotesService } from '../review-votes/review-votes.service';
import {
  IReviewVoteUpdateEventPayload,
  REVIEW_VOTE_UPDATE_EVENT,
} from '../../common/events/review-vote.events';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private reviewVotesService: ReviewVotesService,
  ) {}

  create(request: ICreateReviewRequest) {
    const newReview = new this.reviewModel(request);
    return newReview.save();
  }

  private async createReviewResponse(
    review: IFullReview,
    currentUser?: Types.ObjectId,
  ): Promise<IReviewResponse> {
    const currentUserVote =
      currentUser &&
      (await this.reviewVotesService.findUserVoteForReview(
        currentUser._id.toString(),
        review._id,
      ));
    return {
      ...review,
      author: review.anonymous ? null : review.author,
      currentUserVote: currentUserVote ? currentUserVote.vote : null,
      isCurrentUserReview:
        !!currentUser &&
        review.author._id.toString() === currentUser.toString(),
    };
  }

  async findAll(
    paginationDto: PaginationDto,
    employer?: string,
    userId?: Types.ObjectId,
  ) {
    const filters: RootFilterQuery<Review> = employer ? { employer } : {};

    const [count, rows] = await Promise.all([
      this.reviewModel.countDocuments(filters),
      this.reviewModel
        .find(filters, employer ? { employer: 0 } : {}, {
          sort: { createdAt: -1 },
          ...getPaginationOptions(paginationDto),
        })
        .populate<{ author: User }>('author')
        .lean<IFullReview[]>(),
    ]);

    const reviewResponses = await Promise.all(
      rows.map((review) => this.createReviewResponse(review, userId)),
    );

    return {
      count,
      rows: reviewResponses,
    };
  }

  async findByUser(paginationDto: PaginationDto, userId: Types.ObjectId) {
    const filters = { author: userId };

    const [count, rows] = await Promise.all([
      this.reviewModel.countDocuments(filters),
      this.reviewModel
        .find(
          filters,
          {},
          { sort: { createdAt: -1 }, ...getPaginationOptions(paginationDto) },
        )
        .populate<{ author: User; employer: Employer }>(['author', 'employer'])
        .lean<IFullReview[]>(),
    ]);

    const reviewResponses = await Promise.all(
      rows.map((review) => this.createReviewResponse(review, userId)),
    );

    return {
      count,
      rows: reviewResponses,
    };
  }

  @OnEvent(REVIEW_VOTE_UPDATE_EVENT)
  async updateReviewVoteRating(payload: IReviewVoteUpdateEventPayload) {
    const { reviewId } = payload;

    const votes = await this.reviewVotesService.findReviewVotes(reviewId);
    const voteRating = votes.reduce((sum, v) => sum + v.vote, 0);

    await this.reviewModel.updateOne(
      { _id: reviewId },
      { $set: { voteRating } },
    );
  }
}
