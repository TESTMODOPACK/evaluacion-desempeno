import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start;
        // Placeholder de auditoria: en fase siguiente se persistira en AuditLog.
        if (process.env.NODE_ENV !== 'production') {
          const method = req?.method ?? 'UNKNOWN';
          const url = req?.originalUrl ?? req?.url ?? '';
          console.log(`[AUDIT] ${method} ${url} ${ms}ms`);
        }
      }),
    );
  }
}
