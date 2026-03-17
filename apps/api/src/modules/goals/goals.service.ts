import { Injectable as NestInjectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@NestInjectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async getEmployeeGoals(employeeId: string) {
    const goals = await this.prisma.objective.findMany({
      where: { ownerId: employeeId },
      include: {
        keyResults: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return goals;
  }
}
