import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployersModule } from './modules/employers/employers.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import * as process from 'node:process';
import { ReviewVotesModule } from './modules/review-votes/review-votes.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI!, {
      auth: {
        username: process.env.MONGO_USER!,
        password: process.env.MONGO_PASSWORD!,
      },
    }),
    AuthModule,
    UserModule,
    ReviewsModule,
    EmployersModule,
    ReviewVotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
