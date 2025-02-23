import { Module } from '@nestjs/common';
import { EmployersService } from './employers.service';
import { EmployersController } from './employers.controller';
import { EmployerModel } from '../../common/database/models/employer.model';
import { ReviewsModule } from '../reviews/reviews.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [EmployerModel, ReviewsModule, AuthModule],
  providers: [EmployersService],
  controllers: [EmployersController],
})
export class EmployersModule {}
