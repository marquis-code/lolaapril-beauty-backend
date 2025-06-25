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
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const operators_1 = require("rxjs/operators");
const audit_service_1 = require("../../audit/audit.service");
const audit_decorator_1 = require("../decorators/audit.decorator");
let AuditInterceptor = class AuditInterceptor {
    constructor(reflector, auditService) {
        this.reflector = reflector;
        this.auditService = auditService;
    }
    intercept(context, next) {
        const auditMetadata = this.reflector.get(audit_decorator_1.AUDIT_KEY, context.getHandler());
        if (!auditMetadata) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return next.handle().pipe((0, operators_1.tap)((data) => {
            if (user) {
                this.auditService.createAuditLog({
                    userId: user.id,
                    action: auditMetadata.action,
                    resource: auditMetadata.resource,
                    resourceId: (data === null || data === void 0 ? void 0 : data.id) || (data === null || data === void 0 ? void 0 : data._id),
                    metadata: {
                        ip: request.ip,
                        userAgent: request.get("User-Agent"),
                        method: request.method,
                        url: request.url,
                    },
                });
            }
        }));
    }
};
AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        audit_service_1.AuditService])
], AuditInterceptor);
exports.AuditInterceptor = AuditInterceptor;
//# sourceMappingURL=audit.interceptor.js.map