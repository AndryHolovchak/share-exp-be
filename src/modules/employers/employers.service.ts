import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employer } from '../../common/database/schemas/employer.schema';
import { Model } from 'mongoose';
import { CreateEmployerDto } from './dto/create-employer.dto';

@Injectable()
export class EmployersService {
  constructor(
    @InjectModel(Employer.name) private employerModel: Model<Employer>,
  ) {}

  create(createEmployerDto: CreateEmployerDto) {
    const newEmployer = new this.employerModel(createEmployerDto);
    return newEmployer.save();
  }

  getAll(name: string = '') {
    return this.employerModel.find({
      name: { $regex: name, $options: 'i' },
    });
  }
}
