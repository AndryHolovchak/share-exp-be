import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../common/database/schemas/user.schema';
import { AuthPayload } from '../../common/types/auth.types';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOrCreateUser({
    provider,
    providerId,
    name,
    email,
  }: AuthPayload): Promise<User> {
    let user = await this.userModel.findOne({ provider, providerId });

    if (!user) {
      user = new this.userModel({ provider, providerId, email, name });
      await user.save();
    }

    return user;
  }
}
