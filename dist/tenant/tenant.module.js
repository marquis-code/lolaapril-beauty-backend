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
const business_schema_1 = require("./schemas/business.schema");
const subscription_schema_1 = require("./schemas/subscription.schema");
const tenant_config_schema_1 = require("./schemas/tenant-config.schema");
const user_schema_1 = require("../auth/schemas/user.schema");
let TenantModule = class TenantModule {
};
TenantModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: business_schema_1.Business.name, schema: business_schema_1.BusinessSchema },
                { name: subscription_schema_1.Subscription.name, schema: subscription_schema_1.SubscriptionSchema },
                { name: tenant_config_schema_1.TenantConfig.name, schema: tenant_config_schema_1.TenantConfigSchema },
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