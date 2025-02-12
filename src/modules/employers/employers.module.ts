import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Employer,
  EmployerSchema,
} from '../../common/database/schemas/employer.schema';
import { EmployersService } from './employers.service';
import { EmployersController } from './employers.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employer.name, schema: EmployerSchema },
    ]),
  ],
  providers: [EmployersService],
  controllers: [EmployersController],
})
export class EmployersModule {}
