import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EmployersService } from './employers.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { GetListDto, IdDto } from '../../common/dto/common.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Employer } from '../../common/database/schemas/employer.schema';
import { PaginationOutputEntity } from '../../common/entities/pagination-output.entity';

@Controller('employers')
export class EmployersController {
  constructor(private employerService: EmployersService) {}
  @Post()
  create(@Body() createEmployerDto: CreateEmployerDto) {
    console.log(createEmployerDto);
    return this.employerService.create(createEmployerDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: PaginationOutputEntity<Employer>,
  })
  async getAll(@Query() getListDto: GetListDto) {
    return this.employerService.getAll(getListDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Employer,
  })
  async getById(@Param() idDto: IdDto) {
    return this.employerService.getById(idDto.id);
  }
}
