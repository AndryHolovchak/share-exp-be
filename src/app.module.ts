import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployersModule } from './modules/employers/employers.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://mongo:xerLwPvqPwJOVHuASVxlVclJoUqbsTTx@trolley.proxy.rlwy.net:40616',
      {
        auth: {
          username: 'mongo',
          password: 'xerLwPvqPwJOVHuASVxlVclJoUqbsTTx',
        },
      },
    ),
    AuthModule,
    UsersModule,
    ReviewsModule,
    EmployersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
