import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller({ path: 'calibration', version: '1' })
export class CalibrationController {
  @Get('sessions')
  sessions() {
    return { items: [], total: 0 };
  }

  @Post('adjustments')
  adjust(@Body() body: Record<string, unknown>) {
    return { id: 'adjustment-demo', status: 'PROPOSED', ...body };
  }
}
