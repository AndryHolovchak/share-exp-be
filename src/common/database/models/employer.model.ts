import { MongooseModule } from '@nestjs/mongoose';
import { Employer, EmployerSchema } from '../schemas/employer.schema';

export const EmployerModel = MongooseModule.forFeature([
  { name: Employer.name, schema: EmployerSchema },
]);
