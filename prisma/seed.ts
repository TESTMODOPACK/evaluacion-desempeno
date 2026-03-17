import { PrismaClient, UserRole, ObjectiveStatus, ObjectiveType, KeyResultType, CycleType, CycleStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
      locale: 'es-ES',
      timezone: 'America/Santiago',
    },
  });

  // 2. Create Departments
  const devDept = await prisma.department.upsert({
    where: { organizationId_name: { organizationId: org.id, name: 'Ingeniería' } },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Ingeniería',
      code: 'ENG',
    },
  });

  const salesDept = await prisma.department.upsert({
    where: { organizationId_name: { organizationId: org.id, name: 'Ventas' } },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Ventas',
      code: 'SLS',
    },
  });

  // 3. Create Users
  const hrUser = await prisma.user.upsert({
    where: { organizationId_email: { organizationId: org.id, email: 'rrhh@acme.com' } },
    update: {},
    create: {
      organizationId: org.id,
      email: 'rrhh@acme.com',
      name: 'María HR',
      role: UserRole.HR_ADMIN,
    },
  });

  const employeeUser = await prisma.user.upsert({
    where: { organizationId_email: { organizationId: org.id, email: 'ricardo@acme.com' } },
    update: {},
    create: {
      organizationId: org.id,
      email: 'ricardo@acme.com',
      name: 'Ricardo M.',
      role: UserRole.EMPLOYEE,
    },
  });

  // 4. Create Employees
  const hrEmployee = await prisma.employee.upsert({
    where: { organizationId_email: { organizationId: org.id, email: hrUser.email } },
    update: {},
    create: {
      organizationId: org.id,
      userId: hrUser.id,
      employeeCode: 'EMP-001',
      firstName: 'María',
      lastName: 'Gómez',
      fullName: 'María Gómez',
      email: hrUser.email,
      position: 'HR Director',
      hireDate: new Date('2020-01-15'),
      departmentId: devDept.id,
    },
  });

  const ricardoEmployee = await prisma.employee.upsert({
    where: { organizationId_email: { organizationId: org.id, email: employeeUser.email } },
    update: {},
    create: {
      organizationId: org.id,
      userId: employeeUser.id,
      employeeCode: 'EMP-002',
      firstName: 'Ricardo',
      lastName: 'M.',
      fullName: 'Ricardo M.',
      email: employeeUser.email,
      position: 'Senior Frontend Engineer',
      hireDate: new Date('2022-03-01'),
      departmentId: devDept.id,
      managerId: hrEmployee.id,
    },
  });

  // 5. Create Objectives for Ricardo
  const obj1 = await prisma.objective.create({
    data: {
      organizationId: org.id,
      title: 'Lanzar nuevo portal cautivo',
      ownerId: ricardoEmployee.id,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      progress: 80,
      status: ObjectiveStatus.ACTIVE,
      type: ObjectiveType.INDIVIDUAL,
      keyResults: {
        create: [
          {
            title: 'Habilitar login SSO',
            type: KeyResultType.BOOLEAN,
            targetValue: 1,
            currentValue: 1,
            status: 'COMPLETED',
          },
          {
            title: 'Cobertura de pruebas',
            type: KeyResultType.PERCENTAGE,
            targetValue: 90,
            currentValue: 70,
            status: 'ON_TRACK',
          }
        ]
      }
    }
  });

  const obj2 = await prisma.objective.create({
    data: {
      organizationId: org.id,
      title: 'Reducir latencia en endpoints',
      ownerId: ricardoEmployee.id,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      progress: 45,
      status: ObjectiveStatus.AT_RISK,
      type: ObjectiveType.INDIVIDUAL,
    }
  });

  // 6. Create Feedback for Ricardo
  await prisma.feedbackItem.create({
    data: {
      organizationId: org.id,
      type: 'SPONTANEOUS',
      fromEmployeeId: hrEmployee.id,
      toEmployeeId: ricardoEmployee.id,
      content: 'Excelente liderazgo en el último sprint crítico. Nos salvaste el release.',
      isRead: false,
    }
  });

  // 7. Create a Review Template
  const template = await prisma.reviewTemplate.create({
    data: {
      organizationId: org.id,
      name: 'Evaluación de Mitad de Año (Q2 2026)',
      description: 'Plantilla por defecto para evaluación de progreso',
    }
  });

  // 8. Create a Review Cycle
  const cycle = await prisma.reviewCycle.create({
    data: {
      organizationId: org.id,
      templateId: template.id,
      name: 'Evaluación Q2 2026',
      type: CycleType.SEMI_ANNUAL,
      status: CycleStatus.ACTIVE,
      selfReviewStart: new Date('2026-06-01'),
      selfReviewEnd: new Date('2026-06-15'),
      managerReviewStart: new Date('2026-06-16'),
      managerReviewEnd: new Date('2026-06-30'),
    }
  });

  // Create Review Instance for Ricardo
  await prisma.reviewInstance.create({
    data: {
      reviewCycleId: cycle.id,
      revieweeId: ricardoEmployee.id,
      managerId: hrEmployee.id,
      type: 'SELF',
      status: 'PENDING',
      dueDate: new Date('2026-06-15'),
    }
  });

  console.log('Seed completed successfully!');
  console.log('Seeded Users:');
  console.log(`- HR Admin: ${hrUser.email}`);
  console.log(`- Employee: ${employeeUser.email}`);
  console.log(`- Employee ID: ${ricardoEmployee.id}`);
}

prisma.$connect()
  .then(() => main())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
