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
const operators_1 = require("rxjs/operators");
const audit_decorator_1 = require("../decorators/audit.decorator");
let AuditInterceptor = class AuditInterceptor {
    constructor(auditService, reflector) {
        this.auditService = auditService;
        this.reflector = reflector;
    }
    intercept(context, next) {
        const auditOptions = this.reflector.get(audit_decorator_1.AUDIT_KEY, context.getHandler());
        if (!auditOptions) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const ipAddress = request.ip;
        const userAgent = request.get("User-Agent");
        return next.handle().pipe((0, operators_1.tap)(async (response) => {
            var _a;
            if (user) {
                const entityId = (response === null || response === void 0 ? void 0 : response.id) || (response === null || response === void 0 ? void 0 : response._id) || ((_a = request.params) === null || _a === void 0 ? void 0 : _a.id) || "unknown";
                await this.auditService.createLog({
                    userId: user.userId,
                    action: auditOptions.action,
                    entity: auditOptions.entity,
                    entityId: entityId.toString(),
                    description: auditOptions.description || `${auditOptions.action} ${auditOptions.entity}`,
                    newData: response,
                    ipAddress,
                    userAgent,
                    metadata: {
                        method: request.method,
                        url: request.url,
                        params: request.params,
                        query: request.query,
                    },
                });
            }
        }));
    }
};
AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Function])
], AuditInterceptor);
exports.AuditInterceptor = AuditInterceptor;
//# sourceMappingURL=audit.interceptor.js.map