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
  @ApiResponse({
    status: 201,
    type: Employer,
  })
  create(@Body() createEmployerDto: CreateEmployerDto) {
    return this.employerService.create(createEmployerDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: PaginationOutputEntity<Employer>,
  })
  async findAll(@Query() getListDto: GetListDto) {
    return this.employerService.findAll(getListDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Employer,
  })
  async findById(@Param() idDto: IdDto) {
    return this.employerService.findById(idDto.id);
  }
}
