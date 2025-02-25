import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../common/database/schemas/user.schema';
import { ICreateUserRequest } from '../../common/types/user.types';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: Types.ObjectId): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async createUser({
    name,
    email,
    picture,
  }: ICreateUserRequest): Promise<User> {
    const user = new this.userModel({ email, name, picture });
    await user.save();

    return user;
  }
}
