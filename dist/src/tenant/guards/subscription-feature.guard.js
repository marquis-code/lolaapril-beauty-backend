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
exports.SubscriptionFeatureGuard = exports.RequireFeature = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const RequireFeature = (feature) => {
    return (target, propertyKey, descriptor) => {
        Reflect.defineMetadata('required-feature', feature, (descriptor === null || descriptor === void 0 ? void 0 : descriptor.value) || target);
    };
};
exports.RequireFeature = RequireFeature;
let SubscriptionFeatureGuard = class SubscriptionFeatureGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        var _a, _b;
        const requiredFeature = this.reflector.get('required-feature', context.getHandler());
        if (!requiredFeature) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        if (!request.tenant || !request.tenant.business.activeSubscription) {
            throw new common_1.ForbiddenException('Active subscription required');
        }
        const subscription = request.tenant.business.activeSubscription;
        const hasFeature = (_b = (_a = subscription.limits) === null || _a === void 0 ? void 0 : _a.features) === null || _b === void 0 ? void 0 : _b[requiredFeature];
        if (!hasFeature) {
            throw new common_1.ForbiddenException(`Feature '${requiredFeature}' not available in current subscription plan`);
        }
        return true;
    }
};
SubscriptionFeatureGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], SubscriptionFeatureGuard);
exports.SubscriptionFeatureGuard = SubscriptionFeatureGuard;
//# sourceMappingURL=subscription-feature.guard.js.map