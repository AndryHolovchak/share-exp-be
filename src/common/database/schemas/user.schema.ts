import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EAuthProvider } from '../../types/auth.types';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  provider: EAuthProvider;

  @Prop({ required: true, unique: true })
  providerId: string; // Unique per provider

  @Prop({ required: false, unique: false })
  email?: string;

  @Prop()
  name?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
