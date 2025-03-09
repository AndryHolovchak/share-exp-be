import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ReviewVotesService } from './review-votes.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ReviewVote } from '../../common/database/schemas/review-vote.schema';
import { GetUser } from '../../common/decorators/get-user-decorator';
import { User } from '../../common/database/schemas/user.schema';
import { ReviewVoteDto } from './dto/crete-review-vote.dto';
import { Response } from 'express';
@Controller('review-votes')
export class ReviewVotesController {
  constructor(private reviewVotesService: ReviewVotesService) {}

  @Put(':reviewId')
  @ApiResponse({
    status: 201,
    type: ReviewVote,
  })
  @ApiResponse({
    status: 204,
  })
  @UseGuards(AuthGuard)
  async updateVote(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: User,
    @Param('reviewId') reviewId: string,
    @Body() reviewVoteDto: ReviewVoteDto,
  ) {
    const { vote } = await this.reviewVotesService.updateVote(
      user._id.toString(),
      reviewId,
      reviewVoteDto,
    );

    if (vote === null) {
      res.status(HttpStatus.NO_CONTENT);
    }

    return vote;
  }
}
