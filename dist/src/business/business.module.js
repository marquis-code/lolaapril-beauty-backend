"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const business_controller_1 = require("./business.controller");
const business_service_1 = require("./business.service");
const business_schema_1 = require("./schemas/business.schema");
const user_schema_1 = require("../auth/schemas/user.schema");
const integration_module_1 = require("../integration/integration.module");
let BusinessModule = class BusinessModule {
};
BusinessModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: business_schema_1.Business.name, schema: business_schema_1.BusinessSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema }
            ]),
            integration_module_1.IntegrationModule,
        ],
        controllers: [business_controller_1.BusinessController],
        providers: [business_service_1.BusinessService],
        exports: [business_service_1.BusinessService, mongoose_1.MongooseModule]
    })
], BusinessModule);
exports.BusinessModule = BusinessModule;
//# sourceMappingURL=business.module.js.map