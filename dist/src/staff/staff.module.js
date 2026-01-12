"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const staff_controller_1 = require("./staff.controller");
const staff_service_1 = require("./staff.service");
const staff_schema_1 = require("./schemas/staff.schema");
const staff_schedule_schema_1 = require("./schemas/staff-schedule.schema");
const staff_assignment_schema_1 = require("./schemas/staff-assignment.schema");
const working_hours_schema_1 = require("./schemas/working-hours.schema");
const user_schema_1 = require("../auth/schemas/user.schema");
const business_module_1 = require("../business/business.module");
const auth_module_1 = require("../auth/auth.module");
const service_module_1 = require("../service/service.module");
let StaffModule = class StaffModule {
};
StaffModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: staff_schema_1.Staff.name, schema: staff_schema_1.StaffSchema },
                { name: staff_schedule_schema_1.StaffSchedule.name, schema: staff_schedule_schema_1.StaffScheduleSchema },
                { name: staff_assignment_schema_1.StaffAssignment.name, schema: staff_assignment_schema_1.StaffAssignmentSchema },
                { name: working_hours_schema_1.WorkingHours.name, schema: working_hours_schema_1.WorkingHoursSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
            (0, common_1.forwardRef)(() => business_module_1.BusinessModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => service_module_1.ServiceModule),
        ],
        controllers: [staff_controller_1.StaffController],
        providers: [staff_service_1.StaffService],
        exports: [staff_service_1.StaffService],
    })
], StaffModule);
exports.StaffModule = StaffModule;
//# sourceMappingURL=staff.module.js.map