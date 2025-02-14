import { BadRequestException, Controller, Post } from '@nestjs/common';

@Controller('reviews')
export class ReviewsController {
  constructor() {}

  @Post()
  create() {
    throw new BadRequestException('Not implemented');
  }
}
