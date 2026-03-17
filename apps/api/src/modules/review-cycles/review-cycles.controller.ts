import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller({ path: 'review-cycles', version: '1' })
export class ReviewCyclesController {
  @Get()
  list() {
    return { items: [], total: 0 };
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return { id: 'cycle-demo', status: 'DRAFT', ...body };
  }
}
