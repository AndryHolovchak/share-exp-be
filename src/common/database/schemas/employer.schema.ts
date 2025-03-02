import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Rating, RatingEnum } from '../../types/review.types';

@Schema({ timestamps: true })
export class Employer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number, enum: RatingEnum, default: 0 })
  averageRating: Rating;

  @Prop({ required: true, type: Number, default: 0 })
  totalReviews: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const EmployerSchema = SchemaFactory.createForClass(Employer);
