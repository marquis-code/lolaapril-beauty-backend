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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
let AuditService = class AuditService {
    constructor(auditLogModel) {
        this.auditLogModel = auditLogModel;
    }
    async createLog(createAuditLogDto) {
        const auditLog = new this.auditLogModel(createAuditLogDto);
        return auditLog.save();
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
        const [logs, total] = await Promise.all([
            this.auditLogModel
                .find(query)
                .populate("userId", "firstName lastName email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.auditLogModel.countDocuments(query),
        ]);
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
    __metadata("design:paramtypes", [Function])
], AuditService);
exports.AuditService = AuditService;
//# sourceMappingURL=audit.service.js.map