import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Rating, RatingEnum } from '../../types/review.types';
import { Schema as MongooseSchema, Types } from 'mongoose';

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
  employer: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true }) // Reference to User
  author: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
