import { Model, RootFilterQuery } from 'mongoose';
import { PaginationDto } from '../dto/common.dto';
import { IPaginationOutput } from '../interfaces/pagination-output';

export async function paginate<Entity>(
  model: Model<Entity>,
  filter: RootFilterQuery<Entity>,
  pagination: PaginationDto,
): Promise<IPaginationOutput<Entity>> {
  const { limit = 10, page = 1 } = pagination;

  const [count, rows] = await Promise.all([
    model.countDocuments(filter).exec(),
    model.find(filter, {}, { skip: (page - 1) * limit, limit }).exec(),
  ]);

  return { rows, count };
}
