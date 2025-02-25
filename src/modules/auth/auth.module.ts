import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthModel } from '../../common/database/models/auth.model';

@Module({
  imports: [UsersModule, AuthModel],
  providers: [AuthService],
  controllers: [],
  exports: [AuthService],
})
export class AuthModule {}
