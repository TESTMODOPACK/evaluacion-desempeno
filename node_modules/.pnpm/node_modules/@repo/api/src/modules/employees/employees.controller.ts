import { Controller, Get, Param } from '@nestjs/common';
import { EmployeesService } from './employees.service';

@Controller({ path: 'employees', version: '1' })
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get(':id/dashboard')
  getDashboardMetrics(@Param('id') id: string) {
    return this.employeesService.getDashboardMetrics(id);
  }

  @Get(':id/profile')
  getProfile(@Param('id') id: string) {
    return this.employeesService.getEmployeeProfile(id);
  }
}
