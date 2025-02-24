import { Model, PopulateOptions, RootFilterQuery } from 'mongoose';
import { PaginationDto } from '../dto/common.dto';
import { IPaginationOutput } from '../interfaces/pagination-output';

interface Params<Entity> {
  model: Model<Entity>;
  filter: RootFilterQuery<Entity>;
  pagination: PaginationDto;
  populate?: PopulateOptions | (PopulateOptions | string)[];
}

export async function paginate<Entity>({
  model,
  filter,
  pagination,
  populate = [],
}: Params<Entity>): Promise<IPaginationOutput<Entity>> {
  const { limit = 10, page = 1 } = pagination;

  const [count, rows] = await Promise.all([
    model.countDocuments(filter).exec(),
    model
      .find(filter, {}, { skip: (page - 1) * limit, limit })
      .sort({ createdAt: -1 })
      .populate(populate)
      .exec(),
  ]);

  return { rows, count };
}
