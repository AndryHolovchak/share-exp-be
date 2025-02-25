import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthModel } from '../../common/database/models/auth.model';
import { UserModel } from '../../common/database/models/user.model';

@Module({
  imports: [AuthModel, UserModel],
  providers: [AuthService],
  controllers: [],
  exports: [AuthService],
})
export class AuthModule {}
