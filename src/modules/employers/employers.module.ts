import { Module } from '@nestjs/common';
import { EmployersService } from './employers.service';
import { EmployersController } from './employers.controller';
import { EmployerModel } from '../../common/database/models/employer.model';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [EmployerModel, ReviewsModule],
  providers: [EmployersService],
  controllers: [EmployersController],
})
export class EmployersModule {}
