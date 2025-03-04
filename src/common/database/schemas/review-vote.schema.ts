import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Vote, VoteEnum } from '../../types/vote.types';

@Schema({ timestamps: true })
export class ReviewVote {
  @Prop({ enum: VoteEnum, required: true })
  vote: Vote;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'Review' })
  review: Types.ObjectId;
}

export const ReviewVoteSchema = SchemaFactory.createForClass(ReviewVote);
export type ReviewVoteDocument = Document & ReviewVote;
