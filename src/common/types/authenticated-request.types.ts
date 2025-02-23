import { User } from '../database/schemas/user.schema';

export interface AuthenticatedRequest extends Request {
  user: User;
}
