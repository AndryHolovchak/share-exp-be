import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Vote, VoteEnum } from '../../../common/types/vote.types';

export class ReviewVoteDto {
  @ApiProperty({
    example: 'upvote',
    description: "The vote's value. Can be 'upvote' or 'downvote'",
  })
  @IsOptional()
  @IsEnum(VoteEnum)
  vote?: Vote | null;

  @ApiProperty({
    example: '65c8f9e2a1d5f2001e4f0a56',
    description: "The review's id",
  })
  @IsString()
  @IsNotEmpty()
  reviewId: string;
}
