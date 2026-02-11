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
exports.TeamMemberSchema = exports.TeamMember = exports.CommissionSchema = exports.Commission = exports.SkillsSchema = exports.Skills = exports.WorkingHoursSchema = exports.WorkingHours = exports.CommissionType = exports.EmploymentType = exports.TeamStatus = exports.TeamRole = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var TeamRole;
(function (TeamRole) {
    TeamRole["ADMIN"] = "admin";
    TeamRole["MANAGER"] = "manager";
    TeamRole["STYLIST"] = "stylist";
    TeamRole["THERAPIST"] = "therapist";
    TeamRole["RECEPTIONIST"] = "receptionist";
    TeamRole["CLEANER"] = "cleaner";
})(TeamRole = exports.TeamRole || (exports.TeamRole = {}));
var TeamStatus;
(function (TeamStatus) {
    TeamStatus["ACTIVE"] = "active";
    TeamStatus["INACTIVE"] = "inactive";
    TeamStatus["SUSPENDED"] = "suspended";
    TeamStatus["ON_LEAVE"] = "on_leave";
})(TeamStatus = exports.TeamStatus || (exports.TeamStatus = {}));
var EmploymentType;
(function (EmploymentType) {
    EmploymentType["FULL_TIME"] = "full_time";
    EmploymentType["PART_TIME"] = "part_time";
    EmploymentType["CONTRACT"] = "contract";
    EmploymentType["FREELANCE"] = "freelance";
})(EmploymentType = exports.EmploymentType || (exports.EmploymentType = {}));
var CommissionType;
(function (CommissionType) {
    CommissionType["PERCENTAGE"] = "percentage";
    CommissionType["FIXED"] = "fixed";
})(CommissionType = exports.CommissionType || (exports.CommissionType = {}));
let WorkingHours = class WorkingHours {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WorkingHours.prototype, "day", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WorkingHours.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WorkingHours.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], WorkingHours.prototype, "isWorking", void 0);
WorkingHours = __decorate([
    (0, mongoose_1.Schema)()
], WorkingHours);
exports.WorkingHours = WorkingHours;
exports.WorkingHoursSchema = mongoose_1.SchemaFactory.createForClass(WorkingHours);
let Skills = class Skills {
};
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: 'Service', default: [] }),
    __metadata("design:type", Array)
], Skills.prototype, "services", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Skills.prototype, "specializations", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Skills.prototype, "experienceLevel", void 0);
Skills = __decorate([
    (0, mongoose_1.Schema)()
], Skills);
exports.Skills = Skills;
exports.SkillsSchema = mongoose_1.SchemaFactory.createForClass(Skills);
let Commission = class Commission {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Service', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Commission.prototype, "serviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Commission.prototype, "serviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['percentage', 'fixed'] }),
    __metadata("design:type", String)
], Commission.prototype, "commissionType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Commission.prototype, "commissionValue", void 0);
Commission = __decorate([
    (0, mongoose_1.Schema)()
], Commission);
exports.Commission = Commission;
exports.CommissionSchema = mongoose_1.SchemaFactory.createForClass(Commission);
let TeamMember = class TeamMember {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TeamMember.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            countryCode: { type: String, required: true },
            number: { type: String, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], TeamMember.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ["admin", "manager", "stylist", "therapist", "receptionist", "cleaner"],
    }),
    __metadata("design:type", String)
], TeamMember.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ["full_time", "part_time", "contract", "freelance"],
    }),
    __metadata("design:type", String)
], TeamMember.prototype, "employmentType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], TeamMember.prototype, "hireDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], TeamMember.prototype, "salary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.WorkingHoursSchema], default: [] }),
    __metadata("design:type", Array)
], TeamMember.prototype, "workingHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.SkillsSchema, default: {} }),
    __metadata("design:type", Skills)
], TeamMember.prototype, "skills", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.CommissionSchema], default: [] }),
    __metadata("design:type", Array)
], TeamMember.prototype, "commissions", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TeamMember.prototype, "profileImage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TeamMember.prototype, "bio", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], TeamMember.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], TeamMember.prototype, "canBookOnline", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            name: { type: String, required: true },
            relationship: { type: String, required: true },
            phone: { type: String, required: true },
        }
    }),
    __metadata("design:type", Object)
], TeamMember.prototype, "emergencyContact", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], TeamMember.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], TeamMember.prototype, "updatedAt", void 0);
TeamMember = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TeamMember);
exports.TeamMember = TeamMember;
exports.TeamMemberSchema = mongoose_1.SchemaFactory.createForClass(TeamMember);
exports.TeamMemberSchema.index({ email: 1 });
exports.TeamMemberSchema.index({ role: 1 });
exports.TeamMemberSchema.index({ isActive: 1 });
exports.TeamMemberSchema.index({ employmentType: 1 });
exports.TeamMemberSchema.index({ "skills.services": 1 });
exports.TeamMemberSchema.index({ "commissions.serviceId": 1 });
//# sourceMappingURL=team-member.schema.js.map