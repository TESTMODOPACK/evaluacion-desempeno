import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller({ path: 'feedback', version: '1' })
export class FeedbackController {
  @Get('inbox')
  inbox() {
    return { items: [], total: 0 };
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return { id: 'feedback-demo', ...body };
  }
}
