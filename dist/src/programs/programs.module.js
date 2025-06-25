"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const programs_service_1 = require("./programs.service");
const programs_controller_1 = require("./programs.controller");
const program_schema_1 = require("./schemas/program.schema");
const program_application_schema_1 = require("./schemas/program-application.schema");
let ProgramsModule = class ProgramsModule {
};
ProgramsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: program_schema_1.Program.name, schema: program_schema_1.ProgramSchema },
                { name: program_application_schema_1.ProgramApplication.name, schema: program_application_schema_1.ProgramApplicationSchema },
            ]),
        ],
        providers: [programs_service_1.ProgramsService],
        controllers: [programs_controller_1.ProgramsController],
    })
], ProgramsModule);
exports.ProgramsModule = ProgramsModule;
//# sourceMappingURL=programs.module.js.map