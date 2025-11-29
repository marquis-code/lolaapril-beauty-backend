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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const winston_1 = require("winston");
const nest_winston_1 = require("nest-winston");
let BookingOrchestrator = class BookingOrchestrator {
    constructor(logger, bookingService, appointmentService, paymentService, availabilityService, notificationService, staffService, tenantService, serviceService, eventEmitter) {
        this.logger = logger;
        this.bookingService = bookingService;
        this.appointmentService = appointmentService;
        this.paymentService = paymentService;
        this.availabilityService = availabilityService;
        this.notificationService = notificationService;
        this.staffService = staffService;
        this.tenantService = tenantService;
        this.serviceService = serviceService;
        this.eventEmitter = eventEmitter;
    }
    calculateTotalBufferTime(services) {
        return services.reduce((total, service) => {
            return total + (service.bufferTime || 0);
        }, 0);
    }
    async sendConfirmationNotifications(booking, appointment, staffAssignments) {
        const bookingDate = this.parseDate(booking.preferredDate);
        await this.notificationService.notifyBookingConfirmation(booking._id.toString(), booking.clientId.toString(), booking.businessId.toString(), {
            clientName: booking.clientName,
            serviceName: booking.services.map(s => s.serviceName).join(', '),
            date: bookingDate.toDateString(),
            time: booking.preferredStartTime,
            businessName: booking.businessName,
            businessAddress: booking.businessAddress || 'N/A',
            appointmentNumber: appointment.appointmentNumber,
            clientEmail: booking.clientEmail,
            clientPhone: booking.clientPhone,
            staffCount: staffAssignments.length
        });
        for (const assignment of staffAssignments) {
            if (assignment.status === 'assigned' && assignment.staffId) {
                try {
                    const assignedService = booking.services.find(s => s.serviceId.toString() === assignment.serviceId);
                    await this.notificationService.notifyStaffAssignment(appointment._id.toString(), assignment.staffId, booking.businessId.toString(), {
                        staffName: assignment.staffName || 'Staff Member',
                        clientName: booking.clientName,
                        serviceName: (assignedService === null || assignedService === void 0 ? void 0 : assignedService.serviceName) || 'Service',
                        date: bookingDate.toDateString(),
                        time: booking.preferredStartTime,
                        businessName: booking.businessName,
                        appointmentNumber: appointment.appointmentNumber,
                        staffEmail: assignment.email || 'staff@email.com',
                        staffPhone: assignment.phone || '+1234567890'
                    });
                }
                catch (error) {
                    this.logger.error(`Failed to notify staff ${assignment.staffId}: ${error.message}`);
                }
            }
        }
    }
    async createBookingWithValidation(createBookingDto) {
        try {
            console.log(`🚀 Creating booking for client: ${createBookingDto.clientId}`);
            const preferredDate = this.parseDate(createBookingDto.preferredDate);
            const dateString = this.formatDateForAvailability(preferredDate);
            const limitsCheck = await this.tenantService.checkSubscriptionLimits(createBookingDto.businessId, 'booking');
            if (!limitsCheck.isValid) {
                throw new common_1.BadRequestException(`Subscription limits exceeded: ${limitsCheck.warnings.join(', ')}`);
            }
            const serviceIds = createBookingDto.services.map(s => s.serviceId);
            let services = [];
            try {
                services = await this.getServicesDetails(serviceIds);
                console.log(`✅ Fetched ${services.length} services`);
            }
            catch (error) {
                console.error(`❌ Service fetch error: ${error.message}`);
                throw new common_1.BadRequestException(`Failed to fetch service details: ${error.message}`);
            }
            if (!services || services.length === 0) {
                throw new common_1.BadRequestException('No services found for the provided service IDs');
            }
            const bufferTimeMap = new Map();
            createBookingDto.services.forEach(s => {
                bufferTimeMap.set(s.serviceId, s.bufferTime || 0);
            });
            const totalDuration = this.calculateTotalDuration(services);
            const totalBufferTime = this.calculateTotalBufferTime(createBookingDto.services);
            const totalDurationWithBuffer = totalDuration + totalBufferTime;
            console.log(`⏱️ Duration: ${totalDuration}min, Buffer: ${totalBufferTime}min, Total: ${totalDurationWithBuffer}min`);
            const estimatedEndTime = this.addMinutesToTime(createBookingDto.preferredStartTime, totalDurationWithBuffer);
            console.log(`🔍 Checking availability for ${dateString} at ${createBookingDto.preferredStartTime}`);
            const fullyBookedCheck = await this.availabilityService.isFullyBooked({
                businessId: createBookingDto.businessId,
                date: dateString,
                startTime: createBookingDto.preferredStartTime,
                duration: totalDuration,
                bufferTime: totalBufferTime
            });
            console.log(`📊 Availability check result:`, fullyBookedCheck);
            if (fullyBookedCheck.isFullyBooked) {
                const availableSlots = await this.availabilityService.getAvailableSlots({
                    businessId: createBookingDto.businessId,
                    serviceIds: serviceIds,
                    date: dateString,
                    bookingType: 'sequential'
                });
                return {
                    bookingId: '',
                    bookingNumber: '',
                    estimatedTotal: this.calculateTotalPrice(services),
                    expiresAt: new Date(),
                    status: 'fully_booked',
                    clientId: createBookingDto.clientId,
                    businessId: createBookingDto.businessId,
                    booking: null,
                    availableSlots,
                    message: fullyBookedCheck.message + '. Please choose from alternative slots.'
                };
            }
            const mappedServices = services.map((service, index) => {
                const serviceIdStr = service._id.toString();
                const bufferTime = bufferTimeMap.get(serviceIdStr) || 0;
                return {
                    serviceId: service._id,
                    serviceName: service.basicDetails.serviceName,
                    duration: this.getServiceDurationInMinutes(service),
                    bufferTime: bufferTime,
                    price: service.pricingAndDuration.price.amount
                };
            });
            const bookingData = {
                clientId: createBookingDto.clientId,
                businessId: createBookingDto.businessId,
                preferredDate: preferredDate,
                preferredStartTime: createBookingDto.preferredStartTime,
                clientName: createBookingDto.clientName,
                clientEmail: createBookingDto.clientEmail,
                clientPhone: createBookingDto.clientPhone,
                specialRequests: createBookingDto.specialRequests,
                services: mappedServices,
                estimatedEndTime,
                totalDuration,
                totalBufferTime,
                estimatedTotal: this.calculateTotalPrice(services),
                status: 'pending',
                bookingSource: 'online',
                metadata: { platform: 'web' }
            };
            console.log(`💾 Creating booking with ${bookingData.services.length} services`);
            const booking = await this.bookingService.createBooking(bookingData);
            await this.notificationService.notifyStaffNewBooking(booking);
            this.eventEmitter.emit('booking.created', booking);
            console.log(`✅ Booking created: ${booking.bookingNumber}`);
            return {
                bookingId: booking._id.toString(),
                bookingNumber: booking.bookingNumber,
                estimatedTotal: booking.estimatedTotal,
                expiresAt: booking.expiresAt,
                status: booking.status,
                clientId: booking.clientId.toString(),
                businessId: booking.businessId.toString(),
                booking,
                message: 'Booking created successfully. Awaiting staff assignment and confirmation.',
                requiresPayment: true
            };
        }
        catch (error) {
            console.error(`❌ Booking creation failed: ${error.message}`);
            throw error;
        }
    }
    parseDate(date) {
        if (date instanceof Date) {
            return date;
        }
        const parsedDate = new Date(date + 'T00:00:00.000Z');
        if (isNaN(parsedDate.getTime())) {
            throw new common_1.BadRequestException(`Invalid date format: ${date}`);
        }
        return parsedDate;
    }
    formatDateForAvailability(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    async checkAvailabilityForAllServices(businessId, serviceIds, date, startTime, totalDuration) {
        return await this.availabilityService.checkSlotAvailability({
            businessId,
            serviceIds: serviceIds,
            date: this.formatDateForAvailability(date),
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
        const bookingDate = this.parseDate(booking.preferredDate);
        await this.notificationService.notifyPaymentFailed(payment._id.toString(), booking.clientId.toString(), booking.businessId.toString(), {
            clientName: booking.clientName,
            amount: booking.estimatedTotal,
            failureReason: errorMessage,
            serviceName: booking.services.map(s => s.serviceName).join(', '),
            appointmentDate: bookingDate.toDateString(),
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
        const bookingDate = this.parseDate(booking.preferredDate);
        await this.notificationService.notifySlotUnavailableRefund(booking._id.toString(), booking.clientId.toString(), booking.businessId.toString(), {
            clientName: booking.clientName,
            serviceName: booking.services.map(s => s.serviceName).join(', '),
            date: bookingDate.toDateString(),
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
    async handlePaymentAndComplete(bookingId, transactionReference, paymentData) {
        try {
            console.log('💳 Processing payment...');
            console.log('  - Booking ID:', bookingId);
            console.log('  - Transaction Reference:', transactionReference);
            console.log('  - Amount:', paymentData.amount);
            console.log('  - Method:', paymentData.method);
            console.log('  - Gateway:', paymentData.gateway);
            const booking = await this.bookingService.getBookingById(bookingId);
            if (!booking) {
                throw new common_1.NotFoundException('Booking not found');
            }
            const allowedStatuses = ['pending', 'payment_failed'];
            if (!allowedStatuses.includes(booking.status)) {
                throw new common_1.BadRequestException(`Cannot process payment for booking with status '${booking.status}'. ` +
                    `Payment can only be processed for bookings with status 'pending' or 'payment_failed'.`);
            }
            if (booking.status === 'payment_failed') {
                console.log('🔄 This is a payment retry - resetting booking status to pending');
                await this.bookingService.updateBookingStatus(bookingId, 'pending');
            }
            if (paymentData.amount !== booking.estimatedTotal) {
                throw new common_1.BadRequestException(`Payment amount (${paymentData.amount}) does not match booking total (${booking.estimatedTotal})`);
            }
            const bookingDate = this.parseDate(booking.preferredDate);
            const isStillAvailable = await this.checkAvailabilityForAllServices(booking.businessId.toString(), booking.services.map(s => s.serviceId.toString()), bookingDate, booking.preferredStartTime, booking.totalDuration);
            if (!isStillAvailable) {
                console.warn('⚠️ Time slot is no longer available');
                await this.handleUnavailableSlot(booking, transactionReference);
                throw new common_1.BadRequestException('Time slot is no longer available. Payment will be refunded.');
            }
            console.log('📅 Creating appointment from booking (without staff assignment)...');
            const appointmentResult = await this.confirmBookingWithoutStaff(bookingId);
            if (!appointmentResult || !appointmentResult.appointment) {
                throw new Error('Failed to create appointment from booking');
            }
            console.log('✅ Appointment created:', appointmentResult.appointmentNumber);
            console.log('💾 Creating payment record...');
            const payment = await this.paymentService.createPaymentFromBooking(booking, transactionReference, {
                paymentMethod: paymentData.method,
                gateway: paymentData.gateway,
                status: 'completed'
            });
            console.log('✅ Updating payment status...');
            await this.paymentService.updatePaymentStatus(payment._id.toString(), 'completed', transactionReference);
            await this.bookingService.linkAppointment(bookingId, appointmentResult.appointment._id.toString());
            const appointmentDate = this.parseDate(booking.preferredDate);
            console.log('📧 Preparing to send payment confirmation notification');
            console.log('Notification data:', {
                clientName: booking.clientName,
                appointmentDate: appointmentDate.toDateString(),
                amount: paymentData.amount
            });
            try {
                await this.notificationService.notifyPaymentConfirmation(payment._id.toString(), paymentData.clientId, paymentData.businessId, {
                    clientName: booking.clientName,
                    amount: paymentData.amount,
                    method: paymentData.method,
                    gateway: paymentData.gateway,
                    transactionId: transactionReference,
                    serviceName: booking.services.map(s => s.serviceName).join(', '),
                    appointmentDate: appointmentDate.toDateString(),
                    businessName: booking.businessName,
                    receiptUrl: `${process.env.APP_URL}/receipts/${payment._id}`,
                    clientEmail: booking.clientEmail,
                    clientPhone: booking.clientPhone
                });
                console.log('✅ Payment confirmation notification sent');
            }
            catch (notificationError) {
                console.warn('⚠️ Notification failed (continuing):', notificationError.message);
            }
            this.eventEmitter.emit('payment.completed', {
                payment,
                booking,
                appointment: appointmentResult.appointment
            });
            console.log('✅ PAYMENT PROCESSING COMPLETE');
            return {
                paymentId: payment._id.toString(),
                success: true,
                message: booking.status === 'payment_failed'
                    ? 'Payment retry successful! Your appointment has been confirmed. Staff will be assigned shortly.'
                    : 'Payment successful! Your appointment has been confirmed. Staff will be assigned shortly.',
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
            console.error('❌ Payment processing failed:', error.message);
            try {
                await this.handlePaymentFailure(bookingId, transactionReference, error.message);
            }
            catch (failureError) {
                console.error('❌ Failed to handle payment failure:', failureError.message);
            }
            throw error;
        }
    }
    async resetBookingForPaymentRetry(bookingId) {
        const booking = await this.bookingService.getBookingById(bookingId);
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== 'payment_failed') {
            throw new common_1.BadRequestException(`Cannot reset booking. Only bookings with 'payment_failed' status can be reset. Current status: ${booking.status}`);
        }
        if (booking.expiresAt && new Date() > new Date(booking.expiresAt)) {
            throw new common_1.BadRequestException('Booking has expired. Please create a new booking.');
        }
        await this.bookingService.updateBookingStatus(bookingId, 'pending');
        console.log(`✅ Booking ${booking.bookingNumber} reset to pending for payment retry`);
    }
    async confirmBookingWithoutStaff(bookingId) {
        var _a;
        console.log('=== ORCHESTRATOR: CONFIRM BOOKING WITHOUT STAFF ===');
        console.log('BookingId:', bookingId);
        try {
            const booking = await this.bookingService.getBookingById(bookingId);
            console.log('✅ Booking found:', booking.bookingNumber);
            console.log('Current status:', booking.status);
            const allowedStatuses = ['pending', 'payment_failed'];
            if (!allowedStatuses.includes(booking.status)) {
                throw new common_1.BadRequestException(`Cannot confirm booking. Current status is '${booking.status}'. Only 'pending' or 'payment_failed' bookings can be confirmed. ` +
                    `This booking may have already been confirmed or expired.`);
            }
            console.log('📝 Updating booking status to confirmed...');
            await this.bookingService.updateBookingStatus(bookingId, 'confirmed');
            console.log('✅ Booking status updated to confirmed');
            console.log('📅 Creating appointment from booking...');
            const appointment = await this.appointmentService.createFromBooking(booking);
            if (!appointment) {
                throw new Error('Failed to create appointment');
            }
            console.log('✅ Appointment created:', appointment.appointmentNumber);
            console.log('Appointment details:', {
                id: appointment._id,
                number: appointment.appointmentNumber,
                date: appointment.selectedDate || appointment.scheduledDate,
                time: appointment.selectedTime || appointment.scheduledTime
            });
            console.log('📧 Sending confirmation notifications');
            try {
                await this.sendClientConfirmationOnly(booking, appointment);
                console.log('✅ Client notification sent successfully');
            }
            catch (notificationError) {
                console.warn('⚠️ Notification sending failed (continuing):', notificationError.message);
            }
            console.log('📡 Emitting booking events');
            this.eventEmitter.emit('booking.confirmed', {
                booking,
                appointment,
                staffAssigned: false
            });
            this.eventEmitter.emit('appointment.created', {
                appointment,
                booking,
                staffAssigned: false
            });
            console.log('✅ BOOKING CONFIRMATION COMPLETE (Staff assignment pending)');
            return {
                appointmentId: appointment._id.toString(),
                appointmentNumber: appointment.appointmentNumber,
                scheduledDate: appointment.selectedDate || appointment.scheduledDate || booking.preferredDate,
                scheduledTime: appointment.selectedTime || appointment.scheduledTime || booking.preferredStartTime,
                status: appointment.status,
                clientId: appointment.clientId.toString(),
                businessId: ((_a = appointment.businessInfo) === null || _a === void 0 ? void 0 : _a.businessId) || booking.businessId.toString(),
                booking: booking,
                message: 'Booking confirmed successfully. Staff will be assigned shortly.',
                appointment,
                assignment: null,
                assignments: []
            };
        }
        catch (error) {
            console.error('❌ BOOKING CONFIRMATION FAILED:', error.message);
            console.error('Stack:', error.stack);
            throw error;
        }
    }
    async sendClientConfirmationOnly(booking, appointment) {
        const bookingDate = this.parseDate(booking.preferredDate);
        await this.notificationService.notifyBookingConfirmation(booking._id.toString(), booking.clientId.toString(), booking.businessId.toString(), {
            clientName: booking.clientName,
            serviceName: booking.services.map(s => s.serviceName).join(', '),
            date: bookingDate.toDateString(),
            time: booking.preferredStartTime,
            businessName: booking.businessName,
            businessAddress: booking.businessAddress || 'N/A',
            appointmentNumber: appointment.appointmentNumber,
            clientEmail: booking.clientEmail,
            clientPhone: booking.clientPhone,
            staffCount: 0
        });
    }
    async confirmBookingAndCreateAppointment(bookingId, staffId, staffAssignments) {
        console.log('=== ORCHESTRATOR: CONFIRM BOOKING START ===');
        console.log('BookingId:', bookingId);
        console.log('Single StaffId:', staffId);
        console.log('Staff Assignments:', (staffAssignments === null || staffAssignments === void 0 ? void 0 : staffAssignments.length) || 0);
        if (!staffId && (!staffAssignments || staffAssignments.length === 0)) {
            console.log('⚠️ No staff provided - using confirmation without staff assignment');
            return await this.confirmBookingWithoutStaff(bookingId);
        }
        try {
            const booking = await this.bookingService.getBookingById(bookingId);
            console.log('✅ Booking found:', booking.bookingNumber);
            console.log('Current status:', booking.status);
            if (booking.status !== 'pending') {
                throw new common_1.BadRequestException(`Cannot confirm booking. Current status is '${booking.status}'. Only 'pending' bookings can be confirmed. ` +
                    `This booking may have already been confirmed or expired.`);
            }
            const bookingDate = this.parseDate(booking.preferredDate);
            const dateString = this.formatDateForAvailability(bookingDate);
            let staffToValidate = [];
            if (staffAssignments && staffAssignments.length > 0) {
                staffToValidate = staffAssignments.map(a => ({
                    staffId: a.staffId,
                    serviceId: a.serviceId
                }));
            }
            else if (staffId) {
                staffToValidate = booking.services.map(s => ({
                    staffId: staffId,
                    serviceId: s.serviceId.toString()
                }));
            }
            console.log(`🔍 Validating ${staffToValidate.length} staff assignments`);
            const unavailableStaff = [];
            for (const assignment of staffToValidate) {
                const service = booking.services.find(s => s.serviceId.toString() === assignment.serviceId);
                if (!service) {
                    throw new common_1.BadRequestException(`Service ${assignment.serviceId} not found in booking`);
                }
                const duration = service.duration + (service.bufferTime || 0);
                const endTime = this.addMinutesToTime(booking.preferredStartTime, duration);
                const isAvailable = await this.availabilityService.checkSlotAvailability({
                    businessId: booking.businessId.toString(),
                    serviceId: assignment.serviceId,
                    date: dateString,
                    startTime: booking.preferredStartTime,
                    duration: duration
                });
                if (!isAvailable) {
                    unavailableStaff.push({
                        staffId: assignment.staffId,
                        serviceName: service.serviceName,
                        reason: `Not available on ${dateString} from ${booking.preferredStartTime} to ${endTime}`
                    });
                    console.warn(`⚠️ Staff ${assignment.staffId} NOT available for service ${service.serviceName}`);
                }
                else {
                    console.log(`✅ Staff ${assignment.staffId} available for service ${assignment.serviceId}`);
                }
            }
            if (unavailableStaff.length > 0) {
                const errorDetails = unavailableStaff
                    .map(s => `${s.staffId}: ${s.serviceName} (${s.reason})`)
                    .join('; ');
                throw new common_1.BadRequestException(`The following staff members are not available for the requested time slot: ${errorDetails}. ` +
                    `Please try different staff or time slots.`);
            }
            console.log('📝 Updating booking status to confirmed...');
            await this.bookingService.updateBookingStatus(bookingId, 'confirmed', staffId);
            console.log('✅ Booking status updated to confirmed');
            console.log('📅 Creating appointment from booking...');
            const appointment = await this.appointmentService.createFromBooking(booking);
            console.log('✅ Appointment created:', appointment.appointmentNumber);
            let staffAssignmentResults = [];
            if (staffAssignments && staffAssignments.length > 0) {
                console.log(`📋 Creating ${staffAssignments.length} staff assignments`);
                for (const assignment of staffAssignments) {
                    try {
                        const service = booking.services.find(s => s.serviceId.toString() === assignment.serviceId);
                        if (!service) {
                            console.warn(`⚠️ Service ${assignment.serviceId} not found`);
                            continue;
                        }
                        const duration = service.duration;
                        const endTime = this.addMinutesToTime(booking.preferredStartTime, duration);
                        console.log(`📌 Assigning staff ${assignment.staffId} to service ${service.serviceName}`);
                        console.log(`   Time: ${booking.preferredStartTime} - ${endTime} (${duration} mins)`);
                        const result = await this.staffService.assignStaffToAppointment({
                            staffId: assignment.staffId,
                            businessId: booking.businessId.toString(),
                            appointmentId: appointment._id.toString(),
                            clientId: booking.clientId.toString(),
                            assignmentDate: bookingDate,
                            assignmentDetails: {
                                startTime: booking.preferredStartTime,
                                endTime: endTime,
                                assignmentType: 'primary',
                                estimatedDuration: duration,
                                serviceId: assignment.serviceId,
                                serviceName: service.serviceName,
                                specialInstructions: booking.specialRequests || '',
                                roomNumber: '',
                                requiredEquipment: [],
                                clientPreferences: '',
                                setupTimeMinutes: 0,
                                cleanupTimeMinutes: 0
                            },
                            assignedBy: staffId || assignment.staffId,
                            assignmentMethod: 'manual'
                        });
                        staffAssignmentResults.push(Object.assign({ staffId: assignment.staffId, serviceId: assignment.serviceId, staffName: assignment.staffName, status: 'assigned' }, result));
                        console.log(`✅ Successfully assigned staff ${assignment.staffId}`);
                    }
                    catch (error) {
                        console.error(`❌ Failed to assign staff ${assignment.staffId}:`, error.message);
                        staffAssignmentResults.push({
                            staffId: assignment.staffId,
                            serviceId: assignment.serviceId,
                            staffName: assignment.staffName,
                            error: error.message,
                            status: 'failed'
                        });
                    }
                }
            }
            else if (staffId) {
                console.log(`📋 Single staff assignment: ${staffId}`);
                try {
                    const result = await this.staffService.autoAssignStaff(booking.businessId.toString(), appointment._id.toString(), booking.clientId.toString(), booking.services[0].serviceId.toString(), bookingDate, booking.preferredStartTime, booking.estimatedEndTime);
                    staffAssignmentResults.push(result);
                    console.log(`✅ Single staff assignment completed`);
                }
                catch (error) {
                    console.error(`❌ Single staff assignment failed:`, error.message);
                    staffAssignmentResults.push({
                        staffId: staffId,
                        error: error.message,
                        status: 'failed'
                    });
                }
            }
            console.log('📧 Sending confirmation notifications');
            try {
                await this.sendConfirmationNotifications(booking, appointment, staffAssignmentResults);
                console.log('✅ Notifications sent successfully');
            }
            catch (notificationError) {
                console.warn('⚠️ Notification sending failed (continuing):', notificationError.message);
            }
            console.log('📡 Emitting booking events');
            this.eventEmitter.emit('booking.confirmed', {
                booking,
                staffId,
                staffAssignments: staffAssignmentResults,
                appointment
            });
            this.eventEmitter.emit('appointment.created', {
                appointment,
                booking,
                staffAssignments: staffAssignmentResults
            });
            console.log('✅ BOOKING CONFIRMATION COMPLETE');
            return {
                appointmentId: appointment._id.toString(),
                appointmentNumber: appointment.appointmentNumber,
                scheduledDate: appointment.selectedDate,
                scheduledTime: appointment.selectedTime,
                status: appointment.status,
                clientId: appointment.clientId.toString(),
                businessId: appointment.businessInfo.businessId,
                booking: booking,
                message: `Booking confirmed with ${staffAssignmentResults.filter(s => s.status === 'assigned').length} staff member(s) assigned`,
                appointment,
                assignment: staffAssignmentResults.length === 1 ? staffAssignmentResults[0] : null,
                assignments: staffAssignmentResults
            };
        }
        catch (error) {
            console.error('❌ BOOKING CONFIRMATION FAILED:', error.message);
            console.error('Stack:', error.stack);
            throw error;
        }
    }
    async setupDefaultStaffAvailability(businessId, staffId, createdBy) {
        console.log(`🌐 Setting up 24/7 availability for staff ${staffId}`);
        try {
            const today = new Date();
            const endDate = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);
            await this.availabilityService.setupStaffAvailability24x7(businessId, staffId, today, endDate, createdBy);
            console.log(`✅ Successfully setup 24/7 availability for staff`);
        }
        catch (error) {
            console.error(`❌ Failed to setup staff availability:`, error.message);
            throw error;
        }
    }
    async validateAndReportStaffAvailability(staffAssignments, booking, availabilityService) {
        const errors = [];
        for (const assignment of staffAssignments) {
            const service = booking.services.find(s => s.serviceId.toString() === assignment.serviceId);
            if (!service) {
                errors.push(`Service not found: ${assignment.serviceId}`);
                continue;
            }
            const duration = service.duration + (service.bufferTime || 0);
            const endTime = this.addMinutesToTime(booking.preferredStartTime, duration);
            const dateString = this.formatDateForAvailability(this.parseDate(booking.preferredDate));
            const isAvailable = await availabilityService.checkSlotAvailability({
                businessId: booking.businessId.toString(),
                serviceId: assignment.serviceId,
                date: dateString,
                startTime: booking.preferredStartTime,
                duration: duration
            });
            if (!isAvailable) {
                errors.push(`${assignment.staffName || 'Staff'} (${assignment.staffId}) is not available for ${service.serviceName} ` +
                    `on ${booking.preferredDate} from ${booking.preferredStartTime} to ${endTime}`);
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
};
BookingOrchestrator = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [winston_1.Logger,
        booking_service_1.BookingService,
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