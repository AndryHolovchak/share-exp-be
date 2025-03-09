import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Vote, VoteEnum } from '../../../common/types/vote.types';

export class ReviewVoteDto {
  @ApiProperty({
    example: 1,
    description: "The vote's value. Can be 1 or -1",
  })
  @IsOptional()
  @IsEnum(VoteEnum)
  vote?: Vote | null;
}
