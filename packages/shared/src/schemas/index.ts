import { z } from 'zod';
import { CycleType, FeedbackType, FeedbackVisibility, KeyResultType, QuestionType, UserRole } from '../types/index.js';

// ============================================================
// Zod schemas — validación compartida frontend/backend
// ============================================================

// ----- Paginación -----

export const PaginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type PaginationDto = z.infer<typeof PaginationSchema>;

// ----- Auth -----

export const LoginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type LoginDto = z.infer<typeof LoginSchema>;

export const RefreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Token requerido'),
});

export type RefreshTokenDto = z.infer<typeof RefreshTokenSchema>;

// ----- Organización -----

export const CreateOrganizationSchema = z.object({
    name: z.string().min(2).max(200),
    slug: z
        .string()
        .min(2)
        .max(50)
        .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
    locale: z.string().default('es-ES'),
    timezone: z.string().default('Europe/Madrid'),
    logoUrl: z.string().url().optional(),
});

export type CreateOrganizationDto = z.infer<typeof CreateOrganizationSchema>;

// ----- Empleados -----

export const CreateEmployeeSchema = z.object({
    employeeCode: z.string().min(1).max(50),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().email(),
    position: z.string().min(1).max(200),
    departmentId: z.string().uuid().optional(),
    teamId: z.string().uuid().optional(),
    managerId: z.string().uuid().optional(),
    hireDate: z.string().datetime(),
    salary: z.number().positive().optional(),
    role: z.nativeEnum(UserRole).default(UserRole.EMPLOYEE),
});

export type CreateEmployeeDto = z.infer<typeof CreateEmployeeSchema>;

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();
export type UpdateEmployeeDto = z.infer<typeof UpdateEmployeeSchema>;

export const ImportEmployeesSchema = z.object({
    file: z.instanceof(File).optional(),
    data: z
        .array(
            z.object({
                employeeCode: z.string(),
                firstName: z.string(),
                lastName: z.string(),
                email: z.string().email(),
                position: z.string(),
                departmentName: z.string().optional(),
                managerEmail: z.string().email().optional(),
                hireDate: z.string(),
            }),
        )
        .optional(),
});

// ----- Ciclos de Revisión -----

export const CreateReviewCycleSchema = z.object({
    name: z.string().min(2).max(200),
    type: z.nativeEnum(CycleType),
    templateId: z.string().uuid(),
    selfReviewStart: z.string().datetime(),
    selfReviewEnd: z.string().datetime(),
    peerReviewStart: z.string().datetime().optional(),
    peerReviewEnd: z.string().datetime().optional(),
    managerReviewStart: z.string().datetime(),
    managerReviewEnd: z.string().datetime(),
    calibrationStart: z.string().datetime().optional(),
    calibrationEnd: z.string().datetime().optional(),
    resultsReleaseDate: z.string().datetime().optional(),
    populationFilter: z
        .object({
            departmentIds: z.array(z.string().uuid()).optional(),
            teamIds: z.array(z.string().uuid()).optional(),
            employeeIds: z.array(z.string().uuid()).optional(),
            includeAll: z.boolean().default(true),
        })
        .default({ includeAll: true }),
    settings: z
        .object({
            allowSelfNomination: z.boolean().default(true),
            minPeerRaters: z.number().int().min(1).default(3),
            maxPeerRaters: z.number().int().min(1).default(10),
            anonymityThreshold: z.number().int().min(3).default(3),
            requireManagerSignoff: z.boolean().default(true),
            showResultsToEmployee: z.boolean().default(true),
        })
        .default({}),
});

export type CreateReviewCycleDto = z.infer<typeof CreateReviewCycleSchema>;

// ----- Plantillas de Revisión -----

export const CreateReviewTemplateSchema = z.object({
    name: z.string().min(2).max(200),
    description: z.string().optional(),
    sections: z.array(
        z.object({
            title: z.string().min(1),
            description: z.string().optional(),
            order: z.number().int().min(0),
            questions: z.array(
                z.object({
                    text: z.string().min(1),
                    type: z.nativeEnum(QuestionType),
                    required: z.boolean().default(true),
                    order: z.number().int().min(0),
                    ratingScaleId: z.string().uuid().optional(),
                    options: z.array(z.string()).optional(),
                    helpText: z.string().optional(),
                }),
            ),
        }),
    ),
});

