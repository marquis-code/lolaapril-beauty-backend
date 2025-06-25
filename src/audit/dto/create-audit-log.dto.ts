import { IsNotEmpty, IsString, IsOptional, IsEnum } from "class-validator"
import { AuditAction } from "../../common/enums"

export class CreateAuditLogDto {
  @IsNotEmpty()
  @IsString()
  userId: string

  @IsEnum(AuditAction)
  action: AuditAction

  @IsNotEmpty()
  @IsString()
  resource: string

  @IsOptional()
  @IsString()
  resourceId?: string

  @IsOptional()
  metadata?: Record<string, any>

  @IsOptional()
  @IsString()
  ip?: string

  @IsOptional()
  @IsString()
  userAgent?: string
}
