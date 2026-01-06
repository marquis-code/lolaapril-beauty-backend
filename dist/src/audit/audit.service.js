"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_emitter_1 = require("@nestjs/event-emitter");
const audit_log_schema_1 = require("./schemas/audit-log.schema");
let AuditService = class AuditService {
    constructor(auditLogModel, eventEmitter) {
        this.auditLogModel = auditLogModel;
        this.eventEmitter = eventEmitter;
    }
    async createLog(createAuditLogDto) {
        const auditLog = new this.auditLogModel(createAuditLogDto);
        const savedLog = await auditLog.save();
        const businessId = createAuditLogDto.metadata?.businessId;
        if (businessId && this.shouldNotifyBusiness(createAuditLogDto)) {
            this.eventEmitter.emit('audit.created', {
                businessId,
                auditLog: savedLog,
            });
        }
        return savedLog;
    }
    shouldNotifyBusiness(auditLog) {
        const criticalActions = [
            audit_log_schema_1.AuditAction.CREATE,
            audit_log_schema_1.AuditAction.DELETE,
            audit_log_schema_1.AuditAction.UPDATE,
        ];
        const criticalEntities = [
            audit_log_schema_1.AuditEntity.BOOKING,
            audit_log_schema_1.AuditEntity.PAYMENT,
            audit_log_schema_1.AuditEntity.APPOINTMENT,
            audit_log_schema_1.AuditEntity.CLIENT,
            audit_log_schema_1.AuditEntity.SETTINGS,
            audit_log_schema_1.AuditEntity.SALE,
            audit_log_schema_1.AuditEntity.COMMISSION,
        ];
        return (criticalActions.includes(auditLog.action) &&
            criticalEntities.includes(auditLog.entity));
    }
    async getAuditLogs(filters) {
        const { userId, entity, entityId, action, startDate, endDate, page = 1, limit = 50 } = filters;
        const query = {};
        if (userId)
            query.userId = userId;
        if (entity)
            query.entity = entity;
        if (entityId)
            query.entityId = entityId;
        if (action)
            query.action = action;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate)
                query.createdAt.$gte = startDate;
            if (endDate)
                query.createdAt.$lte = endDate;
        }
        const skip = (page - 1) * limit;
        const logs = await this.auditLogModel
            .find(query)
            .populate("userId", "firstName lastName email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await this.auditLogModel.countDocuments(query);
        return {
            logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getEntityHistory(entity, entityId) {
        return this.auditLogModel
            .find({ entity, entityId })
            .populate("userId", "firstName lastName email")
            .sort({ createdAt: -1 })
            .exec();
    }
    async getUserActivity(userId, limit = 20) {
        return this.auditLogModel.find({ userId }).sort({ createdAt: -1 }).limit(limit).exec();
    }
};
AuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(audit_log_schema_1.AuditLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        event_emitter_1.EventEmitter2])
], AuditService);
exports.AuditService = AuditService;
//# sourceMappingURL=audit.service.js.map