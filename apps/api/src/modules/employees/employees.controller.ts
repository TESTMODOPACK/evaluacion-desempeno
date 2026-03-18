import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmployeesService } from './employees.service';

@UseGuards(JwtAuthGuard)
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
