import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employer } from '../../common/database/schemas/employer.schema';
import { Model, RootFilterQuery } from 'mongoose';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { GetListDto } from '../../common/dto/common.dto';
import { getPaginationOptions } from '../../common/helpers/pagination.helper';

@Injectable()
export class EmployersService {
  constructor(
    @InjectModel(Employer.name) private employerModel: Model<Employer>,
  ) {}

  create(createEmployerDto: CreateEmployerDto) {
    const newEmployer = new this.employerModel(createEmployerDto);
    return newEmployer.save();
  }

  findById(id: string) {
    return this.employerModel.findById(id);
  }

  async findAll(getListDto: GetListDto) {
    const filters: RootFilterQuery<Employer> = {
      name: { $regex: getListDto.search ?? '', $options: 'i' },
    };

    const [count, rows] = await Promise.all([
      this.employerModel.countDocuments(filters),
      this.employerModel.find(filters, {}, getPaginationOptions(getListDto)),
    ]);

    return { rows, count };
  }
}
