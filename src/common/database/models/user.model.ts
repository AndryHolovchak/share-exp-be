import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';

export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);
