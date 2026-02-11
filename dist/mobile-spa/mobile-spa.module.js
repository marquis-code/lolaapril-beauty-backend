"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileSpaModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mobile_spa_service_1 = require("./mobile-spa.service");
const mobile_spa_controller_1 = require("./mobile-spa.controller");
const mobile_spa_request_schema_1 = require("./schemas/mobile-spa-request.schema");
const notification_module_1 = require("../notification/notification.module");
const service_module_1 = require("../service/service.module");
let MobileSpaModule = class MobileSpaModule {
};
MobileSpaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: mobile_spa_request_schema_1.MobileSpaRequest.name, schema: mobile_spa_request_schema_1.MobileSpaRequestSchema },
            ]),
            notification_module_1.NotificationModule,
            service_module_1.ServiceModule,
        ],
        controllers: [mobile_spa_controller_1.MobileSpaController],
        providers: [mobile_spa_service_1.MobileSpaService],
        exports: [mobile_spa_service_1.MobileSpaService],
    })
], MobileSpaModule);
exports.MobileSpaModule = MobileSpaModule;
//# sourceMappingURL=mobile-spa.module.js.map