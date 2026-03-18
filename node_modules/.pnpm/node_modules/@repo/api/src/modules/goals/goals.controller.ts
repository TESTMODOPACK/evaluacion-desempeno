import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GoalsService } from './goals.service';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'goals', version: '1' })
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get('employee/:employeeId')
  getEmployeeGoals(@Param('employeeId') employeeId: string) {
    return this.goalsService.getEmployeeGoals(employeeId);
  }
}
