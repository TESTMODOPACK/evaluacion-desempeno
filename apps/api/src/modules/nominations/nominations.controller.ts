import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller({ path: 'nominations', version: '1' })
export class NominationsController {
  @Get()
  list() {
    return { items: [], total: 0 };
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return { id: 'nomination-demo', status: 'PENDING', ...body };
  }
}
