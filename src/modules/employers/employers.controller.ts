import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EmployersService } from './employers.service';
import { CreateEmployerDto } from './dto/create-employer.dto';

@Controller('employers')
export class EmployersController {
  constructor(private employerService: EmployersService) {}
  @Post()
  create(@Body() createEmployerDto: CreateEmployerDto) {
    console.log(createEmployerDto);
    return this.employerService.create(createEmployerDto);
  }

  @Get()
  async getAll(@Query('search') search: string) {
    return this.employerService.getAll(search);
  }
}
