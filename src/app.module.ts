import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployersModule } from './modules/employers/employers.module';
import { ReviewsModule } from './modules/reviews/reviews.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://mongo:cmBcNKffBYsxGghHCMoeMMNHEEsgxRRX@roundhouse.proxy.rlwy.net:31720',
      {
        auth: {
          username: 'mongo',
          password: 'cmBcNKffBYsxGghHCMoeMMNHEEsgxRRX',
        },
      },
    ),
    ReviewsModule,
    EmployersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
