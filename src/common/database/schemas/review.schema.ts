import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ReviewRatings } from '../../types/review.types';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Object, required: true })
  ratings: ReviewRatings;

  @Prop({
    required: true,
    ref: 'Employer',
    type: MongooseSchema.Types.ObjectId,
  })
  employer: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true }) // Reference to User
  author: Types.ObjectId;

  @Prop({ required: true })
  anonymous: boolean;

  @Prop({ type: Number, default: 0 }) // Overall vote rating
  voteRating: number;

  @Prop()
  content?: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
export type ReviewDocument = Document & Review;
