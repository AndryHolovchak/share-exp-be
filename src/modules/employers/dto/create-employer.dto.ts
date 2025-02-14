import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployerDto {
  @ApiProperty({
    example: 'Google',
    description: 'Employer name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
