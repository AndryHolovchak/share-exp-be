import { Module } from '@nestjs/common';
import { UserModel } from '../../common/database/models/user.model';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ReviewsModule } from '../reviews/reviews.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserModel, ReviewsModule, AuthModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
