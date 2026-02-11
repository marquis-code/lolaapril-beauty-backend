"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const team_service_1 = require("./team.service");
const team_controller_1 = require("./team.controller");
const team_member_schema_1 = require("./schemas/team-member.schema");
const service_schema_1 = require("../service/schemas/service.schema");
const audit_module_1 = require("../audit/audit.module");
let TeamModule = class TeamModule {
};
TeamModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: team_member_schema_1.TeamMember.name, schema: team_member_schema_1.TeamMemberSchema }, { name: service_schema_1.Service.name, schema: service_schema_1.ServiceSchema },
            ]), audit_module_1.AuditModule],
        controllers: [team_controller_1.TeamController],
        providers: [team_service_1.TeamService],
        exports: [team_service_1.TeamService],
    })
], TeamModule);
exports.TeamModule = TeamModule;
//# sourceMappingURL=team.module.js.map