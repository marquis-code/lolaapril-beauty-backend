import { type NestInterceptor, type ExecutionContext, type CallHandler } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AuditService } from "../../audit/audit.service";
export declare class AuditInterceptor implements NestInterceptor {
    private reflector;
    private auditService;
    constructor(reflector: Reflector, auditService: AuditService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
