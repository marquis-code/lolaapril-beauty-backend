import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { AuditLog, AuditLogDocument, AuditAction, AuditEntity } from "./schemas/audit-log.schema"

export interface CreateAuditLogDto {
  userId: string
  action: AuditAction
  entity: AuditEntity
  entityId: string
  description: string
  previousData?: any
  newData?: any
  ipAddress?: string
  userAgent?: string
  metadata?: any
}

@Injectable()
export class AuditService {

  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createLog(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = new this.auditLogModel(createAuditLogDto)
    const savedLog = await auditLog.save()

    // Emit event for real-time notification
    // Extract businessId from metadata if available
    const businessId = createAuditLogDto.metadata?.businessId
    
    if (businessId && this.shouldNotifyBusiness(createAuditLogDto)) {
      this.eventEmitter.emit('audit.created', {
        businessId,
        auditLog: savedLog,
      })
    }

    return savedLog
  }

  /**
   * Determine if audit log should trigger a business notification
   */
  private shouldNotifyBusiness(auditLog: CreateAuditLogDto): boolean {
    // Define critical actions and entities that should trigger notifications
    const criticalActions = [
      AuditAction.CREATE,
      AuditAction.DELETE,
      AuditAction.UPDATE,
    ]

    const criticalEntities = [
      AuditEntity.BOOKING,
      AuditEntity.PAYMENT,
      AuditEntity.APPOINTMENT,
      AuditEntity.CLIENT,
      AuditEntity.SETTINGS,
      AuditEntity.SALE,
      AuditEntity.COMMISSION,
    ]

    return (
      criticalActions.includes(auditLog.action) &&
      criticalEntities.includes(auditLog.entity)
    )
  }

  async getAuditLogs(filters: {
    userId?: string
    entity?: AuditEntity
    entityId?: string
    action?: AuditAction
    startDate?: Date
    endDate?: Date
    page?: number
    limit?: number
  }) {
    const { userId, entity, entityId, action, startDate, endDate, page = 1, limit = 50 } = filters

    const query: any = {}

    if (userId) query.userId = userId
    if (entity) query.entity = entity
    if (entityId) query.entityId = entityId
    if (action) query.action = action

    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = startDate
      if (endDate) query.createdAt.$lte = endDate
    }

    const skip = (page - 1) * limit

    // Execute queries sequentially to avoid complex union type inference
    const logs = await this.auditLogModel
      .find(query)
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec()

    const total = await this.auditLogModel.countDocuments(query)

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getEntityHistory(entity: AuditEntity, entityId: string) {
    return this.auditLogModel
      .find({ entity, entityId })
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .exec()
  }

  async getUserActivity(userId: string, limit = 20) {
    return this.auditLogModel.find({ userId }).sort({ createdAt: -1 }).limit(limit).exec()
  }
}