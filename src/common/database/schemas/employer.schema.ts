import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Employer {
  @Prop({ required: true })
  name: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const EmployerSchema = SchemaFactory.createForClass(Employer);
