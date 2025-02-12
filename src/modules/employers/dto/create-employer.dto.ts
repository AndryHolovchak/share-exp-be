import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployerDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
