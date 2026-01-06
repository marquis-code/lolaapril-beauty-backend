"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const availability_controller_1 = require("./availability.controller");
const availability_service_1 = require("./availability.service");
const availability_scheduler_service_1 = require("./availability-scheduler.service");
const business_hours_schema_1 = require("./schemas/business-hours.schema");
const staff_availability_schema_1 = require("./schemas/staff-availability.schema");
const auth_module_1 = require("../auth/auth.module");
const business_module_1 = require("../business/business.module");
let AvailabilityModule = class AvailabilityModule {
};
AvailabilityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: business_hours_schema_1.BusinessHours.name, schema: business_hours_schema_1.BusinessHoursSchema },
                { name: staff_availability_schema_1.StaffAvailability.name, schema: staff_availability_schema_1.StaffAvailabilitySchema },
            ]),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            business_module_1.BusinessModule,
        ],
        controllers: [availability_controller_1.AvailabilityController],
        providers: [
            availability_service_1.AvailabilityService,
            availability_scheduler_service_1.AvailabilitySchedulerService,
        ],
        exports: [
            availability_service_1.AvailabilityService,
            mongoose_1.MongooseModule,
        ],
    })
], AvailabilityModule);
exports.AvailabilityModule = AvailabilityModule;
//# sourceMappingURL=availability.module.js.map