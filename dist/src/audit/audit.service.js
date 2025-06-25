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
const mongoose_1 = require("mongoose");
const audit_log_schema_1 = require("./schemas/audit-log.schema");
const mongoose_2 = require("@nestjs/mongoose");
let AuditService = class AuditService {
    constructor(auditLogModel) {
        this.auditLogModel = auditLogModel;
    }
    async createAuditLog(createAuditLogDto) {
        const auditLog = new this.auditLogModel(createAuditLogDto);
        return auditLog.save();
    }
    async findAll(limit = 100, skip = 0) {
        return this.auditLogModel.find().sort({ createdAt: -1 }).limit(limit).skip(skip).exec();
    }
    async findByUser(userId, limit = 50) {
        return this.auditLogModel.find({ userId }).sort({ createdAt: -1 }).limit(limit).exec();
    }
    async findByResource(resource, resourceId) {
        const filter = { resource };
        if (resourceId) {
            filter.resourceId = resourceId;
        }
        return this.auditLogModel.find(filter).sort({ createdAt: -1 }).exec();
    }
};
AuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(audit_log_schema_1.AuditLog.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], AuditService);
exports.AuditService = AuditService;
//# sourceMappingURL=audit.service.js.map