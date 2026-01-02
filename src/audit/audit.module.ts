import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AuditService } from "./audit.service"
import { AuditLog, AuditLogSchema } from "./schemas/audit-log.schema"
import { AuditInterceptor } from './interceptors/audit.interceptor';

@Module({
  imports: [MongooseModule.forFeature([{ name: AuditLog.name, schema: AuditLogSchema }])],
  providers: [AuditService, AuditInterceptor],
  exports: [AuditService, AuditInterceptor],
})
export class AuditModule {}
