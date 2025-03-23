import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Rating, RatingEnum } from '../../types/review.types';
import { EmployerSourceEnum } from '../../types/employer.types';
import { IEmployerSource } from '../../interfaces/employer.interface';

@Schema({ timestamps: true })
export class Employer {
  @Prop({
    type: {
      type: String,
      enum: EmployerSourceEnum,
      required: true,
    },
    externalId: {
      type: String,
      required: true,
    },
  })
  source: IEmployerSource;

  // data from the source
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  shortDescriptionHtml: string;

  // @Prop({ required: true })
  // fullDescriptionHtml: string;

  @Prop({ required: true })
  categoryDescription: string;

  @Prop()
  logoUrl?: string;

  @Prop()
  website?: string;
  // --

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
