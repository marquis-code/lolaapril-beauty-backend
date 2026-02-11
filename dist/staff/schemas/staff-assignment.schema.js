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
exports.StaffAssignmentSchema = exports.StaffAssignment = exports.AssignmentHistory = exports.AssignmentNotes = exports.AssignmentDetails = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AssignmentDetails = class AssignmentDetails {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AssignmentDetails.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AssignmentDetails.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['primary', 'secondary', 'backup'],
        default: 'primary'
    }),
    __metadata("design:type", String)
], AssignmentDetails.prototype, "assignmentType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], AssignmentDetails.prototype, "estimatedDuration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AssignmentDetails.prototype, "specialInstructions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Service', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AssignmentDetails.prototype, "serviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AssignmentDetails.prototype, "serviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AssignmentDetails.prototype, "roomNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], AssignmentDetails.prototype, "requiredEquipment", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AssignmentDetails.prototype, "clientPreferences", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], AssignmentDetails.prototype, "setupTimeMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], AssignmentDetails.prototype, "cleanupTimeMinutes", void 0);
AssignmentDetails = __decorate([
    (0, mongoose_1.Schema)()
], AssignmentDetails);
exports.AssignmentDetails = AssignmentDetails;
let AssignmentNotes = class AssignmentNotes {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AssignmentNotes.prototype, "note", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AssignmentNotes.prototype, "addedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], AssignmentNotes.prototype, "addedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['general', 'client_request', 'admin_note', 'completion_note'],
        default: 'general'
    }),
    __metadata("design:type", String)
], AssignmentNotes.prototype, "noteType", void 0);
AssignmentNotes = __decorate([
    (0, mongoose_1.Schema)()
], AssignmentNotes);
exports.AssignmentNotes = AssignmentNotes;
let AssignmentHistory = class AssignmentHistory {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AssignmentHistory.prototype, "action", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AssignmentHistory.prototype, "performedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], AssignmentHistory.prototype, "performedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AssignmentHistory.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AssignmentHistory.prototype, "previousValue", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AssignmentHistory.prototype, "newValue", void 0);
AssignmentHistory = __decorate([
    (0, mongoose_1.Schema)()
], AssignmentHistory);
exports.AssignmentHistory = AssignmentHistory;
let StaffAssignment = class StaffAssignment {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Staff', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffAssignment.prototype, "staffId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffAssignment.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Appointment', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffAssignment.prototype, "appointmentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffAssignment.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], StaffAssignment.prototype, "assignmentDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: AssignmentDetails, required: true }),
    __metadata("design:type", AssignmentDetails)
], StaffAssignment.prototype, "assignmentDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'],
        default: 'scheduled'
    }),
    __metadata("design:type", String)
], StaffAssignment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StaffAssignment.prototype, "actualStartTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StaffAssignment.prototype, "actualEndTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StaffAssignment.prototype, "completionNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, max: 5, default: 0 }),
    __metadata("design:type", Number)
], StaffAssignment.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StaffAssignment.prototype, "clientFeedback", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StaffAssignment.prototype, "staffFeedback", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['auto', 'manual', 'client_request', 'admin_override'],
        default: 'auto'
    }),
    __metadata("design:type", String)
], StaffAssignment.prototype, "assignmentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffAssignment.prototype, "assignedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StaffAssignment.prototype, "reassignmentReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Staff' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffAssignment.prototype, "previousStaffId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StaffAssignment.prototype, "reassignmentCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [AssignmentNotes], default: [] }),
    __metadata("design:type", Array)
], StaffAssignment.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [AssignmentHistory], default: [] }),
    __metadata("design:type", Array)
], StaffAssignment.prototype, "history", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StaffAssignment.prototype, "servicePrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StaffAssignment.prototype, "commissionAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    }),
    __metadata("design:type", String)
], StaffAssignment.prototype, "commissionType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StaffAssignment.prototype, "commissionRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], StaffAssignment.prototype, "commissionPaid", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], StaffAssignment.prototype, "paymentDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], StaffAssignment.prototype, "checkedInAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], StaffAssignment.prototype, "checkedOutAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StaffAssignment.prototype, "actualDurationMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StaffAssignment.prototype, "overtimeMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StaffAssignment.prototype, "breakTimeMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], StaffAssignment.prototype, "qualityCheckCompleted", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StaffAssignment.prototype, "qualityCheckNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffAssignment.prototype, "qualityCheckedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], StaffAssignment.prototype, "qualityCheckDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], StaffAssignment.prototype, "reminderSent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], StaffAssignment.prototype, "reminderSentAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], StaffAssignment.prototype, "confirmationSent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], StaffAssignment.prototype, "confirmationSentAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], StaffAssignment.prototype, "followUpRequired", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], StaffAssignment.prototype, "followUpDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StaffAssignment.prototype, "followUpNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], StaffAssignment.prototype, "followUpCompleted", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StaffAssignment.prototype, "cancellationReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], StaffAssignment.prototype, "cancellationDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffAssignment.prototype, "cancelledBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], StaffAssignment.prototype, "cancellationFeeApplied", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StaffAssignment.prototype, "cancellationFeeAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], StaffAssignment.prototype, "noShowReportedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffAssignment.prototype, "noShowReportedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], StaffAssignment.prototype, "noShowFeeApplied", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], StaffAssignment.prototype, "noShowFeeAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], StaffAssignment.prototype, "originalDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StaffAssignment.prototype, "originalStartTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StaffAssignment.prototype, "rescheduleReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], StaffAssignment.prototype, "rescheduledAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffAssignment.prototype, "rescheduledBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], StaffAssignment.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], StaffAssignment.prototype, "updatedAt", void 0);
StaffAssignment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], StaffAssignment);
exports.StaffAssignment = StaffAssignment;
exports.StaffAssignmentSchema = mongoose_1.SchemaFactory.createForClass(StaffAssignment);
exports.StaffAssignmentSchema.index({ staffId: 1, assignmentDate: 1 });
exports.StaffAssignmentSchema.index({ appointmentId: 1 });
exports.StaffAssignmentSchema.index({ businessId: 1, status: 1 });
exports.StaffAssignmentSchema.index({ clientId: 1, assignmentDate: 1 });
exports.StaffAssignmentSchema.index({ businessId: 1, assignmentDate: 1, status: 1 });
exports.StaffAssignmentSchema.index({ staffId: 1, status: 1 });
exports.StaffAssignmentSchema.index({ assignmentDate: 1, status: 1 });
exports.StaffAssignmentSchema.index({ 'assignmentDetails.serviceId': 1 });
exports.StaffAssignmentSchema.index({ commissionPaid: 1, paymentDate: 1 });
exports.StaffAssignmentSchema.index({ followUpRequired: 1, followUpDate: 1 });
exports.StaffAssignmentSchema.index({
    businessId: 1,
    staffId: 1,
    assignmentDate: 1,
    status: 1
});
exports.StaffAssignmentSchema.index({
    businessId: 1,
    assignmentDate: 1,
    'assignmentDetails.startTime': 1
});
exports.StaffAssignmentSchema.virtual('totalDurationMinutes').get(function () {
    return this.assignmentDetails.estimatedDuration +
        this.assignmentDetails.setupTimeMinutes +
        this.assignmentDetails.cleanupTimeMinutes;
});
exports.StaffAssignmentSchema.virtual('timeRange').get(function () {
    return `${this.assignmentDetails.startTime} - ${this.assignmentDetails.endTime}`;
});
exports.StaffAssignmentSchema.virtual('calculatedCommission').get(function () {
    if (this.commissionType === 'percentage') {
        return (this.servicePrice * this.commissionRate) / 100;
    }
    return this.commissionAmount;
});
exports.StaffAssignmentSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        this.history.push({
            action: `status_changed_to_${this.status}`,
            performedAt: new Date(),
            newValue: this.status,
            performedBy: this.assignedBy || null,
            reason: 'Status updated',
            previousValue: ''
        });
    }
    if (this.isModified('staffId') && this.isNew === false) {
        this.reassignmentCount += 1;
        this.history.push({
            action: 'reassigned',
            performedAt: new Date(),
            previousValue: this.previousStaffId?.toString() || '',
            newValue: this.staffId.toString(),
            performedBy: this.assignedBy || null,
            reason: this.reassignmentReason || 'Staff reassigned'
        });
    }
    this.updatedAt = new Date();
    next();
});
exports.StaffAssignmentSchema.statics.findByStaffAndDateRange = function (staffId, startDate, endDate) {
    return this.find({
        staffId: new mongoose_2.Types.ObjectId(staffId),
        assignmentDate: {
            $gte: startDate,
            $lte: endDate
        }
    }).sort({ assignmentDate: 1, 'assignmentDetails.startTime': 1 });
};
exports.StaffAssignmentSchema.statics.findActiveAssignments = function (businessId, date) {
    const query = {
        businessId: new mongoose_2.Types.ObjectId(businessId),
        status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
    };
    if (date) {
        query.assignmentDate = {
            $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        };
    }
    return this.find(query)
        .populate('staffId', 'firstName lastName')
        .populate('clientId', 'firstName lastName phone')
        .sort({ assignmentDate: 1, 'assignmentDetails.startTime': 1 });
};
exports.StaffAssignmentSchema.statics.findPendingCommissions = function (businessId, staffId) {
    const query = {
        businessId: new mongoose_2.Types.ObjectId(businessId),
        status: 'completed',
        commissionPaid: false,
        commissionAmount: { $gt: 0 }
    };
    if (staffId) {
        query.staffId = new mongoose_2.Types.ObjectId(staffId);
    }
    return this.find(query).populate('staffId', 'firstName lastName');
};
exports.StaffAssignmentSchema.methods.addNote = function (noteText, addedBy, noteType = 'general') {
    this.notes.push({
        note: noteText,
        addedBy: new mongoose_2.Types.ObjectId(addedBy),
        addedAt: new Date(),
        noteType
    });
    return this.save();
};
exports.StaffAssignmentSchema.methods.markCommissionPaid = function (paidBy) {
    this.commissionPaid = true;
    this.paymentDate = new Date();
    this.history.push({
        action: 'commission_paid',
        performedBy: new mongoose_2.Types.ObjectId(paidBy),
        performedAt: new Date()
    });
    return this.save();
};
exports.StaffAssignmentSchema.methods.calculateActualDuration = function () {
    if (this.actualStartTime && this.actualEndTime) {
        const start = this.timeToMinutes(this.actualStartTime);
        const end = this.timeToMinutes(this.actualEndTime);
        this.actualDurationMinutes = end - start;
        if (this.actualDurationMinutes > this.assignmentDetails.estimatedDuration) {
            this.overtimeMinutes = this.actualDurationMinutes - this.assignmentDetails.estimatedDuration;
        }
    }
    return this.save();
};
exports.StaffAssignmentSchema.methods.timeToMinutes = function (time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};
//# sourceMappingURL=staff-assignment.schema.js.map