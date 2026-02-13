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
var SalesEventListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesEventListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const sales_service_1 = require("../sales.service");
let SalesEventListener = SalesEventListener_1 = class SalesEventListener {
    constructor(salesService) {
        this.salesService = salesService;
        this.logger = new common_1.Logger(SalesEventListener_1.name);
    }
    async handleBookingCompletedEvent(payload) {
        this.logger.log(`🔔 Handling booking.completed event for booking ${payload.booking.bookingNumber}`);
        try {
            const sale = await this.salesService.createFromBooking(payload.booking, payload.booking.businessId.toString());
            this.logger.log(`✅ Sale created from event: ${sale.saleNumber} for booking ${payload.booking.bookingNumber}`);
        }
        catch (error) {
            this.logger.error(`❌ Failed to create sale from booking completion event: ${error.message}`);
        }
    }
    async handleBookingStatusChangedEvent(payload) {
        if (payload.newStatus === 'completed') {
            this.logger.log(`🔔 Handling booking.status.changed (completed) event for booking ${payload.booking.bookingNumber}`);
            try {
                const sale = await this.salesService.createFromBooking(payload.booking, payload.booking.businessId.toString());
                this.logger.log(`✅ Sale created from event: ${sale.saleNumber} for booking ${payload.booking.bookingNumber}`);
            }
            catch (error) {
                this.logger.error(`❌ Failed to create sale from booking status change event: ${error.message}`);
            }
        }
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)('booking.completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SalesEventListener.prototype, "handleBookingCompletedEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('booking.status.changed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SalesEventListener.prototype, "handleBookingStatusChangedEvent", null);
SalesEventListener = SalesEventListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sales_service_1.SalesService])
], SalesEventListener);
exports.SalesEventListener = SalesEventListener;
//# sourceMappingURL=sales-event.listener.js.map