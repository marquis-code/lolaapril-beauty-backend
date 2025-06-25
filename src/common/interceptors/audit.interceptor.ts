import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"
import { AuditService } from "../../audit/audit.service"
import { AUDIT_KEY } from "../decorators/audit.decorator"

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditMetadata = this.reflector.get(AUDIT_KEY, context.getHandler())

    if (!auditMetadata) {
      return next.handle()
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    return next.handle().pipe(
      tap((data) => {
        if (user) {
          this.auditService.createAuditLog({
            userId: user.id,
            action: auditMetadata.action,
            resource: auditMetadata.resource,
            resourceId: data?.id || data?._id,
            metadata: {
              ip: request.ip,
              userAgent: request.get("User-Agent"),
              method: request.method,
              url: request.url,
            },
          })
        }
      }),
    )
  }
}
