import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: SchemaTypes.ObjectId, auto: true }) // Explicitly defining _id
  _id: Types.ObjectId;

  @Prop({ required: false, unique: false })
  email?: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  picture?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
