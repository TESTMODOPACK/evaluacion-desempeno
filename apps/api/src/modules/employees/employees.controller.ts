import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller({ path: 'employees', version: '1' })
export class EmployeesController {
  @Get()
  list() {
    return { items: [], total: 0 };
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return { id: 'emp-demo', ...body };
  }
}
