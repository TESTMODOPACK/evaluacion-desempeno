import { Injectable as NestInjectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@NestInjectable()
export class ReviewCyclesService {
  constructor(private prisma: PrismaService) {}

  async getCycles(organizationId: string) {
    const cycles = await this.prisma.reviewCycle.findMany({
      where: { organizationId },
      include: {
        template: { select: { name: true } },
        _count: { select: { instances: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return cycles;
  }

  async createCycle(organizationId: string, data: any) {
    // 1. Buscamos el template a usar (o tomamos uno por defecto de la BD)
    const template = await this.prisma.reviewTemplate.findFirst({
      where: { organizationId }
    });

    if (!template) {
      throw new Error('No template found for organization. Run seed first.');
    }

    // 2. Creamos el ciclo
    const cycle = await this.prisma.reviewCycle.create({
      data: {
        organizationId,
        templateId: template.id,
        name: data.name || 'Nuevo Ciclo de Evaluación',
        type: data.type || 'SEMI_ANNUAL',
        status: 'DRAFT',
        selfReviewStart: data.selfReviewStart ? new Date(data.selfReviewStart) : new Date(),
        selfReviewEnd: data.selfReviewEnd ? new Date(data.selfReviewEnd) : new Date(),
        managerReviewStart: data.managerReviewStart ? new Date(data.managerReviewStart) : new Date(),
        managerReviewEnd: data.managerReviewEnd ? new Date(data.managerReviewEnd) : new Date(),
      }
    });

    return cycle;
  }
}
