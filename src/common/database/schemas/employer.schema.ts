import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Rating } from '../../types/review.types';

@Schema({ timestamps: true })
export class Employer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 0 })
  totalViews: number;

  @Prop({ required: true, default: 0 })
  totalReviews: number;

  @Prop({ required: true, default: 0 })
  averageRating: Rating;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const EmployerSchema = SchemaFactory.createForClass(Employer);
