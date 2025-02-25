import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EAuthProvider } from '../../types/auth.types';
import { Schema as MongooseSchema, SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: false })
export class Auth {
  @Prop({ type: SchemaTypes.ObjectId, auto: true }) // Explicitly defining _id
  _id: Types.ObjectId;

  @Prop({ required: true })
  provider: EAuthProvider;

  @Prop({ required: true, unique: true })
  providerId: string; // Unique per provider

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true }) // Reference to User
  user: Types.ObjectId;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
