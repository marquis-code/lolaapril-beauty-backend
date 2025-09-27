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
var BookingAutomationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingAutomationService = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const appointment_service_1 = require("../../appointment/appointment.service");
const payment_service_1 = require("../../payment/payment.service");
const notification_service_1 = require("../../notification/notification.service");
const staff_service_1 = require("../../staff/staff.service");
const availability_service_1 = require("../../availability/availability.service");
const tenant_service_1 = require("../../tenant/tenant.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let BookingAutomationService = BookingAutomationService_1 = class BookingAutomationService {
    constructor(bookingService, appointmentService, paymentService, notificationService, staffService, availabilityService, tenantService, eventEmitter) {
        this.bookingService = bookingService;
        this.appointmentService = appointmentService;
        this.paymentService = paymentService;
        this.notificationService = notificationService;
        this.staffService = staffService;
        this.availabilityService = availabilityService;
        this.tenantService = tenantService;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(BookingAutomationService_1.name);
    }
    async createAutomatedBooking(bookingData) {
        try {
            this.logger.log(`Creating automated booking for client: ${bookingData.clientId}`);
            await this.validateTenantLimits(bookingData.businessId);
            const services = await this.getServicesDetails(bookingData.serviceIds);
            const { totalDuration, totalAmount } = this.calculateBookingTotals(services);
            const estimatedEndTime = this.addMinutesToTime(bookingData.preferredStartTime, totalDuration);
            const isAvailable = await this.checkAvailabilityForAllServices(bookingData.businessId, bookingData.serviceIds, bookingData.preferredDate, bookingData.preferredStartTime, totalDuration);
            if (!isAvailable) {
                throw new common_1.BadRequestException('Selected time slot is no longer available');
            }
            const booking = await this.bookingService.createBooking({
                businessId: bookingData.businessId,
                clientId: bookingData.clientId,
                services: services.map(service => ({
                    serviceId: service._id,
                    serviceName: service.basicDetails.serviceName,
                    duration: this.getServiceDurationInMinutes(service),
                    price: service.pricingAndDuration.price.amount,
                })),
                preferredDate: bookingData.preferredDate,
                preferredStartTime: bookingData.preferredStartTime,
                estimatedEndTime,
                totalDuration,
                estimatedTotal: totalAmount,
                specialRequests: bookingData.specialRequests,
                status: bookingData.autoConfirm ? 'confirmed' : 'pending'
            });
            this.logger.log(`Booking created with ID: ${booking._id}`);
            if (bookingData.autoConfirm) {
                return await this.processAutoConfirmedBooking(booking, services);
            }
            await this.notificationService.notifyStaffNewBooking(booking);
            return {
                booking,
                message: 'Booking created successfully. Payment required to confirm appointment.',
                requiresPayment: true
            };
        }
        catch (error) {
            this.logger.error(`Failed to create automated booking: ${error.message}`);
            throw error;
        }
    }
    async processPaymentAndCreateAppointment(bookingId, paymentData) {
        try {
            this.logger.log(`Processing payment for booking: ${bookingId}`);
            const booking = await this.bookingService.getBookingById(bookingId);
            if (!booking) {
                throw new common_1.BadRequestException('Booking not found');
            }
            if (booking.status !== 'pending') {
                throw new common_1.BadRequestException('Booking is not in pending status');
            }
            if (paymentData.amount !== booking.estimatedTotal) {
                throw new common_1.BadRequestException('Payment amount does not match booking total');
            }
            if (paymentData.status === 'failed') {
                return await this.handlePaymentFailure(booking, paymentData.transactionReference);
            }
            const isStillAvailable = await this.checkAvailabilityForAllServices(booking.businessId.toString(), booking.services.map(s => s.serviceId.toString()), booking.preferredDate, booking.preferredStartTime, booking.totalDuration);
            if (!isStillAvailable) {
                await this.handleUnavailableSlot(booking, paymentData.transactionReference);
                throw new common_1.BadRequestException('Time slot is no longer available. Payment will be refunded.');
            }
            await this.bookingService.updateBookingStatus(bookingId, 'confirmed');
            const payment = await this.paymentService.createPaymentFromBooking(booking, paymentData.transactionReference, {
                paymentMethod: paymentData.paymentMethod,
                gateway: paymentData.gateway,
                status: 'completed'
            });
            const appointment = await this.appointmentService.createFromBooking(booking);
            const staffAssignment = await this.autoAssignStaffToAppointment(appointment, booking.services);
            await this.sendAppointmentConfirmationNotifications(appointment, payment, staffAssignment);
            this.eventEmitter.emit('appointment.created', {
                appointment,
                booking,
                payment,
                staffAssignment
            });
            this.logger.log(`Successfully created appointment: ${appointment._id}`);
            return {
                booking,
                appointment,
                payment,
                staffAssignment,
                message: 'Payment successful! Your appointment has been confirmed.',
                requiresPayment: false
            };
        }
        catch (error) {
            this.logger.error(`Failed to process payment and create appointment: ${error.message}`);
            throw error;
        }
    }
    async processAutoConfirmedBooking(booking, services) {
        const appointment = await this.appointmentService.createFromBooking(booking);
        const staffAssignment = await this.autoAssignStaffToAppointment(appointment, services);
        await this.sendAppointmentConfirmationNotifications(appointment, null, staffAssignment);
        return {
            booking,
            appointment,
            staffAssignment,
            message: 'Booking confirmed and appointment created successfully!',
            requiresPayment: false
        };
    }
    async validateTenantLimits(businessId) {
        const limitsCheck = await this.tenantService.checkSubscriptionLimits(businessId);
        if (!limitsCheck.isValid) {
            throw new common_1.BadRequestException(`Subscription limits exceeded: ${limitsCheck.warnings.join(', ')}`);
        }
    }
    async checkAvailabilityForAllServices(businessId, serviceIds, date, startTime, totalDuration) {
        return await this.availabilityService.checkSlotAvailability({
            businessId,
            serviceId: serviceIds[0],
            date,
            startTime,
            duration: totalDuration
        });
    }
    async autoAssignStaffToAppointment(appointment, services) {
        try {
            const primaryService = services[0];
            return await this.staffService.autoAssignStaff(appointment.businessId.toString(), appointment._id.toString(), appointment.clientId.toString(), primaryService._id.toString(), appointment.scheduledDate, appointment.scheduledStartTime, appointment.scheduledEndTime);
        }
        catch (error) {
            this.logger.warn(`Staff auto-assignment failed: ${error.message}. Manual assignment required.`);
            return null;
        }
    }
    async sendAppointmentConfirmationNotifications(appointment, payment, staffAssignment) {
        await this.notificationService.notifyBookingConfirmation(appointment.bookingId.toString(), appointment.clientId.toString(), appointment.businessId.toString(), {
            clientName: appointment.clientName,
            serviceName: appointment.services.map(s => s.serviceName).join(', '),
            date: appointment.scheduledDate.toDateString(),
            time: appointment.scheduledStartTime,
            businessName: appointment.businessName,
            appointmentNumber: appointment.appointmentNumber,
            clientEmail: appointment.clientEmail,
            clientPhone: appointment.clientPhone
        });
        if (payment) {
            await this.notificationService.notifyPaymentConfirmation(payment._id.toString(), appointment.clientId.toString(), appointment.businessId.toString(), {
                clientName: appointment.clientName,
                amount: payment.totalAmount,
                method: payment.paymentMethod,
                transactionId: payment.transactionId,
                serviceName: appointment.services.map(s => s.serviceName).join(', '),
                appointmentDate: appointment.scheduledDate.toDateString(),
                businessName: appointment.businessName,
                clientEmail: appointment.clientEmail,
                clientPhone: appointment.clientPhone
            });
        }
        if (staffAssignment) {
            await this.notificationService.notifyStaffAssignment(appointment._id.toString(), staffAssignment.staffId.toString(), appointment.businessId.toString(), {
                staffName: staffAssignment.staffName,
                clientName: appointment.clientName,
                serviceName: appointment.services.map(s => s.serviceName).join(', '),
                date: appointment.scheduledDate.toDateString(),
                time: appointment.scheduledStartTime,
                businessName: appointment.businessName,
                appointmentNumber: appointment.appointmentNumber
            });
        }
    }
    async handlePaymentFailure(booking, transactionReference) {
        await this.bookingService.updateBookingStatus(booking._id.toString(), 'payment_failed');
        await this.paymentService.createFailedPayment({
            bookingId: booking._id.toString(),
            transactionReference,
            clientId: booking.clientId.toString(),
            businessId: booking.businessId.toString(),
            amount: booking.estimatedTotal,
            errorMessage: 'Payment failed'
        });
        await this.notificationService.notifyPaymentFailed(booking._id.toString(), booking.clientId.toString(), booking.businessId.toString(), {
            clientName: booking.clientName,
            amount: booking.estimatedTotal,
            failureReason: 'Payment processing failed',
            serviceName: booking.services.map(s => s.serviceName).join(', '),
            businessName: booking.businessName,
            retryPaymentUrl: `${process.env.APP_URL}/retry-payment/${booking._id}`,
            clientEmail: booking.clientEmail,
            clientPhone: booking.clientPhone
        });
        return {
            booking,
            message: 'Payment failed. Please try again or contact support.',
            requiresPayment: true
        };
    }
    async handleUnavailableSlot(booking, transactionReference) {
        await this.bookingService.updateBookingStatus(booking._id.toString(), 'slot_unavailable');
        await this.paymentService.initiateRefund(transactionReference, booking.estimatedTotal);
        await this.notificationService.notifySlotUnavailableRefund(booking._id.toString(), booking.clientId.toString(), booking.businessId.toString(), {
            clientName: booking.clientName,
            amount: booking.estimatedTotal,
            serviceName: booking.services.map(s => s.serviceName).join(', '),
            businessName: booking.businessName,
            rebookUrl: `${process.env.APP_URL}/book-again`,
            clientEmail: booking.clientEmail,
            clientPhone: booking.clientPhone
        });
    }
    async getServicesDetails(serviceIds) {
        return serviceIds.map(id => ({
            _id: id,
            basicDetails: {
                serviceName: 'Sample Service',
            },
            pricingAndDuration: {
                price: { amount: 5000 },
                duration: {
                    servicingTime: { value: 60, unit: 'min' }
                }
            }
        }));
    }
    calculateBookingTotals(services) {
        const totalDuration = services.reduce((total, service) => {
            const duration = service.pricingAndDuration.duration.servicingTime;
            const minutes = duration.unit === 'h' ? duration.value * 60 : duration.value;
            return total + minutes;
        }, 0);
        const totalAmount = services.reduce((total, service) => {
            return total + service.pricingAndDuration.price.amount;
        }, 0);
        return { totalDuration, totalAmount };
    }
    getServiceDurationInMinutes(service) {
        const duration = service.pricingAndDuration.duration.servicingTime;
        return duration.unit === 'h' ? duration.value * 60 : duration.value;
    }
    addMinutesToTime(time, minutes) {
        const [hours, mins] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + mins + minutes;
        const newHours = Math.floor(totalMinutes / 60);
        const newMins = totalMinutes % 60;
        return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
    }
};
BookingAutomationService = BookingAutomationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [booking_service_1.BookingService,
        appointment_service_1.AppointmentService,
        payment_service_1.PaymentService,
        notification_service_1.NotificationService,
        staff_service_1.StaffService,
        availability_service_1.AvailabilityService,
        tenant_service_1.TenantService,
        event_emitter_1.EventEmitter2])
], BookingAutomationService);
exports.BookingAutomationService = BookingAutomationService;
//# sourceMappingURL=booking-automation.service.js.map