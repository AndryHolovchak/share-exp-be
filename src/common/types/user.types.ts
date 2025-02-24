import { User } from '../database/schemas/user.schema';

export type TUserBase = Pick<User, 'name' | 'email' | '_id'>;
