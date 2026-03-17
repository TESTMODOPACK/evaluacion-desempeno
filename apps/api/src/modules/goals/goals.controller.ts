import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller({ path: 'goals', version: '1' })
export class GoalsController {
  @Get()
  list() {
    return { items: [], total: 0 };
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return { id: 'goal-demo', ...body };
  }
}
