import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Rating, RatingEnum } from '../../types/review.types';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { TUserBase } from '../../types/user.types';

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
  employerId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true }) // Reference to User
  author: Types.ObjectId | TUserBase;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
