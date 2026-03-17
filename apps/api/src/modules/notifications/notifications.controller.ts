import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'notifications', version: '1' })
export class NotificationsController {
  @Get()
  list() {
    return { items: [], total: 0 };
  }
}
