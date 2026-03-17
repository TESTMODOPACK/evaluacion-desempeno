import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');

    // ============================================================
    // ORGANIZACIÓN DEMO
    // ============================================================
    const org = await prisma.organization.upsert({
        where: { slug: 'modopack-demo' },
        update: {},
        create: {
            name: 'Modopack S.A. (Demo)',
            slug: 'modopack-demo',
            locale: 'es-ES',
            timezone: 'America/Buenos_Aires',
            settings: {
                features: {
                    review360: true,
                    continuousFeedback: true,
                    okr: true,
                    calibration: true,
                },
            },
        },
    });
    console.log(`✅ Organización: ${org.name}`);

    // ============================================================
    // DEPARTAMENTOS
    // ============================================================
    const deptRRHH = await prisma.department.upsert({
        where: { organizationId_name: { organizationId: org.id, name: 'Recursos Humanos' } },
        update: {},
        create: { organizationId: org.id, name: 'Recursos Humanos', code: 'RRHH' },
    });
    const deptOps = await prisma.department.upsert({
        where: { organizationId_name: { organizationId: org.id, name: 'Operaciones' } },
        update: {},
        create: { organizationId: org.id, name: 'Operaciones', code: 'OPS' },
    });
    const deptComercial = await prisma.department.upsert({
        where: { organizationId_name: { organizationId: org.id, name: 'Comercial' } },
        update: {},
        create: { organizationId: org.id, name: 'Comercial', code: 'COM' },
    });
    const deptTech = await prisma.department.upsert({
        where: { organizationId_name: { organizationId: org.id, name: 'Tecnología' } },
        update: {},
        create: { organizationId: org.id, name: 'Tecnología', code: 'TECH' },
    });
    console.log('✅ Departamentos creados');

    // ============================================================
    // ESCALA DE CALIFICACIÓN
    // ============================================================
    const ratingScale = await prisma.ratingScale.upsert({
        where: { id: 'scale-default-5' },
        update: {},
        create: {
            id: 'scale-default-5',
            name: 'Escala 1-5',
            minValue: 1,
            maxValue: 5,
            step: 1,
            labels: {
                '1': 'Muy por debajo de expectativas',
                '2': 'Por debajo de expectativas',
                '3': 'Cumple expectativas',
                '4': 'Supera expectativas',
                '5': 'Supera significativamente expectativas',
            },
        },
    });
    console.log('✅ Escala de calificación creada');

    // ============================================================
    // PLANTILLA DE EVALUACIÓN
    // ============================================================
    const template = await prisma.reviewTemplate.upsert({
        where: { id: 'tmpl-annual-v1' },
        update: {},
        create: {
            id: 'tmpl-annual-v1',
            organizationId: org.id,
            name: 'Evaluación Anual de Desempeño 2024',
            description: 'Plantilla estándar para la evaluación anual de desempeño',
            version: 1,
            sections: {
                create: [
                    {
                        title: 'Resultados y Logros',
                        description: 'Evalúa el cumplimiento de objetivos y resultados del período',
                        order: 0,
                        weight: 0.4,
                        questions: {
                            create: [
                                {
                                    text: '¿Cómo calificarías el cumplimiento de los objetivos del período?',
                                    type: 'RATING',
                                    required: true,
                                    order: 0,
                                    weight: 1.0,
                                    ratingScaleId: ratingScale.id,
                                    helpText: 'Considera los OKRs y KPIs acordados al inicio del período',
                                    audience: ['SELF', 'MANAGER'],
                                },
                                {
                                    text: 'Describe los principales logros del período y su impacto en el negocio',
                                    type: 'TEXT',
                                    required: true,
                                    order: 1,
                                    weight: 0,
                                    audience: ['SELF', 'MANAGER'],
                                },
                            ],
                        },
                    },
                    {
                        title: 'Competencias y Comportamientos',
                        description: 'Evalúa las competencias clave de la organización',
                        order: 1,
                        weight: 0.35,
                        questions: {
                            create: [
                                {
                                    text: 'Colaboración y trabajo en equipo',
                                    type: 'RATING',
                                    required: true,
                                    order: 0,
                                    ratingScaleId: ratingScale.id,
                                    audience: ['SELF', 'MANAGER', 'PEER'],
                                },
                                {
                                    text: 'Comunicación efectiva',
                                    type: 'RATING',
                                    required: true,
                                    order: 1,
                                    ratingScaleId: ratingScale.id,
                                    audience: ['SELF', 'MANAGER', 'PEER'],
                                },
                                {
                                    text: 'Orientación al cliente y calidad',
                                    type: 'RATING',
                                    required: true,
                                    order: 2,
                                    ratingScaleId: ratingScale.id,
                                    audience: ['SELF', 'MANAGER', 'PEER'],
                                },
                                {
                                    text: 'Innovación y mejora continua',
                                    type: 'RATING',
                                    required: true,
                                    order: 3,
                                    ratingScaleId: ratingScale.id,
                                    audience: ['SELF', 'MANAGER', 'PEER'],
                                },
                            ],
                        },
                    },
                    {
                        title: 'Desarrollo y Crecimiento',
                        description: 'Evalúa el desarrollo profesional y potencial',
                        order: 2,
                        weight: 0.25,
                        questions: {
                            create: [
                                {
                                    text: '¿Qué fortalezas deberías seguir desarrollando?',
                                    type: 'TEXT',
                                    required: true,
                                    order: 0,
                                    audience: ['SELF', 'MANAGER', 'PEER'],
                                },
                                {
                                    text: '¿Qué áreas de mejora son prioritarias para el próximo período?',
                                    type: 'TEXT',
                                    required: true,
                                    order: 1,
                                    audience: ['SELF', 'MANAGER'],
                                },
                                {
                                    text: 'Potencial de crecimiento dentro de la organización',
                                    type: 'RATING',
                                    required: true,
                                    order: 2,
                                    ratingScaleId: ratingScale.id,
                                    audience: ['MANAGER'],
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });
    console.log(`✅ Plantilla de evaluación: ${template.name}`);

    // ============================================================
    // USUARIOS Y EMPLEADOS (10 empleados)
    // ============================================================
    const passwordHash = await bcrypt.hash('Demo1234!', 12);

    const usersData = [
        {
            email: 'admin.rrhh@modopack.com',
            name: 'Ana García López',
            role: 'HR_ADMIN',
            firstName: 'Ana',
            lastName: 'García López',
            position: 'Directora de RRHH',
            deptId: deptRRHH.id,
            code: 'EMP-001',
        },
        {
            email: 'manager.ops@modopack.com',
            name: 'Carlos Rodríguez Pérez',
            role: 'MANAGER',
            firstName: 'Carlos',
            lastName: 'Rodríguez Pérez',
            position: 'Gerente de Operaciones',
            deptId: deptOps.id,
            code: 'EMP-002',
        },
        {
            email: 'manager.comercial@modopack.com',
            name: 'Laura Martínez Sanz',
            role: 'MANAGER',
            firstName: 'Laura',
            lastName: 'Martínez Sanz',
            position: 'Gerente Comercial',
            deptId: deptComercial.id,
            code: 'EMP-003',
        },
        {
            email: 'pedro.sanchez@modopack.com',
            name: 'Pedro Sánchez Ruiz',
            role: 'EMPLOYEE',
            firstName: 'Pedro',
            lastName: 'Sánchez Ruiz',
            position: 'Analista de Operaciones',
            deptId: deptOps.id,
            code: 'EMP-004',
        },
        {
            email: 'maria.fernandez@modopack.com',
            name: 'María Fernández Castro',
            role: 'EMPLOYEE',
            firstName: 'María',
            lastName: 'Fernández Castro',
            position: 'Coordinadora Comercial',
            deptId: deptComercial.id,
            code: 'EMP-005',
        },
        {
            email: 'jose.lopez@modopack.com',
            name: 'José López Díaz',
            role: 'EMPLOYEE',
            firstName: 'José',
            lastName: 'López Díaz',
            position: 'Supervisor de Almacén',
            deptId: deptOps.id,
            code: 'EMP-006',
        },
        {
            email: 'sofia.torres@modopack.com',
            name: 'Sofía Torres Gómez',
            role: 'EMPLOYEE',
            firstName: 'Sofía',
            lastName: 'Torres Gómez',
            position: 'Ejecutiva de Ventas',
            deptId: deptComercial.id,
            code: 'EMP-007',
        },
        {
            email: 'miguel.jimenez@modopack.com',
            name: 'Miguel Jiménez Alonso',
            role: 'HR_BUSINESS_PARTNER',
            firstName: 'Miguel',
            lastName: 'Jiménez Alonso',
            position: 'HR Business Partner',
            deptId: deptRRHH.id,
            code: 'EMP-008',
        },
        {
            email: 'elena.paris@modopack.com',
            name: 'Elena París Moreno',
            role: 'EMPLOYEE',
            firstName: 'Elena',
            lastName: 'París Moreno',
            position: 'Desarrolladora Full Stack',
            deptId: deptTech.id,
            code: 'EMP-009',
        },
        {
            email: 'roberto.vega@modopack.com',
            name: 'Roberto Vega Blanco',
            role: 'MANAGER',
            firstName: 'Roberto',
            lastName: 'Vega Blanco',
            position: 'Tech Lead',
            deptId: deptTech.id,
            code: 'EMP-010',
        },
    ] as const;

    const createdEmployees: Record<string, { userId: string; employeeId: string }> = {};

    for (const u of usersData) {
        const user = await prisma.user.upsert({
            where: { organizationId_email: { organizationId: org.id, email: u.email } },
            update: {},
            create: {
                organizationId: org.id,
                email: u.email,
                passwordHash,
                name: u.name,
                role: u.role as never,
            },
        });

        const employee = await prisma.employee.upsert({
            where: { organizationId_email: { organizationId: org.id, email: u.email } },
            update: {},
            create: {
                organizationId: org.id,
                userId: user.id,
                employeeCode: u.code,
                firstName: u.firstName,
                lastName: u.lastName,
                fullName: u.name,
                email: u.email,
                position: u.position,
                departmentId: u.deptId,
                hireDate: new Date('2022-01-15'),
            },
        });

        createdEmployees[u.email] = { userId: user.id, employeeId: employee.id };
    }
    console.log('✅ 10 empleados creados');

    // Asignar managers
    const managerOpsId = createdEmployees['manager.ops@modopack.com']!.employeeId;
    const managerComId = createdEmployees['manager.comercial@modopack.com']!.employeeId;
    const techLeadId = createdEmployees['roberto.vega@modopack.com']!.employeeId;

    await Promise.all([
        prisma.employee.update({
            where: { id: createdEmployees['pedro.sanchez@modopack.com']!.employeeId },
            data: { managerId: managerOpsId },
        }),
        prisma.employee.update({
            where: { id: createdEmployees['jose.lopez@modopack.com']!.employeeId },
            data: { managerId: managerOpsId },
        }),
        prisma.employee.update({
            where: { id: createdEmployees['maria.fernandez@modopack.com']!.employeeId },
            data: { managerId: managerComId },
        }),
        prisma.employee.update({
            where: { id: createdEmployees['sofia.torres@modopack.com']!.employeeId },
            data: { managerId: managerComId },
        }),
        prisma.employee.update({
            where: { id: createdEmployees['elena.paris@modopack.com']!.employeeId },
            data: { managerId: techLeadId },
        }),
    ]);
    console.log('✅ Relaciones de managers asignadas');

    // ============================================================
    // CICLO DE EVALUACIÓN DEMO (Completado — 2023)
    // ============================================================
    const cycle2023 = await prisma.reviewCycle.upsert({
        where: { id: 'cycle-2023-annual' },
        update: {},
        create: {
            id: 'cycle-2023-annual',
            organizationId: org.id,
            templateId: template.id,
            name: 'Evaluación Anual 2023',
            type: 'ANNUAL',
            status: 'COMPLETED',
            selfReviewStart: new Date('2023-12-01'),
            selfReviewEnd: new Date('2023-12-15'),
            managerReviewStart: new Date('2023-12-16'),
            managerReviewEnd: new Date('2023-12-31'),
            calibrationStart: new Date('2024-01-05'),
            calibrationEnd: new Date('2024-01-15'),
            resultsReleaseDate: new Date('2024-01-20'),
            launchedAt: new Date('2023-12-01'),
            completedAt: new Date('2024-01-21'),
        },
    });

    // ============================================================
    // CICLO ACTIVO (2024)
    // ============================================================
    const cycle2024 = await prisma.reviewCycle.upsert({
        where: { id: 'cycle-2024-annual' },
        update: {},
        create: {
            id: 'cycle-2024-annual',
            organizationId: org.id,
            templateId: template.id,
            name: 'Evaluación Anual 2024',
            type: 'ANNUAL',
            status: 'ACTIVE',
            selfReviewStart: new Date('2024-12-01'),
            selfReviewEnd: new Date('2024-12-20'),
            managerReviewStart: new Date('2024-12-21'),
            managerReviewEnd: new Date('2025-01-10'),
            calibrationStart: new Date('2025-01-13'),
            calibrationEnd: new Date('2025-01-20'),
            resultsReleaseDate: new Date('2025-01-25'),
            launchedAt: new Date('2024-12-01'),
            settings: {
                allowSelfNomination: true,
                minPeerRaters: 3,
                maxPeerRaters: 7,
                anonymityThreshold: 3,
                requireManagerSignoff: true,
                showResultsToEmployee: true,
            },
        },
    });
    console.log(`✅ Ciclos de evaluación creados: ${cycle2023.name}, ${cycle2024.name}`);

    // ============================================================
    // OBJETIVOS DEMO (OKR)
    // ============================================================
    const obj1 = await prisma.objective.upsert({
        where: { id: 'obj-ops-2024-q1' },
        update: {},
        create: {
            id: 'obj-ops-2024-q1',
            organizationId: org.id,
            title: 'Mejorar la eficiencia operativa en un 20%',
            description: 'Reducir tiempos de procesamiento y errores en almacén',
            ownerId: managerOpsId,
            status: 'ACTIVE',
            type: 'DEPARTMENT',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-03-31'),
            progress: 65,
            keyResults: {
                create: [
                    {
                        title: 'Reducir tiempo de picking de 45 a 35 minutos promedio',
                        type: 'NUMBER',
                        targetValue: 35,
                        startValue: 45,
                        currentValue: 40,
                        unit: 'minutos',
                        status: 'ON_TRACK',
                    },
                    {
                        title: 'Reducir tasa de errores de envío a menos de 1%',
                        type: 'PERCENTAGE',
                        targetValue: 1,
                        startValue: 3.2,
                        currentValue: 1.8,
                        unit: '%',
                        status: 'ON_TRACK',
                    },
                    {
                        title: 'Digitalizar 100% del proceso de inventario',
                        type: 'PERCENTAGE',
                        targetValue: 100,
                        startValue: 40,
                        currentValue: 75,
                        unit: '%',
                        status: 'AT_RISK',
                    },
                ],
            },
        },
    });

    const obj2 = await prisma.objective.upsert({
        where: { id: 'obj-com-2024-q1' },
        update: {},
        create: {
            id: 'obj-com-2024-q1',
            organizationId: org.id,
            title: 'Incrementar ventas netas 15% vs año anterior',
            description: 'Expansión de cartera de clientes y ticket promedio',
            ownerId: managerComId,
            status: 'ACTIVE',
            type: 'DEPARTMENT',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            progress: 42,
            keyResults: {
                create: [
                    {
                        title: 'Cerrar 25 nuevas cuentas estratégicas',
                        type: 'NUMBER',
                        targetValue: 25,
                        startValue: 0,
                        currentValue: 11,
                        unit: 'clientes',
                        status: 'ON_TRACK',
                    },
                    {
                        title: 'Incrementar ticket promedio de $8.500 a $12.000',
                        type: 'CURRENCY',
                        targetValue: 12000,
                        startValue: 8500,
                        currentValue: 9800,
                        unit: 'USD',
                        status: 'AT_RISK',
                    },
                ],
            },
        },
    });
    console.log(`✅ Objetivos OKR creados: ${obj1.title}, ${obj2.title}`);

    // ============================================================
    // FEEDBACK DEMO
    // ============================================================
    const pabloId = createdEmployees['pedro.sanchez@modopack.com']!.employeeId;
    const sofiaId = createdEmployees['sofia.torres@modopack.com']!.employeeId;

    await prisma.feedbackItem.createMany({
        skipDuplicates: true,
        data: [
            {
                organizationId: org.id,
                type: 'SPONTANEOUS',
                visibility: 'PUBLIC',
                fromEmployeeId: managerOpsId,
                toEmployeeId: pabloId,
                content:
                    'Pedro hizo un trabajo excepcional coordinando el inventario de fin de año. Su atención al detalle y proactividad fueron clave para cerrar el período sin errores. Sigue así!',
                reviewCycleId: cycle2023.id,
            },
            {
                organizationId: org.id,
                type: 'SPONTANEOUS',
                visibility: 'PUBLIC',
                fromEmployeeId: managerComId,
                toEmployeeId: sofiaId,
                content:
                    'Sofía cerró el trimestre con los mejores resultados del equipo comercial. Su habilidad para entender las necesidades del cliente y proponer soluciones personalizadas es destacable.',
                reviewCycleId: cycle2023.id,
            },
        ],
    });
    console.log('✅ Feedback demo creado');

    console.log('\n🎉 Seed completado exitosamente!');
    console.log('\n📋 Credenciales de acceso:');
    console.log('   HR Admin:  admin.rrhh@modopack.com  / Demo1234!');
    console.log('   Manager:   manager.ops@modopack.com / Demo1234!');
    console.log('   Empleado:  pedro.sanchez@modopack.com / Demo1234!');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
