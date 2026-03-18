import { Injectable, NotFoundException } from '@common/decorators'; // Wait, let me just use standard imports
import { Injectable as NestInjectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@NestInjectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics(identifier: string) {
    let employeeId = identifier;

    if (identifier.includes('@')) {
      const emp = await this.prisma.employee.findFirst({ where: { email: identifier } });
      if (!emp) throw new Error('Employee not found');
      employeeId = emp.id;
    }

    // 1. Evaluaciones Pendientes
    const pendingEvaluations = await this.prisma.reviewInstance.count({
      where: {
        OR: [
          { reviewerId: employeeId },
          { revieweeId: employeeId, type: 'SELF' },
          { managerId: employeeId, type: 'MANAGER' }
        ],
        status: { in: ['PENDING', 'IN_PROGRESS'] }
      }
    });

    // 2. Feedback Recibido (Mes actual)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const feedbackCount = await this.prisma.feedbackItem.count({
      where: {
        toEmployeeId: employeeId,
        createdAt: {
          gte: startOfMonth,
        }
      }
    });

    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    
    const lastMonthFeedbackCount = await this.prisma.feedbackItem.count({
      where: {
        toEmployeeId: employeeId,
        createdAt: {
          gte: startOfLastMonth,
          lt: startOfMonth
        }
      }
    });

    const feedbackGrowth = feedbackCount - lastMonthFeedbackCount;

    // 3. Progreso de OKRs Activos
    const activeObjectives = await this.prisma.objective.findMany({
      where: {
        ownerId: employeeId,
        status: 'ACTIVE'
      },
      select: { progress: true }
    });

    const avgOkrProgress = activeObjectives.length > 0
      ? activeObjectives.reduce((sum, obj) => sum + obj.progress, 0) / activeObjectives.length
      : 0;

    // 4. Actividad reciente combinada (Evaluaciones + Feedback)
    const recentFeedback = await this.prisma.feedbackItem.findMany({
      where: { toEmployeeId: employeeId },
      include: { from: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    const recentEvaluations = await this.prisma.reviewInstance.findMany({
      where: {
        OR: [
          { reviewerId: employeeId },
          { revieweeId: employeeId, type: 'SELF' }
        ]
      },
      include: { reviewCycle: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    // Mapear y ordenar la actividad reciente
    const activities = [
      ...recentFeedback.map(f => ({
        id: `fb-${f.id}`,
        title: 'Feedback recibido',
        desc: `${f.from.firstName} ${f.from.lastName} te ha dejado un comentario.`,
        date: f.createdAt,
        type: 'feedback'
      })),
      ...recentEvaluations.map(e => ({
        id: `ev-${e.id}`,
        title: `Evaluación asignada: ${e.reviewCycle.name}`,
        desc: `Tienes una evaluación pendiente de realizar.`,
        date: e.createdAt,
        type: 'eval'
      }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4);

    return {
      metrics: {
        pendingEvaluations,
        feedbackCount,
        feedbackGrowth,
        avgOkrProgress: Math.round(avgOkrProgress)
      },
      recentActivity: activities
    };
  }

  async getEmployeeProfile(identifier: string) {
    let employeeId = identifier;

    if (identifier.includes('@')) {
      const emp = await this.prisma.employee.findFirst({ where: { email: identifier } });
      if (!emp) throw new Error('Employee not found');
      employeeId = emp.id;
    }

    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        department: true,
        manager: { select: { id: true, firstName: true, lastName: true } }
      }
    });
    
    if (!employee) {
      throw new Error('Employee not found');
    }

    return employee;
  }
}
