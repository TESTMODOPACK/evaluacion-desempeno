import { Controller, Get, Param, Body, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FeedbackService } from './feedback.service';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'feedback', version: '1' })
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('inbox/:employeeId')
  inbox(@Param('employeeId') employeeId: string) {
    return this.feedbackService.getInbox(employeeId);
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return { id: 'feedback-demo', ...body }; // TODO: Create endpoint if needed for submitting feedback
  }
}
