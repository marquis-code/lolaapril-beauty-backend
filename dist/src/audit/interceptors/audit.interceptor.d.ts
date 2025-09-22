import { type NestInterceptor, type ExecutionContext, type CallHandler } from "@nestjs/common";
import type { Reflector } from "@nestjs/core";
import type { Observable } from "rxjs";
import type { AuditService } from "../audit.service";
export declare class AuditInterceptor implements NestInterceptor {
    private readonly auditService;
    private readonly reflector;
    constructor(auditService: AuditService, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
