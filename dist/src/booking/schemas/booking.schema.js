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
exports.BookingSchema = exports.Booking = exports.BookingMetadata = exports.BookedService = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let BookedService = class BookedService {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Service', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BookedService.prototype, "serviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BookedService.prototype, "serviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], BookedService.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], BookedService.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BookedService.prototype, "preferredStaffId", void 0);
BookedService = __decorate([
    (0, mongoose_1.Schema)()
], BookedService);
exports.BookedService = BookedService;
let BookingMetadata = class BookingMetadata {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BookingMetadata.prototype, "userAgent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BookingMetadata.prototype, "ipAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BookingMetadata.prototype, "referrer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'web' }),
    __metadata("design:type", String)
], BookingMetadata.prototype, "platform", void 0);
BookingMetadata = __decorate([
    (0, mongoose_1.Schema)()
], BookingMetadata);
exports.BookingMetadata = BookingMetadata;
let Booking = class Booking {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Booking.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Booking.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Booking.prototype, "bookingNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [BookedService], required: true }),
    __metadata("design:type", Array)
], Booking.prototype, "services", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Booking.prototype, "preferredDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Booking.prototype, "preferredStartTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Booking.prototype, "estimatedEndTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Booking.prototype, "totalDuration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Booking.prototype, "estimatedTotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Booking.prototype, "clientName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Booking.prototype, "clientEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Booking.prototype, "clientPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "businessName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "businessPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "specialRequests", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: [
            'pending',
            'confirmed',
            'cancelled',
            'expired',
            'payment_failed',
            'slot_unavailable',
            'rejected'
        ],
        default: 'pending',
    }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['online', 'phone', 'walk_in', 'admin'],
        default: 'online',
    }),
    __metadata("design:type", String)
], Booking.prototype, "bookingSource", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "cancellationReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "rejectionReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Booking.prototype, "cancellationDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Booking.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Booking.prototype, "processedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Appointment" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Booking.prototype, "appointmentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BookingMetadata, default: {} }),
    __metadata("design:type", BookingMetadata)
], Booking.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Booking.prototype, "remindersSent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Booking.prototype, "lastReminderAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Booking.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Booking.prototype, "updatedAt", void 0);
Booking = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Booking);
exports.Booking = Booking;
exports.BookingSchema = mongoose_1.SchemaFactory.createForClass(Booking);
exports.BookingSchema.index({ clientId: 1 });
exports.BookingSchema.index({ businessId: 1 });
exports.BookingSchema.index({ bookingNumber: 1 });
exports.BookingSchema.index({ preferredDate: 1, preferredStartTime: 1 });
exports.BookingSchema.index({ status: 1 });
exports.BookingSchema.index({ bookingSource: 1 });
exports.BookingSchema.index({ createdAt: -1 });
exports.BookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.BookingSchema.index({ clientEmail: 1 });
exports.BookingSchema.index({ clientPhone: 1 });
exports.BookingSchema.pre('save', async function (next) {
    if (this.isNew && !this.bookingNumber) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const count = await this.model('Booking').countDocuments({
            createdAt: {
                $gte: new Date(year, today.getMonth(), today.getDate()),
                $lt: new Date(year, today.getMonth(), today.getDate() + 1)
            }
        });
        this.bookingNumber = `BK-${year}${month}${day}-${String(count + 1).padStart(3, '0')}`;
    }
    next();
});
//# sourceMappingURL=booking.schema.js.map