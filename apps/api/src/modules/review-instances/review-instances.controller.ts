import { Body, Controller, Post } from '@nestjs/common';

@Controller({ path: 'review-instances', version: '1' })
export class ReviewInstancesController {
  @Post('submit')
  submit(@Body() body: Record<string, unknown>) {
    return { id: 'instance-demo', status: 'SUBMITTED', ...body };
  }

  @Post('signoff')
  signoff(@Body() body: Record<string, unknown>) {
    return { id: 'signoff-demo', status: 'SIGNED_OFF', ...body };
  }
}
