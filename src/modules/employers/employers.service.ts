import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employer } from '../../common/database/schemas/employer.schema';
import { Model } from 'mongoose';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { GetListDto } from '../../common/dto/common.dto';
import { paginate } from '../../common/helpers/pagination.helper';

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

  findAll(getListDto: GetListDto) {
    return paginate(
      this.employerModel,
      {
        name: { $regex: getListDto.search ?? '', $options: 'i' },
      },
      getListDto,
    );
  }
}
