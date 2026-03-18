// ============================================================
// main.ts — Bootstrap de la aplicación NestJS
// ============================================================
import './instrumentation'; // DEBE ser el primer import
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug'],
    });

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3001);
    const corsOrigins = configService.get<string>('CORS_ORIGINS', 'http://localhost:3002');

    // ----- Seguridad -----
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
    }));

    const frontendUrl = configService.get<string>('FRONTEND_URL', '');
    const allowedOrigins = [...corsOrigins.split(','), frontendUrl].filter(Boolean).map(o => o.trim());

    app.enableCors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.netlify.app')) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Org-ID'],
        credentials: true,
    });

    // ----- Prefijo y versioning -----
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    // ----- Pipes -----
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    // ----- Filtros e interceptores globales -----
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new AuditInterceptor());

    // ----- Swagger (solo en no-producción) -----
    if (configService.get('NODE_ENV') !== 'production') {
        const swaggerConfig = new DocumentBuilder()
            .setTitle('Evaluación de Desempeño API')
            .setDescription('API para la plataforma de evaluación de desempeño de Modopack')
            .setVersion('1.0')
            .addBearerAuth()
            .addTag('auth', 'Autenticación y sesión')
            .addTag('employees', 'Gestión de empleados')
            .addTag('review-cycles', 'Ciclos de evaluación')
            .addTag('review-instances', 'Instancias de evaluación')
            .addTag('nominations', 'Nominaciones y asignaciones 360°')
            .addTag('feedback', 'Feedback continuo')
            .addTag('goals', 'OKR y objetivos')
            .addTag('calibration', 'Sesiones de calibración')
            .addTag('reporting', 'Dashboards y reportes')
            .addTag('notifications', 'Notificaciones')
            .build();

        const document = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: { persistAuthorization: true },
        });
    }

    await app.listen(port, '0.0.0.0');
    console.log(`🚀 API corriendo en: http://localhost:${port}/api/v1`);
    console.log(`📚 Swagger disponible en: http://localhost:${port}/api/docs`);
    console.log(`📊 Métricas Prometheus en: http://localhost:9464/metrics`);
}

bootstrap();
