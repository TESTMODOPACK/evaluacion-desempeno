import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'reporting', version: '1' })
export class ReportingController {
  @Get('dashboards')
  dashboards() {
    return {
      kpis: [],
      alerts: [],
    };
  }
}
