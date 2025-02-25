import { PaginationDto } from '../dto/common.dto';

export function getPaginationOptions(pagination: PaginationDto) {
  const { limit = 10, page = 1 } = pagination;

  return { skip: (page - 1) * limit, limit };
}
