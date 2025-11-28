"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const tenant_controller_1 = require("./tenant.controller");
const tenant_service_1 = require("./tenant.service");
const tenant_middleware_1 = require("./middleware/tenant.middleware");
const rate_limit_middleware_1 = require("./middleware/rate-limit.middleware");
const business_schema_1 = require("./schemas/business.schema");
const subscription_schema_1 = require("./schemas/subscription.schema");
const tenant_config_schema_1 = require("./schemas/tenant-config.schema");
const booking_schema_1 = require("../booking/schemas/booking.schema");
const user_schema_1 = require("../auth/schemas/user.schema");
let TenantModule = class TenantModule {
    configure(consumer) {
        consumer
            .apply(tenant_middleware_1.TenantMiddleware)
            .exclude({ path: 'api/tenant/check-subdomain', method: common_1.RequestMethod.GET }, { path: 'api/auth/(.*)', method: common_1.RequestMethod.ALL }, { path: 'health', method: common_1.RequestMethod.GET })
            .forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
        consumer
            .apply(rate_limit_middleware_1.TenantRateLimitMiddleware)
            .exclude({ path: 'api/tenant/check-subdomain', method: common_1.RequestMethod.GET }, { path: 'api/auth/(.*)', method: common_1.RequestMethod.ALL }, { path: 'health', method: common_1.RequestMethod.GET })
            .forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
    }
};
TenantModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: business_schema_1.Business.name, schema: business_schema_1.BusinessSchema },
                { name: subscription_schema_1.Subscription.name, schema: subscription_schema_1.SubscriptionSchema },
                { name: tenant_config_schema_1.TenantConfig.name, schema: tenant_config_schema_1.TenantConfigSchema },
                { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
        ],
        controllers: [tenant_controller_1.TenantController],
        providers: [
            tenant_service_1.TenantService,
        ],
        exports: [
            tenant_service_1.TenantService,
            mongoose_1.MongooseModule,
        ],
    })
], TenantModule);
exports.TenantModule = TenantModule;
//# sourceMappingURL=tenant.module.js.map