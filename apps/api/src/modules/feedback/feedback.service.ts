import { Injectable as NestInjectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@NestInjectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async getInbox(employeeId: string) {
    const feedback = await this.prisma.feedbackItem.findMany({
      where: { toEmployeeId: employeeId },
      include: {
        from: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return feedback;
  }
}
