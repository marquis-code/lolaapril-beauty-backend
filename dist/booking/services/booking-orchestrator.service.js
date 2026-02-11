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
const business_service_1 = require("../../business/business.service");
const service_service_1 = require("../../service/service.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const cancellation_policy_service_1 = require("../../cancellation/services/cancellation-policy.service");
const no_show_management_service_1 = require("../../cancellation/services/no-show-management.service");
const subscription_service_1 = require("../../subscription/subscription.service");
const winston_1 = require("winston");
const nest_winston_1 = require("nest-winston");
const source_tracking_service_1 = require("../../commission/services/source-tracking.service");
const commission_calculator_service_1 = require("../../commission/services/commission-calculator.service");
const create_booking_with_source_dto_1 = require("../dto/create-booking-with-source.dto");
let BookingOrchestrator = class BookingOrchestrator {
    constructor(logger, bookingService, appointmentService, paymentService, availabilityService, notificationService, staffService, businessService, subscriptionService, serviceService, eventEmitter, cancellationPolicyService, noShowManagementService, sourceTrackingService, commissionCalculatorService) {
        this.logger = logger;
        this.bookingService = bookingService;
        this.appointmentService = appointmentService;
        this.paymentService = paymentService;
        this.availabilityService = availabilityService;
        this.notificationService = notificationService;
        this.staffService = staffService;
        this.businessService = businessService;
        this.subscriptionService = subscriptionService;
        this.serviceService = serviceService;
        this.eventEmitter = eventEmitter;
        this.cancellationPolicyService = cancellationPolicyService;
        this.noShowManagementService = noShowManagementService;
        this.sourceTrackingService = sourceTrackingService;
        this.commissionCalculatorService = commissionCalculatorService;
    }
    calculateTotalBufferTime(services) {
        return services.reduce((total, service) => {
            return total + (service.bufferTime || 0);
        }, 0);
    }
    normalizeBookingSource(dto) {
        if (dto.bookingSource) {
            return {
                sourceType: dto.bookingSource.sourceType || dto.sourceType || create_booking_with_source_dto_1.BookingSourceType.DIRECT_LINK,
                channel: dto.bookingSource.channel,
                referrer: dto.bookingSource.referrer,
                referrerUrl: dto.bookingSource.referrerUrl,
                trackingCode: dto.bookingSource.trackingCode,
                campaignId: dto.bookingSource.campaignId,
                affiliateId: dto.bookingSource.affiliateId,
                sourceIdentifier: dto.bookingSource.sourceIdentifier || dto.sourceIdentifier,
                referralCode: dto.bookingSource.referralCode || dto.referralCode,
                utmSource: dto.bookingSource.utmSource || dto.utmSource,
                utmMedium: dto.bookingSource.utmMedium || dto.utmMedium,
                utmCampaign: dto.bookingSource.utmCampaign || dto.utmCampaign,
                ipAddress: dto.bookingSource.ipAddress,
                userAgent: dto.bookingSource.userAgent,
                metadata: dto.bookingSource.metadata,
            };
        }
        return {
            sourceType: dto.sourceType || create_booking_with_source_dto_1.BookingSourceType.DIRECT_LINK,
            sourceIdentifier: dto.sourceIdentifier,
            referralCode: dto.referralCode,
            utmSource: dto.utmSource,
            utmMedium: dto.utmMedium,
            utmCampaign: dto.utmCampaign,
        };
    }
    transformBookingSourceToDto(bookingSource) {
        if (!bookingSource) {
            return {
                sourceType: create_booking_with_source_dto_1.BookingSourceType.DIRECT_LINK,
            };
        }
        const sourceType = bookingSource.sourceType
            ? (create_booking_with_source_dto_1.BookingSourceType[bookingSource.sourceType.toUpperCase()] || create_booking_with_source_dto_1.BookingSourceType.DIRECT_LINK)
            : create_booking_with_source_dto_1.BookingSourceType.DIRECT_LINK;
        return {
            sourceType,
            channel: bookingSource.channel,
            referrer: bookingSource.referrer,
            referrerUrl: bookingSource.referrerUrl,
            trackingCode: bookingSource.trackingCode,
            campaignId: bookingSource.campaignId,
            affiliateId: bookingSource.affiliateId,
            sourceIdentifier: bookingSource.sourceIdentifier,
            referralCode: bookingSource.referralCode,
            utmSource: bookingSource.utmSource,
            utmMedium: bookingSource.utmMedium,
            utmCampaign: bookingSource.utmCampaign,
            ipAddress: bookingSource.ipAddress,
            userAgent: bookingSource.userAgent,
            metadata: bookingSource.metadata,
        };
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
                        serviceName: assignedService?.serviceName || 'Service',
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
            const preferredDate = this.parseDate(createBookingDto.preferredDate);
            const limitsCheck = await this.subscriptionService.checkLimits(createBookingDto.businessId, 'booking');
            if (!limitsCheck.isValid) {
                throw new common_1.BadRequestException(`Subscription limits exceeded`);
            }
            const serviceIds = createBookingDto.services.map(s => s.serviceId);
            const services = await this.serviceService.getServicesByIds(serviceIds);
            const totalAmount = this.calculateTotalPrice(services);
            const normalizedBookingSource = this.normalizeBookingSource(createBookingDto);
            console.log('📊 Normalized booking source:', {
                sourceType: normalizedBookingSource.sourceType,
                trackingCode: normalizedBookingSource.trackingCode,
                hasLegacyFields: !!(createBookingDto.sourceType || createBookingDto.utmSource),
            });
            const sourceValidation = this.sourceTrackingService.validateSourceData(normalizedBookingSource);
            if (!sourceValidation.isValid) {
                throw new common_1.BadRequestException(`Invalid source tracking data: ${sourceValidation.errors.join(', ')}`);
            }
            const clientReliability = await this.noShowManagementService
                .shouldRequireDeposit(createBookingDto.clientId, createBookingDto.businessId);
            const depositPolicy = await this.cancellationPolicyService
                .calculateDepositAmount(createBookingDto.businessId, totalAmount, serviceIds);
            const requiresDeposit = depositPolicy.requiresDeposit ||
                clientReliability.requiresDeposit;
            const depositAmount = requiresDeposit ? depositPolicy.depositAmount : 0;
            const depositReason = clientReliability.requiresDeposit
                ? clientReliability.reason
                : depositPolicy.reason;
            const commissionPreview = await this.commissionCalculatorService
                .calculateCommission('preview', {
                businessId: createBookingDto.businessId,
                clientId: createBookingDto.clientId,
                totalAmount,
                sourceTracking: normalizedBookingSource
            });
            const totalDuration = this.calculateTotalDuration(services);
            console.log(`[v0] Checking availability for business ${createBookingDto.businessId}`);
            console.log(`[v0] Date: ${preferredDate.toISOString()}, Time: ${createBookingDto.preferredStartTime}, Duration: ${totalDuration}min`);
            const isAvailable = await this.checkAvailabilityForAllServices(createBookingDto.businessId, serviceIds, preferredDate, createBookingDto.preferredStartTime, totalDuration);
            if (!isAvailable) {
                console.error(`[v0] Availability check failed for business ${createBookingDto.businessId}`);
                throw new common_1.BadRequestException('Selected time slot is not available');
            }
            console.log(`[v0] ✅ Time slot is available, proceeding with booking`);
            const bookingData = {
                clientId: createBookingDto.clientId,
                businessId: createBookingDto.businessId,
                preferredDate,
                preferredStartTime: createBookingDto.preferredStartTime,
                clientName: createBookingDto.clientName,
                clientEmail: createBookingDto.clientEmail,
                clientPhone: createBookingDto.clientPhone,
                specialRequests: createBookingDto.specialRequests,
                services: services.map((service, index) => ({
                    serviceId: service._id,
                    serviceName: service.basicDetails.serviceName,
                    duration: this.getServiceDurationInMinutes(service),
                    bufferTime: createBookingDto.services[index].bufferTime || 0,
                    price: service.pricingAndDuration.price.amount
                })),
                estimatedEndTime: this.addMinutesToTime(createBookingDto.preferredStartTime, totalDuration),
                totalDuration,
                estimatedTotal: totalAmount,
                status: 'pending',
                bookingSource: normalizedBookingSource,
                requiresDeposit,
                depositAmount,
                depositReason,
                remainingAmount: requiresDeposit ? totalAmount - depositAmount : totalAmount,
                commissionPreview: commissionPreview.isCommissionable ? {
                    rate: commissionPreview.commissionRate,
                    amount: commissionPreview.commissionAmount,
                    reason: commissionPreview.reason
                } : null,
                clientReliabilityScore: clientReliability.score
            };
            const booking = await this.bookingService.createBooking(bookingData);
            if (normalizedBookingSource.trackingCode) {
                await this.sourceTrackingService.recordConversion(normalizedBookingSource.trackingCode);
            }
            await this.notificationService.notifyStaffNewBooking(booking);
            this.eventEmitter.emit('booking.created', {
                businessId: booking.businessId.toString(),
                booking
            });
            return {
                bookingId: booking._id.toString(),
                bookingNumber: booking.bookingNumber,
                estimatedTotal: booking.estimatedTotal,
                expiresAt: booking.expiresAt,
                status: booking.status,
                clientId: booking.clientId.toString(),
                businessId: booking.businessId.toString(),
                booking,
                requiresDeposit,
                depositAmount,
                depositReason,
                remainingAmount: bookingData.remainingAmount,
                commissionInfo: commissionPreview.isCommissionable ? {
                    willBeCharged: true,
                    rate: commissionPreview.commissionRate,
                    amount: commissionPreview.commissionAmount,
                    reason: commissionPreview.reason,
                    businessPayout: commissionPreview.businessPayout
                } : {
                    willBeCharged: false,
                    reason: commissionPreview.reason,
                    businessPayout: totalAmount
                },
                clientReliability: {
                    score: clientReliability.score,
                    requiresDeposit: clientReliability.requiresDeposit,
                    reason: clientReliability.reason
                },
                message: requiresDeposit
                    ? `Booking created. Deposit of ₦${depositAmount} required to confirm.`
                    : 'Booking created successfully. Awaiting confirmation.'
            };
        }
        catch (error) {
            this.logger.error(`Booking creation failed: ${error.message}`);
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
        const isWithinBusinessHours = await this.checkBusinessWorkingHours(businessId, date, startTime, totalDuration);
        if (!isWithinBusinessHours) {
            console.log('❌ Time slot outside business hours');
            return false;
        }
        const hasConflict = await this.checkForConflictingBookings(businessId, date, startTime, totalDuration);
        if (hasConflict) {
            console.log('❌ Time slot already booked');
            return false;
        }
        console.log('✅ Time slot is available');
        return true;
    }
    async checkBusinessWorkingHours(businessId, date, startTime, totalDuration) {
        try {
            const business = await this.businessService.getById(businessId);
            if (!business) {
                throw new common_1.BadRequestException('Business not found');
            }
            const dayOfWeek = date.getDay();
            const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const currentDay = dayNames[dayOfWeek];
            const businessHours = business.businessHours;
            if (!businessHours || businessHours.length === 0) {
                console.log(`⚠️  No business hours configured - allowing booking (assuming 24/7 operation)`);
                return true;
            }
            const daySchedule = businessHours.find(schedule => schedule.day.toLowerCase() === currentDay);
            if (!daySchedule) {
                console.log(`⚠️  No schedule found for ${currentDay} - allowing booking`);
                return true;
            }
            if (!daySchedule.isOpen) {
                console.log(`❌ Business marked as closed on ${currentDay}`);
                return false;
            }
            const [openHour, openMin] = (daySchedule.openTime || '09:00').split(':').map(Number);
            const [closeHour, closeMin] = (daySchedule.closeTime || '17:00').split(':').map(Number);
            const [reqHour, reqMin] = startTime.split(':').map(Number);
            const openingMins = openHour * 60 + openMin;
            const closingMins = closeHour * 60 + closeMin;
            const requestStartMins = reqHour * 60 + reqMin;
            const requestEndMins = requestStartMins + totalDuration;
            console.log(`⏰ Business hours: ${openHour}:${openMin.toString().padStart(2, '0')} - ${closeHour}:${closeMin.toString().padStart(2, '0')}`);
            console.log(`📅 Requested slot: ${reqHour}:${reqMin.toString().padStart(2, '0')} - ${Math.floor(requestEndMins / 60)}:${(requestEndMins % 60).toString().padStart(2, '0')}`);
            const isWithinHours = requestStartMins >= openingMins && requestEndMins <= closingMins;
            if (!isWithinHours) {
                console.log(`❌ Requested time slot is outside business hours`);
                return false;
            }
            console.log(`✅ Time slot is available within business hours`);
            return true;
        }
        catch (error) {
            console.error(`❌ Error checking business hours: ${error.message}`);
            return false;
        }
    }
    async checkForConflictingBookings(businessId, date, startTime, totalDuration) {
        try {
            const [reqHour, reqMin] = startTime.split(':').map(Number);
            const requestStartMins = reqHour * 60 + reqMin;
            const requestEndMins = requestStartMins + totalDuration;
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            console.log(`🔍 Checking for conflicts on ${date.toISOString().split('T')[0]} from ${startTime} (${totalDuration} mins)`);
            const result = await this.bookingService.getBookings({
                businessId,
                startDate: startOfDay,
                endDate: endOfDay,
                status: ['pending', 'confirmed', 'payment_pending', 'paid']
            });
            const existingBookings = result.bookings;
            if (!existingBookings || existingBookings.length === 0) {
                console.log(`✅ No existing bookings found for this date`);
                return false;
            }
            console.log(`📋 Found ${existingBookings.length} existing booking(s) on this date`);
            for (const booking of existingBookings) {
                const existingStart = booking.preferredStartTime;
                const existingDuration = booking.totalDuration || 60;
                const [existingHour, existingMin] = existingStart.split(':').map(Number);
                const existingStartMins = existingHour * 60 + existingMin;
                const existingEndMins = existingStartMins + existingDuration;
                console.log(`  📌 Existing booking ${booking.bookingNumber}: ${existingStart} - ${Math.floor(existingEndMins / 60)}:${(existingEndMins % 60).toString().padStart(2, '0')}`);
                const hasOverlap = (requestStartMins < existingEndMins) && (requestEndMins > existingStartMins);
                if (hasOverlap) {
                    console.log(`  ❌ CONFLICT DETECTED with booking ${booking.bookingNumber}`);
                    return true;
                }
            }
            console.log(`✅ No time conflicts found`);
            return false;
        }
        catch (error) {
            console.error(`❌ Error checking for conflicting bookings: ${error.message}`);
            return true;
        }
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
        await this.paymentService.initiateRefund(booking.businessId.toString(), transactionReference, booking.estimatedTotal);
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
            const booking = await this.bookingService.getBookingById(bookingId);
            if (!booking) {
                throw new common_1.NotFoundException('Booking not found');
            }
            const isDepositPayment = paymentData.paymentType === 'deposit';
            const isRemainingPayment = paymentData.paymentType === 'remaining';
            const bookingSourceDto = this.transformBookingSourceToDto(booking.bookingSource);
            if (isDepositPayment) {
                if (!booking.requiresDeposit) {
                    throw new common_1.BadRequestException('This booking does not require a deposit');
                }
                if (paymentData.amount !== booking.depositAmount) {
                    throw new common_1.BadRequestException(`Deposit amount must be ₦${booking.depositAmount}`);
                }
                await this.bookingService.updateBooking(bookingId, {
                    depositPaid: true,
                    depositTransactionId: transactionReference,
                    remainingAmount: booking.estimatedTotal - booking.depositAmount,
                    status: 'deposit_paid'
                });
                const payment = await this.paymentService.createPaymentFromBooking(booking, transactionReference, {
                    paymentMethod: paymentData.method,
                    gateway: paymentData.gateway,
                    status: 'completed',
                    amount: paymentData.amount,
                    paymentType: 'deposit'
                });
                return {
                    paymentId: payment._id.toString(),
                    success: true,
                    message: 'Deposit paid successfully. Please pay remaining amount before appointment.',
                    transactionReference,
                    amount: paymentData.amount,
                    method: paymentData.method,
                    gateway: paymentData.gateway,
                    status: 'deposit_completed',
                    payment,
                    appointment: null,
                    remainingAmount: booking.estimatedTotal - booking.depositAmount
                };
            }
            if (isRemainingPayment) {
                if (!booking.depositPaid) {
                    throw new common_1.BadRequestException('Deposit must be paid first');
                }
                if (paymentData.amount !== booking.remainingAmount) {
                    throw new common_1.BadRequestException(`Remaining amount must be ₦${booking.remainingAmount}`);
                }
            }
            const allowedStatuses = ['pending', 'payment_failed', 'deposit_paid'];
            if (!allowedStatuses.includes(booking.status)) {
                throw new common_1.BadRequestException(`Cannot process payment for booking with status '${booking.status}'. ` +
                    `Payment can only be processed for bookings with status 'pending', 'payment_failed', or 'deposit_paid'.`);
            }
            if (booking.status === 'payment_failed') {
                console.log('🔄 This is a payment retry - resetting booking status to pending');
                await this.bookingService.updateBookingStatus(bookingId, 'pending');
            }
            if (isRemainingPayment) {
                if (paymentData.amount !== booking.remainingAmount) {
                    throw new common_1.BadRequestException(`Payment amount (${paymentData.amount}) does not match remaining amount (${booking.remainingAmount})`);
                }
            }
            else if (!isDepositPayment && paymentData.amount !== booking.estimatedTotal) {
                throw new common_1.BadRequestException(`Payment amount (${paymentData.amount}) does not match booking total (${booking.estimatedTotal})`);
            }
            const bookingDate = this.parseDate(booking.preferredDate);
            const isStillAvailable = await this.checkAvailabilityForAllServices(booking.businessId.toString(), booking.services.map(s => s.serviceId.toString()), bookingDate, booking.preferredStartTime, booking.totalDuration);
            if (!isStillAvailable) {
                console.warn('⚠️ Time slot is no longer available');
                await this.handleUnavailableSlot(booking, transactionReference);
                throw new common_1.BadRequestException('Time slot is no longer available. Payment will be refunded.');
            }
            console.log('📅 Creating appointment from booking...');
            const appointmentResult = await this.confirmBookingWithoutStaff(bookingId);
            if (!appointmentResult || !appointmentResult.appointment) {
                throw new Error('Failed to create appointment from booking');
            }
            console.log('✅ Appointment created:', appointmentResult.appointmentNumber);
            const payment = await this.paymentService.createPaymentFromBooking(booking, transactionReference, {
                paymentMethod: paymentData.method,
                gateway: paymentData.gateway,
                status: 'completed',
                amount: paymentData.amount,
                paymentType: paymentData.paymentType || 'full'
            });
            const commissionCalculation = await this.commissionCalculatorService
                .calculateCommission(bookingId, {
                businessId: booking.businessId.toString(),
                clientId: booking.clientId.toString(),
                totalAmount: booking.estimatedTotal,
                sourceTracking: bookingSourceDto
            });
            if (commissionCalculation.isCommissionable) {
                await this.commissionCalculatorService.createCommissionRecord(bookingId, payment._id.toString(), {
                    businessId: booking.businessId.toString(),
                    clientId: booking.clientId.toString(),
                    totalAmount: booking.estimatedTotal,
                    sourceTracking: bookingSourceDto
                }, commissionCalculation);
            }
            await this.paymentService.updatePaymentStatus(payment._id.toString(), 'completed', transactionReference);
            await this.bookingService.linkAppointment(bookingId, appointmentResult.appointment._id.toString());
            const appointmentDate = this.parseDate(booking.preferredDate);
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
            }
            catch (notificationError) {
                console.warn('⚠️ Notification failed (continuing):', notificationError.message);
            }
            this.eventEmitter.emit('payment.completed', {
                payment,
                booking,
                appointment: appointmentResult.appointment
            });
            return {
                paymentId: payment._id.toString(),
                success: true,
                message: booking.status === 'payment_failed'
                    ? 'Payment retry successful! Your appointment has been confirmed.'
                    : 'Payment successful! Your appointment has been confirmed.',
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
                businessId: appointment.businessInfo?.businessId || booking.businessId.toString(),
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
        console.log('Staff Assignments:', staffAssignments?.length || 0);
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
                        staffAssignmentResults.push({
                            staffId: assignment.staffId,
                            serviceId: assignment.serviceId,
                            staffName: assignment.staffName,
                            status: 'assigned',
                            ...result
                        });
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
        business_service_1.BusinessService,
        subscription_service_1.SubscriptionService,
        service_service_1.ServiceService,
        event_emitter_1.EventEmitter2,
        cancellation_policy_service_1.CancellationPolicyService,
        no_show_management_service_1.NoShowManagementService,
        source_tracking_service_1.SourceTrackingService,
        commission_calculator_service_1.CommissionCalculatorService])
], BookingOrchestrator);
exports.BookingOrchestrator = BookingOrchestrator;
//# sourceMappingURL=booking-orchestrator.service.js.map