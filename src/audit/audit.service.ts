import { Injectable } from "@nestjs/common"
import { Model } from "mongoose"
import { AuditLog, AuditLogDocument } from "./schemas/audit-log.schema"
import { InjectModel } from "@nestjs/mongoose"
import { CreateAuditLogDto } from "./dto/create-audit-log.dto"

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>
  ) {}

  async createAuditLog(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = new this.auditLogModel(createAuditLogDto)
    return auditLog.save()
  }

  async findAll(limit = 100, skip = 0): Promise<AuditLog[]> {
    return this.auditLogModel.find().sort({ createdAt: -1 }).limit(limit).skip(skip).exec()
  }

  async findByUser(userId: string, limit = 50): Promise<AuditLog[]> {
    return this.auditLogModel.find({ userId }).sort({ createdAt: -1 }).limit(limit).exec()
  }

  async findByResource(resource: string, resourceId?: string): Promise<AuditLog[]> {
    const filter: any = { resource }
    if (resourceId) {
      filter.resourceId = resourceId
    }

    return this.auditLogModel.find(filter).sort({ createdAt: -1 }).exec()
  }
}
