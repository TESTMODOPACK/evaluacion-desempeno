// ============================================================
// Tipos y enums compartidos entre frontend y backend
// ============================================================

// ----- Roles y permisos -----

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',   // acceso total al sistema
    HR_ADMIN = 'HR_ADMIN',         // admin de RRHH en su organización
    HR_BUSINESS_PARTNER = 'HR_BUSINESS_PARTNER',
    MANAGER = 'MANAGER',
    EMPLOYEE = 'EMPLOYEE',
    VIEWER = 'VIEWER',
}

export enum PermissionScope {
    ORG = 'ORG',           // toda la organización
    DEPARTMENT = 'DEPARTMENT',
    TEAM = 'TEAM',
    SELF = 'SELF',
}

// ----- Review Cycles -----

export enum CycleStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    CALIBRATION = 'CALIBRATION',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum CycleType {
    ANNUAL = 'ANNUAL',
    SEMI_ANNUAL = 'SEMI_ANNUAL',
    QUARTERLY = 'QUARTERLY',
    PROJECT = 'PROJECT',
    PROBATION = 'PROBATION',
    AD_HOC = 'AD_HOC',
}

export enum ReviewInstanceStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    SUBMITTED = 'SUBMITTED',
    CALIBRATED = 'CALIBRATED',
    SIGNED_OFF = 'SIGNED_OFF',
    ACKNOWLEDGED = 'ACKNOWLEDGED',
}

export enum QuestionType {
    RATING = 'RATING',
    TEXT = 'TEXT',
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    BOOLEAN = 'BOOLEAN',
    NPS = 'NPS',
}

// ----- 360° -----

export enum NominationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export enum RaterRelationship {
    MANAGER = 'MANAGER',
    PEER = 'PEER',
    DIRECT_REPORT = 'DIRECT_REPORT',
    CROSS_FUNCTIONAL = 'CROSS_FUNCTIONAL',
    SELF = 'SELF',
    EXTERNAL = 'EXTERNAL',
}

// ----- Feedback -----

export enum FeedbackType {
    REQUESTED = 'REQUESTED',     // feedback solicitado
    SPONTANEOUS = 'SPONTANEOUS', // feedback espontáneo
}

export enum FeedbackVisibility {
    PUBLIC = 'PUBLIC',           // visible para el empleado y managers
    MANAGER_ONLY = 'MANAGER_ONLY',
    PRIVATE = 'PRIVATE',         // solo quien lo dio y HR
    ANONYMOUS = 'ANONYMOUS',
}

// ----- OKR / Goals -----

export enum ObjectiveStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    AT_RISK = 'AT_RISK',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum KeyResultType {
    PERCENTAGE = 'PERCENTAGE',
    NUMBER = 'NUMBER',
    CURRENCY = 'CURRENCY',
    BOOLEAN = 'BOOLEAN',
    MILESTONE = 'MILESTONE',
}

// ----- Calibración -----

export enum CalibrationStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    FINALIZED = 'FINALIZED',
}

export enum NineBoxPosition {
    // Performance (Y) x Potential (X)
    STAR = 'STAR',                     // Alto desempeño, Alto potencial
    HIGH_PERFORMER = 'HIGH_PERFORMER', // Alto desempeño, Medio potencial
    BACKBONE = 'BACKBONE',             // Alto desempeño, Bajo potencial
    EMERGING = 'EMERGING',             // Medio desempeño, Alto potencial
    CORE = 'CORE',                     // Medio desempeño, Medio potencial
    EFFECTIVE = 'EFFECTIVE',           // Medio desempeño, Bajo potencial
    QUESTION_MARK = 'QUESTION_MARK',   // Bajo desempeño, Alto potencial
    DEVELOPING = 'DEVELOPING',         // Bajo desempeño, Medio potencial
    UNDERPERFORMER = 'UNDERPERFORMER', // Bajo desempeño, Bajo potencial
}

// ----- Notificaciones -----

export enum NotificationType {
    REVIEW_CYCLE_LAUNCHED = 'REVIEW_CYCLE_LAUNCHED',
    REVIEW_DUE_REMINDER = 'REVIEW_DUE_REMINDER',
    REVIEW_SUBMITTED = 'REVIEW_SUBMITTED',
    REVIEW_SIGNOFF_REQUIRED = 'REVIEW_SIGNOFF_REQUIRED',
    FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED',
    FEEDBACK_REQUESTED = 'FEEDBACK_REQUESTED',
    NOMINATION_RECEIVED = 'NOMINATION_RECEIVED',
    CALIBRATION_STARTED = 'CALIBRATION_STARTED',
    OKR_CHECKIN_REMINDER = 'OKR_CHECKIN_REMINDER',
    EXPORT_READY = 'EXPORT_READY',
}

export enum NotificationChannel {
    IN_APP = 'IN_APP',
    EMAIL = 'EMAIL',
    SLACK = 'SLACK',     // Phase 2
    TEAMS = 'TEAMS',     // Phase 2
}

// ----- Auditoría -----

export enum AuditAction {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    EXPORT = 'EXPORT',
    SIGNOFF = 'SIGNOFF',
    CALIBRATE = 'CALIBRATE',
    RATING_CHANGED = 'RATING_CHANGED',
    IMPORT = 'IMPORT',
    LAUNCH = 'LAUNCH',
}

// ----- Tipos de respuesta API -----

export interface ApiResponse<T> {
    data: T;
    meta?: PaginationMeta;
    message?: string;
}

export interface PaginationMeta {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ApiError {
    statusCode: number;
    message: string;
    error?: string;
    details?: Record<string, unknown>;
    traceId?: string;
}

// ----- Tipos base de entidades -----

export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrganizationBase extends BaseEntity {
    name: string;
    slug: string;
    logoUrl?: string;
    locale: string;
    timezone: string;
}

export interface UserBase extends BaseEntity {
    email: string;
    name: string;
    role: UserRole;
    organizationId: string;
    isActive: boolean;
}

export interface EmployeeBase extends BaseEntity {
    organizationId: string;
    userId?: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    position: string;
    departmentId?: string;
    teamId?: string;
    managerId?: string;
    hireDate: string;
    isActive: boolean;
}

export interface ReviewCycleBase extends BaseEntity {
    organizationId: string;
    name: string;
    type: CycleType;
    status: CycleStatus;
    templateId: string;
    selfReviewStart: string;
    selfReviewEnd: string;
    peerReviewStart?: string;
    peerReviewEnd?: string;
    managerReviewStart: string;
    managerReviewEnd: string;
    calibrationStart?: string;
    calibrationEnd?: string;
    resultsReleaseDate?: string;
}

export interface FeedbackItemBase extends BaseEntity {
    organizationId: string;
    type: FeedbackType;
    visibility: FeedbackVisibility;
    fromEmployeeId: string;
    toEmployeeId: string;
    content: string;
    tags: string[];
}

export interface ObjectiveBase extends BaseEntity {
    organizationId: string;
    title: string;
    description?: string;
    ownerId: string;
    status: ObjectiveStatus;
    startDate: string;
    endDate: string;
    progress: number;
    parentId?: string;
}
