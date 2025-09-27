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
var BookingOrchestrator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingOrchestrator = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const appointment_service_1 = require("../../appointment/appointment.service");
const payment_service_1 = require("../../payment/payment.service");
const availability_service_1 = require("../../availability/availability.service");
const notification_service_1 = require("../../notification/notification.service");
const staff_service_1 = require("../../staff/staff.service");
const tenant_service_1 = require("../../tenant/tenant.service");
const service_service_1 = require("../../service/service.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let BookingOrchestrator = BookingOrchestrator_1 = class BookingOrchestrator {
    constructor(bookingService, appointmentService, paymentService, availabilityService, notificationService, staffService, tenantService, serviceService, eventEmitter) {
        this.bookingService = bookingService;
        this.appointmentService = appointmentService;
        this.paymentService = paymentService;
        this.availabilityService = availabilityService;
        this.notificationService = notificationService;
        this.staffService = staffService;
        this.tenantService = tenantService;
        this.serviceService = serviceService;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(BookingOrchestrator_1.name);
    }
    async createBookingWithValidation(createBookingDto) {
        try {
            this.logger.log(`Creating booking for client: ${createBookingDto.clientId}`);
            const limitsCheck = await this.tenantService.checkSubscriptionLimits(createBookingDto.businessId);
            if (!limitsCheck.isValid) {
                throw new common_1.BadRequestException(`Subscription limits exceeded: ${limitsCheck.warnings.join(', ')}`);
            }
            const services = await this.getServicesDetails(createBookingDto.serviceIds);
            const totalDuration = this.calculateTotalDuration(services);
            const estimatedEndTime = this.addMinutesToTime(createBookingDto.preferredStartTime, totalDuration);
            const isAvailable = await this.availabilityService.checkSlotAvailability({
                businessId: createBookingDto.businessId,
                serviceId: createBookingDto.serviceIds[0],
                date: createBookingDto.preferredDate,
                startTime: createBookingDto.preferredStartTime,
                duration: totalDuration
            });
            if (!isAvailable) {
                const availableSlots = await this.availabilityService.getAvailableSlots({
                    businessId: createBookingDto.businessId,
                    serviceId: createBookingDto.serviceIds[0],
                    date: createBookingDto.preferredDate,
                    duration: totalDuration
                });
                return {
                    bookingId: '',
                    bookingNumber: '',
                    estimatedTotal: this.calculateTotalPrice(services),
                    expiresAt: new Date(),
                    status: 'slot_unavailable',
                    clientId: createBookingDto.clientId,
                    businessId: createBookingDto.businessId,
                    booking: null,
                    availableSlots,
                    message: 'Requested time slot is not available. Please choose from alternative slots.'
                };
            }
            const bookingData = Object.assign(Object.assign({}, createBookingDto), { services: services.map(service => ({
                    serviceId: service._id,
                    serviceName: service.basicDetails.serviceName,
                    duration: this.getServiceDurationInMinutes(service),
                    price: service.pricingAndDuration.price.amount,
                    preferredStaffId: this.getPreferredStaff(service)
                })), estimatedEndTime,
                totalDuration, estimatedTotal: this.calculateTotalPrice(services), expiresAt: new Date(Date.now() + 30 * 60 * 1000) });
            const booking = await this.bookingService.createBooking(bookingData);
            await this.notificationService.notifyStaffNewBooking(booking);
            this.eventEmitter.emit('booking.created', booking);
            this.logger.log(`Booking created successfully: ${booking.bookingNumber}`);
            return {
                bookingId: booking._id.toString(),
                bookingNumber: booking.bookingNumber,
                estimatedTotal: booking.estimatedTotal,
                expiresAt: booking.expiresAt,
                status: booking.status,
                clientId: booking.clientId.toString(),
                businessId: booking.businessId.toString(),
                booking,
                message: 'Booking created successfully. Please proceed with payment to confirm.',
                requiresPayment: true
            };
        }
        catch (error) {
            this.logger.error(`Failed to create booking: ${error.message}`);
            throw error;
        }
    }
    async confirmBookingAndCreateAppointment(bookingId, staffId) {
        try {
            this.logger.log(`Confirming booking: ${bookingId}`);
            const booking = await this.bookingService.getBookingById(bookingId);
            if (!booking || booking.status !== 'pending') {
                throw new common_1.BadRequestException('Invalid booking for confirmation');
            }
            await this.bookingService.updateBookingStatus(bookingId, 'confirmed', staffId);
            const appointment = await this.appointmentService.createFromBooking(booking);
            let staffAssignment = null;
            try {
                staffAssignment = await this.staffService.autoAssignStaff(booking.businessId.toString(), appointment._id.toString(), booking.clientId.toString(), booking.services[0].serviceId.toString(), booking.preferredDate, booking.preferredStartTime, booking.estimatedEndTime);
            }
            catch (error) {
                this.logger.warn(`Auto-assignment failed: ${error.message}. Manual assignment required.`);
            }
            await this.sendConfirmationNotifications(booking, appointment, staffAssignment);
            this.eventEmitter.emit('booking.confirmed', { booking, staffId, appointment });
            this.eventEmitter.emit('appointment.created', { appointment, booking, staffAssignment });
            this.logger.log(`Appointment created successfully: ${appointment.appointmentNumber}`);
            return {
                appointmentId: appointment._id.toString(),
                appointmentNumber: appointment.appointmentNumber,
                scheduledDate: appointment.scheduledDate,
                scheduledTime: appointment.scheduledStartTime,
                status: appointment.status,
                clientId: appointment.clientId.toString(),
                businessId: appointment.businessId.toString(),
                booking: booking,
                message: 'Booking confirmed and appointment created successfully',
                appointment,
                assignment: staffAssignment
            };
        }
        catch (error) {
            this.logger.error(`Failed to confirm booking and create appointment: ${error.message}`);
            throw error;
        }
    }
    async handlePaymentAndComplete(bookingId, transactionReference, paymentData) {
        try {
            this.logger.log(`Processing payment for booking: ${bookingId}`);
            const booking = await this.bookingService.getBookingById(bookingId);
            if (!booking) {
                throw new common_1.NotFoundException('Booking not found');
            }
            if (booking.status !== 'pending') {
                throw new common_1.BadRequestException('Booking is not in pending status');
            }
            if (paymentData.amount !== booking.estimatedTotal) {
                throw new common_1.BadRequestException('Payment amount does not match booking total');
            }
            const isStillAvailable = await this.checkAvailabilityForAllServices(booking.businessId.toString(), booking.services.map(s => s.serviceId.toString()), booking.preferredDate, booking.preferredStartTime, booking.totalDuration);
            if (!isStillAvailable) {
                await this.handleUnavailableSlot(booking, transactionReference);
                throw new common_1.BadRequestException('Time slot is no longer available. Payment will be refunded.');
            }
            const appointmentResult = await this.confirmBookingAndCreateAppointment(bookingId);
            const payment = await this.paymentService.createPaymentFromBooking(booking, transactionReference, {
                paymentMethod: paymentData.method,
                gateway: paymentData.gateway,
                status: 'completed'
            });
            await this.paymentService.updatePaymentStatus(payment._id.toString(), 'completed', transactionReference);
            await this.bookingService.linkAppointment(bookingId, appointmentResult.appointment._id.toString());
            await this.notificationService.notifyPaymentConfirmation(payment._id.toString(), paymentData.clientId, paymentData.businessId, {
                clientName: booking.clientName,
                amount: paymentData.amount,
                method: paymentData.method,
                transactionId: transactionReference,
                serviceName: booking.services.map(s => s.serviceName).join(', '),
                appointmentDate: appointmentResult.appointment.scheduledDate.toDateString(),
                businessName: booking.businessName,
                receiptUrl: `${process.env.APP_URL}/receipts/${payment._id}`,
                clientEmail: booking.clientEmail,
                clientPhone: booking.clientPhone
            });
            this.eventEmitter.emit('payment.completed', { payment, booking, appointment: appointmentResult.appointment });
            this.logger.log(`Payment processed and appointment created successfully`);
            return {
                paymentId: payment._id.toString(),
                success: true,
                message: 'Payment successful! Your appointment has been confirmed automatically.',
                transactionReference,
                amount: paymentData.amount,
                method: paymentData.method,
                gateway: paymentData.gateway,
                status: 'completed',
                payment,
                appointment: appointmentResult.appointment
            };
        }
        catch (error) {
            this.logger.error(`Failed to process payment: ${error.message}`);
            await this.handlePaymentFailure(bookingId, transactionReference, error.message);
            throw error;
        }
    }
    async sendConfirmationNotifications(booking, appointment, staffAssignment) {
        await this.notificationService.notifyBookingConfirmation(booking._id.toString(), booking.clientId.toString(), booking.businessId.toString(), {
            clientName: booking.clientName,
            serviceName: booking.services.map(s => s.serviceName).join(', '),
            date: booking.preferredDate.toDateString(),
            time: booking.preferredStartTime,
            businessName: booking.businessName,
            businessAddress: booking.businessAddress || 'N/A',
            appointmentNumber: appointment.appointmentNumber,
            clientEmail: booking.clientEmail,
            clientPhone: booking.clientPhone
        });
        if (staffAssignment) {
            await this.notificationService.notifyStaffAssignment(appointment._id.toString(), staffAssignment.staffId.toString(), booking.businessId.toString(), {
                staffName: staffAssignment.staffName || 'Staff Member',
                clientName: booking.clientName,
                serviceName: booking.services.map(s => s.serviceName).join(', '),
                date: booking.preferredDate.toDateString(),
                time: booking.preferredStartTime,
                businessName: booking.businessName,
                appointmentNumber: appointment.appointmentNumber,
                staffEmail: 'staff@email.com',
                staffPhone: '+1234567890'
            });
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
    async handlePaymentFailure(bookingId, transactionReference, errorMessage) {
        await this.bookingService.updateBookingStatus(bookingId, 'payment_failed');
        const booking = await this.bookingService.getBookingById(bookingId);
        const payment = await this.paymentService.createFailedPayment({
            bookingId,
            transactionReference,
            errorMessage,
            clientId: booking.clientId.toString(),
            businessId: booking.businessId.toString(),
            amount: booking.estimatedTotal
        });
        await this.notificationService.notifyPaymentFailed(payment._id.toString(), booking.clientId.toString(), booking.businessId.toString(), {
            clientName: booking.clientName,
            amount: booking.estimatedTotal,
            failureReason: errorMessage,
            serviceName: booking.services.map(s => s.serviceName).join(', '),
            appointmentDate: booking.preferredDate.toDateString(),
            businessName: booking.businessName,
            businessPhone: booking.businessPhone || 'N/A',
            retryPaymentUrl: `${process.env.APP_URL}/retry-payment/${bookingId}`,
            clientEmail: booking.clientEmail,
            clientPhone: booking.clientPhone
        });
    }
    async handleUnavailableSlot(booking, transactionReference) {
        await this.bookingService.updateBookingStatus(booking._id.toString(), 'slot_unavailable');
        await this.paymentService.initiateRefund(transactionReference, booking.estimatedTotal);
        await this.notificationService.notifySlotUnavailableRefund(booking._id.toString(), booking.clientId.toString(), booking.businessId.toString(), {
            clientName: booking.clientName,
            serviceName: booking.services.map(s => s.serviceName).join(', '),
            date: booking.preferredDate.toDateString(),
            time: booking.preferredStartTime,
            businessName: booking.businessName,
            businessPhone: booking.businessPhone || 'N/A',
            clientEmail: booking.clientEmail,
            clientPhone: booking.clientPhone
        });
    }
    async getServicesDetails(serviceIds) {
        return await this.serviceService.getServicesByIds(serviceIds);
    }
    calculateTotalDuration(services) {
        return services.reduce((total, service) => {
            const duration = service.pricingAndDuration.duration.servicingTime;
            const minutes = duration.unit === 'h' ? duration.value * 60 : duration.value;
            return total + minutes;
        }, 0);
    }
    calculateTotalPrice(services) {
        return services.reduce((total, service) => {
            return total + service.pricingAndDuration.price.amount;
        }, 0);
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
    getPreferredStaff(service) {
        if (service.teamMembers.allTeamMembers)
            return undefined;
        const availableMembers = service.teamMembers.selectedMembers.filter(m => m.selected);
        return availableMembers.length > 0 ? availableMembers[0].id : undefined;
    }
};
BookingOrchestrator = BookingOrchestrator_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [booking_service_1.BookingService,
        appointment_service_1.AppointmentService,
        payment_service_1.PaymentService,
        availability_service_1.AvailabilityService,
        notification_service_1.NotificationService,
        staff_service_1.StaffService,
        tenant_service_1.TenantService,
        service_service_1.ServiceService,
        event_emitter_1.EventEmitter2])
], BookingOrchestrator);
exports.BookingOrchestrator = BookingOrchestrator;
//# sourceMappingURL=booking-orchestrator.service.js.map