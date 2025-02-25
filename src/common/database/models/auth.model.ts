import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from '../schemas/auth.schema';

export const AuthModel = MongooseModule.forFeature([
  { name: Auth.name, schema: AuthSchema },
]);
