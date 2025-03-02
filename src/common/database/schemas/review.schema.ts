import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Rating, RatingEnum } from '../../types/review.types';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, enum: RatingEnum })
  rating: Rating;

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
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
export type ReviewDocument = Document & Review;
