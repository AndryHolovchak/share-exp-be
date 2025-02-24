import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EAuthProvider } from '../../types/auth.types';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: SchemaTypes.ObjectId, auto: true }) // Explicitly defining _id
  _id: Types.ObjectId;

  @Prop({ required: true })
  provider: EAuthProvider;

  @Prop({ required: true, unique: true })
  providerId: string; // Unique per provider

  @Prop({ required: false, unique: false })
  email?: string;

  @Prop()
  name?: string;

  @Prop()
  picture?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
