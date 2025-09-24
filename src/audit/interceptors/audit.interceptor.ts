import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Observable } from "rxjs"
import { tap } from "rxjs/operators"
import { AuditService } from "../audit.service"
import { AUDIT_KEY, type AuditOptions } from "../decorators/audit.decorator"

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditOptions = this.reflector.get<AuditOptions>(AUDIT_KEY, context.getHandler())

    if (!auditOptions) {
      return next.handle()
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user
    const ipAddress = request.ip
    const userAgent = request.get("User-Agent")

    return next.handle().pipe(
      tap(async (response) => {
        if (user) {
          const entityId = response?.id || response?._id || request.params?.id || "unknown"

          await this.auditService.createLog({
            userId: user.userId,
            action: auditOptions.action,
            entity: auditOptions.entity,
            entityId: entityId.toString(),
            description: auditOptions.description || `${auditOptions.action} ${auditOptions.entity}`,
            newData: response,
            ipAddress,
            userAgent,
            metadata: {
              method: request.method,
              url: request.url,
              params: request.params,
              query: request.query,
            },
          })
        }
      }),
    )
  }
}
