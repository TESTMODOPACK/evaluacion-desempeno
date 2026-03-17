import { Controller, Get, Param } from '@nestjs/common';
import { GoalsService } from './goals.service';

@Controller({ path: 'goals', version: '1' })
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get('employee/:employeeId')
  getEmployeeGoals(@Param('employeeId') employeeId: string) {
    return this.goalsService.getEmployeeGoals(employeeId);
  }
}
