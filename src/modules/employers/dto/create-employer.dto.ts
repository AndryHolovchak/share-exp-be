import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployerDto {
  @ApiProperty({
    example: 'Google',
    description: 'Employer name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
