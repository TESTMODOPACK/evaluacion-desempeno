import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { ReviewCyclesModule } from './modules/review-cycles/review-cycles.module';
import { ReviewInstancesModule } from './modules/review-instances/review-instances.module';
import { NominationsModule } from './modules/nominations/nominations.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { GoalsModule } from './modules/goals/goals.module';
import { CalibrationModule } from './modules/calibration/calibration.module';
import { ReportingModule } from './modules/reporting/reporting.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [
        // ----- Config global -----
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env'],
        }),

        // ----- Rate limiting -----
        ThrottlerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => [
                {
                    ttl: configService.get<number>('RATE_LIMIT_TTL', 60) * 1000,
                    limit: configService.get<number>('RATE_LIMIT_MAX', 100),
                },
            ],
        }),

        // ----- Queue (BullMQ via Bull) -----
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                redis: configService.get<string>('REDIS_URL', 'redis://localhost:6379'),
            }),
        }),

        // ----- Scheduler (cron jobs) -----
        ScheduleModule.forRoot(),

        // ----- Core -----
        PrismaModule,

        // ----- Dominio -----
        AuthModule,
        OrganizationModule,
        EmployeesModule,
        ReviewCyclesModule,
        ReviewInstancesModule,
        NominationsModule,
        FeedbackModule,
        GoalsModule,
        CalibrationModule,
        ReportingModule,
        NotificationsModule,
    ],
})
export class AppModule { }
