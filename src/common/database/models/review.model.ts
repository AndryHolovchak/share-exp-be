import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from '../schemas/review.schema';

export const ReviewModel = MongooseModule.forFeature([
  { name: Review.name, schema: ReviewSchema },
]);
