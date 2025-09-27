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
exports.StaffSchema = exports.Staff = exports.StaffCommission = exports.StaffSkills = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let StaffSkills = class StaffSkills {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Service', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffSkills.prototype, "serviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], StaffSkills.prototype, "serviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['beginner', 'intermediate', 'expert', 'master'],
        default: 'intermediate'
    }),
    __metadata("design:type", String)
], StaffSkills.prototype, "skillLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StaffSkills.prototype, "experienceMonths", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], StaffSkills.prototype, "isActive", void 0);
StaffSkills = __decorate([
    (0, mongoose_1.Schema)()
], StaffSkills);
exports.StaffSkills = StaffSkills;
let StaffCommission = class StaffCommission {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Service' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffCommission.prototype, "serviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    }),
    __metadata("design:type", String)
], StaffCommission.prototype, "commissionType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], StaffCommission.prototype, "commissionValue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StaffCommission.prototype, "minimumAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], StaffCommission.prototype, "isActive", void 0);
StaffCommission = __decorate([
    (0, mongoose_1.Schema)()
], StaffCommission);
exports.StaffCommission = StaffCommission;
let Staff = class Staff {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Staff.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Staff.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Staff.prototype, "staffId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Staff.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Staff.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Staff.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Staff.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['stylist', 'barber', 'therapist', 'nail_tech', 'receptionist', 'manager', 'owner'],
    }),
    __metadata("design:type", String)
], Staff.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['full_time', 'part_time', 'contractor', 'intern'],
        default: 'full_time'
    }),
    __metadata("design:type", String)
], Staff.prototype, "employmentType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Staff.prototype, "hireDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Staff.prototype, "terminationDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['active', 'inactive', 'on_leave', 'terminated'],
        default: 'active'
    }),
    __metadata("design:type", String)
], Staff.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [StaffSkills], default: [] }),
    __metadata("design:type", Array)
], Staff.prototype, "skills", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [StaffCommission], default: [] }),
    __metadata("design:type", Array)
], Staff.prototype, "commissionStructure", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Staff.prototype, "profileImage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Staff.prototype, "bio", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Staff.prototype, "certifications", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Staff.prototype, "totalRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Staff.prototype, "totalReviews", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Staff.prototype, "completedAppointments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Staff.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Staff.prototype, "updatedAt", void 0);
Staff = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Staff);
exports.Staff = Staff;
exports.StaffSchema = mongoose_1.SchemaFactory.createForClass(Staff);
exports.StaffSchema.index({ businessId: 1, userId: 1 });
exports.StaffSchema.index({ businessId: 1, status: 1 });
exports.StaffSchema.index({ staffId: 1 });
//# sourceMappingURL=staff.schema.js.map