export type CreateReviewTemplateDto = z.infer<typeof CreateReviewTemplateSchema>;

// ----- Respuestas de Revisión -----

export const SubmitReviewResponseSchema = z.object({
    responses: z.array(
        z.object({
            questionId: z.string().uuid(),
            ratingValue: z.number().optional(),
            textValue: z.string().optional(),
            choiceValue: z.string().optional(),
            booleanValue: z.boolean().optional(),
        }),
    ),
    isSubmit: z.boolean().default(false),
});

export type SubmitReviewResponseDto = z.infer<typeof SubmitReviewResponseSchema>;

// ----- 360° Nominaciones -----

export const CreateNominationSchema = z.object({
    reviewCycleId: z.string().uuid(),
    nomineeId: z.string().uuid(),
    nominatedRaterId: z.string().uuid(),
    relationship: z.enum(['PEER', 'DIRECT_REPORT', 'CROSS_FUNCTIONAL', 'EXTERNAL']),
    justification: z.string().optional(),
});

export type CreateNominationDto = z.infer<typeof CreateNominationSchema>;

// ----- Feedback -----

export const CreateFeedbackSchema = z.object({
    toEmployeeId: z.string().uuid(),
    type: z.nativeEnum(FeedbackType),
    visibility: z.nativeEnum(FeedbackVisibility).default(FeedbackVisibility.PUBLIC),
    content: z
        .string()
        .min(10, 'El feedback debe tener al menos 10 caracteres')
        .max(5000),
    tags: z.array(z.string()).default([]),
    reviewCycleId: z.string().uuid().optional(),
});

export type CreateFeedbackDto = z.infer<typeof CreateFeedbackSchema>;

// ----- OKR / Objetivos -----

export const CreateObjectiveSchema = z.object({
    title: z.string().min(2).max(300),
    description: z.string().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    parentId: z.string().uuid().optional(),
    ownerId: z.string().uuid(),
    keyResults: z
        .array(
            z.object({
                title: z.string().min(2).max(300),
                type: z.nativeEnum(KeyResultType),
                targetValue: z.number(),
                startValue: z.number().default(0),
                unit: z.string().optional(),
            }),
        )
        .default([]),
});

export type CreateObjectiveDto = z.infer<typeof CreateObjectiveSchema>;

export const CreateCheckInSchema = z.object({
    keyResultId: z.string().uuid(),
    currentValue: z.number(),
    confidence: z.number().int().min(1).max(10),
    notes: z.string().optional(),
});

export type CreateCheckInDto = z.infer<typeof CreateCheckInSchema>;

// ----- Calibración -----

export const CreateCalibrationSessionSchema = z.object({
    name: z.string().min(2).max(200),
    reviewCycleId: z.string().uuid(),
    facilitatorId: z.string().uuid(),
    scheduledAt: z.string().datetime(),
    participantIds: z.array(z.string().uuid()).min(1),
    scope: z.object({
        departmentIds: z.array(z.string().uuid()).optional(),
        teamIds: z.array(z.string().uuid()).optional(),
        employeeIds: z.array(z.string().uuid()).optional(),
    }),
});

export type CreateCalibrationSessionDto = z.infer<typeof CreateCalibrationSessionSchema>;

export const CalibrationAdjustmentSchema = z.object({
    employeeId: z.string().uuid(),
    proposedRating: z.number().min(1).max(5),
    proposedPosition: z.string().optional(),
    justification: z.string().min(10, 'Se requiere justificación para ajustes de calibración'),
});

export type CalibrationAdjustmentDto = z.infer<typeof CalibrationAdjustmentSchema>;

// ----- Notificaciones -----

export const NotificationFilterSchema = z.object({
    isRead: z.boolean().optional(),
    type: z.string().optional(),
});
