// // src/modules/booking/services/booking-orchestrator.service.ts
// import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common'
// import { BookingService } from './booking.service'
// import { AppointmentService } from '../../appointment/appointment.service'
// import { PaymentService } from '../../payment/payment.service'
// import { AvailabilityService } from '../../availability/availability.service'
// import { NotificationService } from '../../notification/notification.service'
// import { StaffService } from '../../staff/staff.service'
// import { BusinessService } from '../../business/business.service' 
// import { ServiceService } from '../../service/service.service'
// import { EventEmitter2 } from '@nestjs/event-emitter'
// import { ServiceBookingDto } from "../dto/create-booking.dto"
// import { CancellationPolicyService } from '../../cancellation/services/cancellation-policy.service'
// import { NoShowManagementService } from '../../cancellation/services/no-show-management.service'
// import { SubscriptionService } from '../../subscription/subscription.service'
// import { AppointmentResult } from "../types/booking.types"
// import { Logger } from 'winston'
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
// import { SourceTrackingService } from '../../commission/services/source-tracking.service'
// import { CommissionCalculatorService } from '../../commission/services/commission-calculator.service'
// import { CreateBookingWithSourceDto } from '../dto/create-booking-with-source.dto'
// import { BookingSourceDto, BookingSourceType } from '../dto/create-booking-with-source.dto';
// import { Types } from 'mongoose'

// interface DepositCalculation {
//   requiresDeposit: boolean;
//   depositAmount: number;
//   reason: string;
//   percentage?: number;
// }

// interface BookingResult {
//   bookingId: string
//   bookingNumber: string
//   estimatedTotal: number
//   expiresAt: Date
//   status: string
//   clientId: string
//   businessId: string
//   booking: any
//   availableSlots?: any[]
//   message: string
//   requiresPayment?: boolean
//   requiresDeposit?: boolean
//   depositAmount?: number
//   depositReason?: string
//   remainingAmount?: number
//   commissionInfo?: any
//   clientReliability?: any
// }

// interface PaymentResult {
//   paymentId: string
//   success: boolean
//   message: string
//   transactionReference: string
//   amount: number
//   method: string
//   gateway: string
//   status: string
//   payment: any
//   appointment: any
//   remainingAmount?: number
// }


// @Injectable()
// export class BookingOrchestrator {

//   constructor(
//     @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
//     private readonly bookingService: BookingService,
//     private readonly appointmentService: AppointmentService,
//     private readonly paymentService: PaymentService,
//     private readonly availabilityService: AvailabilityService,
//     private readonly notificationService: NotificationService,
//     private readonly staffService: StaffService,
//     private readonly businessService: BusinessService, // ✅ CHANGED: tenantService -> businessService
//     private readonly subscriptionService: SubscriptionService, // ✅ ADDED for subscription checks
//     private readonly serviceService: ServiceService,
//     private readonly eventEmitter: EventEmitter2,
//     private readonly cancellationPolicyService: CancellationPolicyService,
//     private readonly noShowManagementService: NoShowManagementService,
//     private readonly sourceTrackingService: SourceTrackingService,
//     private readonly commissionCalculatorService: CommissionCalculatorService,
//   ) { }

//   // NEW HELPER METHOD: Calculate total buffer time
//   private calculateTotalBufferTime(services: ServiceBookingDto[]): number {
//     return services.reduce((total, service) => {
//       return total + (service.bufferTime || 0)
//     }, 0)
//   }

//   private normalizeBookingSource(dto: CreateBookingWithSourceDto): BookingSourceDto {
//     // If bookingSource exists, merge with any legacy fields
//     if (dto.bookingSource) {
//       return {
//         // Prioritize bookingSource.sourceType, fall back to legacy sourceType, default to DIRECT_LINK
//         sourceType: dto.bookingSource.sourceType || dto.sourceType || BookingSourceType.DIRECT_LINK,

//         // Merge other fields, prioritizing bookingSource values
//         channel: dto.bookingSource.channel,
//         referrer: dto.bookingSource.referrer,
//         referrerUrl: dto.bookingSource.referrerUrl,
//         trackingCode: dto.bookingSource.trackingCode,
//         campaignId: dto.bookingSource.campaignId,
//         affiliateId: dto.bookingSource.affiliateId,
//         sourceIdentifier: dto.bookingSource.sourceIdentifier || dto.sourceIdentifier,
//         referralCode: dto.bookingSource.referralCode || dto.referralCode,
//         utmSource: dto.bookingSource.utmSource || dto.utmSource,
//         utmMedium: dto.bookingSource.utmMedium || dto.utmMedium,
//         utmCampaign: dto.bookingSource.utmCampaign || dto.utmCampaign,
//         ipAddress: dto.bookingSource.ipAddress,
//         userAgent: dto.bookingSource.userAgent,
//         metadata: dto.bookingSource.metadata,
//       };
//     }

//     // If no bookingSource object, create one from legacy fields
//     return {
//       sourceType: dto.sourceType || BookingSourceType.DIRECT_LINK,
//       sourceIdentifier: dto.sourceIdentifier,
//       referralCode: dto.referralCode,
//       utmSource: dto.utmSource,
//       utmMedium: dto.utmMedium,
//       utmCampaign: dto.utmCampaign,
//     };
//   }

//   private transformBookingSourceToDto(bookingSource: any): BookingSourceDto {
//   if (!bookingSource) {
//     return {
//       sourceType: BookingSourceType.DIRECT_LINK,
//     };
//   }

//   // Convert string sourceType to enum
//   const sourceType = bookingSource.sourceType 
//     ? (BookingSourceType[bookingSource.sourceType.toUpperCase()] || BookingSourceType.DIRECT_LINK)
//     : BookingSourceType.DIRECT_LINK;

//   return {
//     sourceType,
//     channel: bookingSource.channel,
//     referrer: bookingSource.referrer,
//     referrerUrl: bookingSource.referrerUrl,
//     trackingCode: bookingSource.trackingCode,
//     campaignId: bookingSource.campaignId,
//     affiliateId: bookingSource.affiliateId,
//     sourceIdentifier: bookingSource.sourceIdentifier,
//     referralCode: bookingSource.referralCode,
//     utmSource: bookingSource.utmSource,
//     utmMedium: bookingSource.utmMedium,
//     utmCampaign: bookingSource.utmCampaign,
//     ipAddress: bookingSource.ipAddress,
//     userAgent: bookingSource.userAgent,
//     metadata: bookingSource.metadata,
//   };
// }


//   private async sendConfirmationNotifications(
//     booking: any,
//     appointment: any,
//     staffAssignments: any[]
//   ): Promise<void> {
//     const bookingDate = this.parseDate(booking.preferredDate)

//     // Notify client about booking confirmation
//     await this.notificationService.notifyBookingConfirmation(
//       booking._id.toString(),
//       booking.clientId.toString(),
//       booking.businessId.toString(),
//       {
//         clientName: booking.clientName,
//         serviceName: booking.services.map(s => s.serviceName).join(', '),
//         date: bookingDate.toDateString(),
//         time: booking.preferredStartTime,
//         businessName: booking.businessName,
//         businessAddress: booking.businessAddress || 'N/A',
//         appointmentNumber: appointment.appointmentNumber,
//         clientEmail: booking.clientEmail,
//         clientPhone: booking.clientPhone,
//         staffCount: staffAssignments.length
//       }
//     )

//     // Notify each assigned staff member
//     for (const assignment of staffAssignments) {
//       if (assignment.status === 'assigned' && assignment.staffId) {
//         try {
//           // Find the service this staff is assigned to
//           const assignedService = booking.services.find(
//             s => s.serviceId.toString() === assignment.serviceId
//           )

//           await this.notificationService.notifyStaffAssignment(
//             appointment._id.toString(),
//             assignment.staffId,
//             booking.businessId.toString(),
//             {
//               staffName: assignment.staffName || 'Staff Member',
//               clientName: booking.clientName,
//               serviceName: assignedService?.serviceName || 'Service',
//               date: bookingDate.toDateString(),
//               time: booking.preferredStartTime,
//               businessName: booking.businessName,
//               appointmentNumber: appointment.appointmentNumber,
//               staffEmail: assignment.email || 'staff@email.com',
//               staffPhone: assignment.phone || '+1234567890'
//             }
//           )

//           // this.logger.log(`✅ Notification sent to staff ${assignment.staffId}`)
//         } catch (error) {
//           this.logger.error(`Failed to notify staff ${assignment.staffId}: ${error.message}`)
//         }
//       }
//     }
//   }

//   // async createBookingWithValidation(
//   //   createBookingDto: CreateBookingWithSourceDto
//   // ): Promise<BookingResult> {
//   //   try {
//   //     const preferredDate = this.parseDate(createBookingDto.preferredDate);

//   //     const limitsCheck = await this.subscriptionService.checkLimits(
//   //       createBookingDto.businessId,
//   //       'booking'
//   //     );

//   //     if (!limitsCheck.isValid) {
//   //       throw new BadRequestException(`Subscription limits exceeded`);
//   //     }

//   //     const serviceIds = createBookingDto.services.map(s => s.serviceId);
//   //     const services = await this.serviceService.getServicesByIds(serviceIds);
//   //     const totalAmount = this.calculateTotalPrice(services);

//   //     // ✅ Normalize booking source to ensure sourceType is set
//   //     const normalizedBookingSource = this.normalizeBookingSource(createBookingDto);

//   //     console.log('📊 Normalized booking source:', {
//   //       sourceType: normalizedBookingSource.sourceType,
//   //       trackingCode: normalizedBookingSource.trackingCode,
//   //       hasLegacyFields: !!(createBookingDto.sourceType || createBookingDto.utmSource),
//   //     });

//   //     // Validate the normalized source data
//   //     const sourceValidation = this.sourceTrackingService.validateSourceData(
//   //       normalizedBookingSource
//   //     );

//   //     if (!sourceValidation.isValid) {
//   //       throw new BadRequestException(
//   //         `Invalid source tracking data: ${sourceValidation.errors.join(', ')}`
//   //       );
//   //     }

//   //     const clientReliability = await this.noShowManagementService
//   //       .shouldRequireDeposit(
//   //         createBookingDto.clientId,
//   //         createBookingDto.businessId
//   //       );

//   //     const depositPolicy = await this.cancellationPolicyService
//   //       .calculateDepositAmount(
//   //         createBookingDto.businessId,
//   //         totalAmount,
//   //         serviceIds
//   //       );

//   //     const requiresDeposit = depositPolicy.requiresDeposit ||
//   //       clientReliability.requiresDeposit;

//   //     const depositAmount = requiresDeposit ? depositPolicy.depositAmount : 0;
//   //     const depositReason = clientReliability.requiresDeposit
//   //       ? clientReliability.reason
//   //       : depositPolicy.reason;

//   //     // Calculate commission with normalized source
//   //     const commissionPreview = await this.commissionCalculatorService
//   //       .calculateCommission(
//   //         'preview',
//   //         {
//   //           businessId: createBookingDto.businessId,
//   //           clientId: createBookingDto.clientId,
//   //           totalAmount,
//   //           sourceTracking: normalizedBookingSource  // ✅ Use normalized source
//   //         }
//   //       );

//   //     const totalDuration = this.calculateTotalDuration(services);
//   //     const isAvailable = await this.checkAvailabilityForAllServices(
//   //       createBookingDto.businessId,
//   //       serviceIds,
//   //       preferredDate,
//   //       createBookingDto.preferredStartTime,
//   //       totalDuration
//   //     );

//   //     if (!isAvailable) {
//   //       throw new BadRequestException('Selected time slot is not available');
//   //     }

//   //     const bookingData = {
//   //       clientId: createBookingDto.clientId,
//   //       businessId: createBookingDto.businessId,
//   //       preferredDate,
//   //       preferredStartTime: createBookingDto.preferredStartTime,
//   //       clientName: createBookingDto.clientName,
//   //       clientEmail: createBookingDto.clientEmail,
//   //       clientPhone: createBookingDto.clientPhone,
//   //       specialRequests: createBookingDto.specialRequests,
//   //       services: services.map((service, index) => ({
//   //         serviceId: service._id,
//   //         serviceName: service.basicDetails.serviceName,
//   //         duration: this.getServiceDurationInMinutes(service),
//   //         bufferTime: createBookingDto.services[index].bufferTime || 0,
//   //         price: service.pricingAndDuration.price.amount
//   //       })),
//   //       estimatedEndTime: this.addMinutesToTime(
//   //         createBookingDto.preferredStartTime,
//   //         totalDuration
//   //       ),
//   //       totalDuration,
//   //       estimatedTotal: totalAmount,
//   //       status: 'pending',
//   //       bookingSource: normalizedBookingSource,  // ✅ Use normalized source
//   //       requiresDeposit,
//   //       depositAmount,
//   //       depositReason,
//   //       remainingAmount: requiresDeposit ? totalAmount - depositAmount : totalAmount,
//   //       commissionPreview: commissionPreview.isCommissionable ? {
//   //         rate: commissionPreview.commissionRate,
//   //         amount: commissionPreview.commissionAmount,
//   //         reason: commissionPreview.reason
//   //       } : null,
//   //       clientReliabilityScore: clientReliability.score
//   //     };

//   //     const booking = await this.bookingService.createBooking(bookingData);

//   //     // Track conversion if tracking code exists
//   //     if (normalizedBookingSource.trackingCode) {
//   //       await this.sourceTrackingService.recordConversion(
//   //         normalizedBookingSource.trackingCode
//   //       );
//   //     }

//   //     await this.notificationService.notifyStaffNewBooking(booking);
//   //     this.eventEmitter.emit('booking.created', booking);

//   //     return {
//   //       bookingId: booking._id.toString(),
//   //       bookingNumber: booking.bookingNumber,
//   //       estimatedTotal: booking.estimatedTotal,
//   //       expiresAt: booking.expiresAt,
//   //       status: booking.status,
//   //       clientId: booking.clientId.toString(),
//   //       businessId: booking.businessId.toString(),
//   //       booking,
//   //       requiresDeposit,
//   //       depositAmount,
//   //       depositReason,
//   //       remainingAmount: bookingData.remainingAmount,
//   //       commissionInfo: commissionPreview.isCommissionable ? {
//   //         willBeCharged: true,
//   //         rate: commissionPreview.commissionRate,
//   //         amount: commissionPreview.commissionAmount,
//   //         reason: commissionPreview.reason,
//   //         businessPayout: commissionPreview.businessPayout
//   //       } : {
//   //         willBeCharged: false,
//   //         reason: commissionPreview.reason,
//   //         businessPayout: totalAmount
//   //       },
//   //       clientReliability: {
//   //         score: clientReliability.score,
//   //         requiresDeposit: clientReliability.requiresDeposit,
//   //         reason: clientReliability.reason
//   //       },
//   //       message: requiresDeposit
//   //         ? `Booking created. Deposit of ₦${depositAmount} required to confirm.`
//   //         : 'Booking created successfully. Awaiting confirmation.'
//   //     };

//   //   } catch (error) {
//   //     this.logger.error(`Booking creation failed: ${error.message}`);
//   //     throw error;
//   //   }
//   // }

//     async createBookingWithValidation(
//       createBookingDto: CreateBookingWithSourceDto
//     ): Promise<BookingResult> {
//       try {
//         const preferredDate = this.parseDate(createBookingDto.preferredDate);

//         // ✅ CHANGED: Use subscriptionService to check limits
//         const limitsCheck = await this.subscriptionService.checkLimits(
//           createBookingDto.businessId,
//           'booking'
//         );

//         if (!limitsCheck.isValid) {
//           throw new BadRequestException(`Subscription limits exceeded`);
//         }

//         const serviceIds = createBookingDto.services.map(s => s.serviceId);
//         const services = await this.serviceService.getServicesByIds(serviceIds);
//         const totalAmount = this.calculateTotalPrice(services);

//         // ✅ Normalize booking source to ensure sourceType is set
//         const normalizedBookingSource = this.normalizeBookingSource(createBookingDto);

//         console.log('📊 Normalized booking source:', {
//           sourceType: normalizedBookingSource.sourceType,
//           trackingCode: normalizedBookingSource.trackingCode,
//           hasLegacyFields: !!(createBookingDto.sourceType || createBookingDto.utmSource),
//         });

//         // Validate the normalized source data
//         const sourceValidation = this.sourceTrackingService.validateSourceData(
//           normalizedBookingSource
//         );

//         if (!sourceValidation.isValid) {
//           throw new BadRequestException(
//             `Invalid source tracking data: ${sourceValidation.errors.join(', ')}`
//           );
//         }

//         const clientReliability = await this.noShowManagementService
//           .shouldRequireDeposit(
//             createBookingDto.clientId,
//             createBookingDto.businessId
//           );

//         const depositPolicy = await this.cancellationPolicyService
//           .calculateDepositAmount(
//             createBookingDto.businessId,
//             totalAmount,
//             serviceIds
//           );

//         const requiresDeposit = depositPolicy.requiresDeposit ||
//           clientReliability.requiresDeposit;

//         const depositAmount = requiresDeposit ? depositPolicy.depositAmount : 0;
//         const depositReason = clientReliability.requiresDeposit
//           ? clientReliability.reason
//           : depositPolicy.reason;

//         // Calculate commission with normalized source
//         const commissionPreview = await this.commissionCalculatorService
//           .calculateCommission(
//             'preview',
//             {
//               businessId: createBookingDto.businessId,
//               clientId: createBookingDto.clientId,
//               totalAmount,
//               sourceTracking: normalizedBookingSource  // ✅ Use normalized source
//             }
//           );

//         const totalDuration = this.calculateTotalDuration(services);
//         const isAvailable = await this.checkAvailabilityForAllServices(
//           createBookingDto.businessId,
//           serviceIds,
//           preferredDate,
//           createBookingDto.preferredStartTime,
//           totalDuration
//         );

//         if (!isAvailable) {
//           throw new BadRequestException('Selected time slot is not available');
//         }

//         const bookingData = {
//           clientId: createBookingDto.clientId,
//           businessId: createBookingDto.businessId,
//           preferredDate,
//           preferredStartTime: createBookingDto.preferredStartTime,
//           clientName: createBookingDto.clientName,
//           clientEmail: createBookingDto.clientEmail,
//           clientPhone: createBookingDto.clientPhone,
//           specialRequests: createBookingDto.specialRequests,
//           services: services.map((service, index) => ({
//             serviceId: service._id,
//             serviceName: service.basicDetails.serviceName,
//             duration: this.getServiceDurationInMinutes(service),
//             bufferTime: createBookingDto.services[index].bufferTime || 0,
//             price: service.pricingAndDuration.price.amount
//           })),
//           estimatedEndTime: this.addMinutesToTime(
//             createBookingDto.preferredStartTime,
//             totalDuration
//           ),
//           totalDuration,
//           estimatedTotal: totalAmount,
//           status: 'pending',
//           bookingSource: normalizedBookingSource,  // ✅ Use normalized source
//           requiresDeposit,
//           depositAmount,
//           depositReason,
//           remainingAmount: requiresDeposit ? totalAmount - depositAmount : totalAmount,
//           commissionPreview: commissionPreview.isCommissionable ? {
//             rate: commissionPreview.commissionRate,
//             amount: commissionPreview.commissionAmount,
//             reason: commissionPreview.reason
//           } : null,
//           clientReliabilityScore: clientReliability.score
//         };

//         const booking = await this.bookingService.createBooking(bookingData);

//         // Track conversion if tracking code exists
//         if (normalizedBookingSource.trackingCode) {
//           await this.sourceTrackingService.recordConversion(
//             normalizedBookingSource.trackingCode
//           );
//         }

//         await this.notificationService.notifyStaffNewBooking(booking);
//         this.eventEmitter.emit('booking.created', booking);

//         return {
//           bookingId: booking._id.toString(),
//           bookingNumber: booking.bookingNumber,
//           estimatedTotal: booking.estimatedTotal,
//           expiresAt: booking.expiresAt,
//           status: booking.status,
//           clientId: booking.clientId.toString(),
//           businessId: booking.businessId.toString(),
//           booking,
//           requiresDeposit,
//           depositAmount,
//           depositReason,
//           remainingAmount: bookingData.remainingAmount,
//           commissionInfo: commissionPreview.isCommissionable ? {
//             willBeCharged: true,
//             rate: commissionPreview.commissionRate,
//             amount: commissionPreview.commissionAmount,
//             reason: commissionPreview.reason,
//             businessPayout: commissionPreview.businessPayout
//           } : {
//             willBeCharged: false,
//             reason: commissionPreview.reason,
//             businessPayout: totalAmount
//           },
//           clientReliability: {
//             score: clientReliability.score,
//             requiresDeposit: clientReliability.requiresDeposit,
//             reason: clientReliability.reason
//           },
//           message: requiresDeposit
//             ? `Booking created. Deposit of ₦${depositAmount} required to confirm.`
//             : 'Booking created successfully. Awaiting confirmation.'
//         };

//       } catch (error) {
//         this.logger.error(`Booking creation failed: ${error.message}`);
//         throw error;
//       }
//     }


//   private parseDate(date: Date | string): Date {
//     if (date instanceof Date) {
//       return date
//     }
//     const parsedDate = new Date(date + 'T00:00:00.000Z')
//     if (isNaN(parsedDate.getTime())) {
//       throw new BadRequestException(`Invalid date format: ${date}`)
//     }
//     return parsedDate
//   }

//   private formatDateForAvailability(date: Date): string {
//     const year = date.getFullYear()
//     const month = String(date.getMonth() + 1).padStart(2, '0')
//     const day = String(date.getDate()).padStart(2, '0')
//     return `${year}-${month}-${day}`
//   }



//   private async checkAvailabilityForAllServices(
//     businessId: string,
//     serviceIds: string[],
//     date: Date,
//     startTime: string,
//     totalDuration: number
//   ): Promise<boolean> {
//     return await this.availabilityService.checkSlotAvailability({
//       businessId,
//       serviceIds: serviceIds, // ✅ FIXED: Pass array
//       date: this.formatDateForAvailability(date),
//       startTime,
//       duration: totalDuration // This will be calculated from serviceIds
//     })
//   }

//   private async handlePaymentFailure(
//     bookingId: string,
//     transactionReference: string,
//     errorMessage: string
//   ): Promise<void> {
//     // 1. Update booking status
//     await this.bookingService.updateBookingStatus(bookingId, 'payment_failed')

//     // 2. Create failed payment record
//     const booking = await this.bookingService.getBookingById(bookingId)

//     const payment = await this.paymentService.createFailedPayment({
//       bookingId,
//       transactionReference,
//       errorMessage,
//       clientId: booking.clientId.toString(),
//       businessId: booking.businessId.toString(),
//       amount: booking.estimatedTotal
//     })

//     // Parse booking date
//     const bookingDate = this.parseDate(booking.preferredDate)

//     // 3. Send failure notification
//     await this.notificationService.notifyPaymentFailed(
//       payment._id.toString(),
//       booking.clientId.toString(),
//       booking.businessId.toString(),
//       {
//         clientName: booking.clientName,
//         amount: booking.estimatedTotal,
//         failureReason: errorMessage,
//         serviceName: booking.services.map(s => s.serviceName).join(', '),
//         appointmentDate: bookingDate.toDateString(),
//         businessName: booking.businessName,
//         businessPhone: booking.businessPhone || 'N/A',
//         retryPaymentUrl: `${process.env.APP_URL}/retry-payment/${bookingId}`,
//         clientEmail: booking.clientEmail,
//         clientPhone: booking.clientPhone
//       }
//     )
//   }

//   private async handleUnavailableSlot(booking: any, transactionReference: string): Promise<void> {
//     // Update booking status
//     await this.bookingService.updateBookingStatus(booking._id.toString(), 'slot_unavailable')

//     // Initiate refund (integrate with your payment provider's refund API)
//     await this.paymentService.initiateRefund(transactionReference, booking.estimatedTotal)

//     // Parse booking date
//     const bookingDate = this.parseDate(booking.preferredDate)

//     // Notify client
//     await this.notificationService.notifySlotUnavailableRefund(
//       booking._id.toString(),
//       booking.clientId.toString(),
//       booking.businessId.toString(),
//       {
//         clientName: booking.clientName,
//         serviceName: booking.services.map(s => s.serviceName).join(', '),
//         date: bookingDate.toDateString(),
//         time: booking.preferredStartTime,
//         businessName: booking.businessName,
//         businessPhone: booking.businessPhone || 'N/A',
//         clientEmail: booking.clientEmail,
//         clientPhone: booking.clientPhone
//       }
//     )
//   }

//   private async getServicesDetails(serviceIds: string[]): Promise<any[]> {
//     return await this.serviceService.getServicesByIds(serviceIds)
//   }

//   private calculateTotalDuration(services: any[]): number {
//     return services.reduce((total, service) => {
//       const duration = service.pricingAndDuration.duration.servicingTime
//       const minutes = duration.unit === 'h' ? duration.value * 60 : duration.value
//       return total + minutes
//     }, 0)
//   }

//   private calculateTotalPrice(services: any[]): number {
//     return services.reduce((total, service) => {
//       return total + service.pricingAndDuration.price.amount
//     }, 0)
//   }

//   private getServiceDurationInMinutes(service: any): number {
//     const duration = service.pricingAndDuration.duration.servicingTime
//     return duration.unit === 'h' ? duration.value * 60 : duration.value
//   }

//   private addMinutesToTime(time: string, minutes: number): string {
//     const [hours, mins] = time.split(':').map(Number)
//     const totalMinutes = hours * 60 + mins + minutes
//     const newHours = Math.floor(totalMinutes / 60)
//     const newMins = totalMinutes % 60
//     return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
//   }

//   private getPreferredStaff(service: any): Types.ObjectId | undefined {
//     if (service.teamMembers.allTeamMembers) return undefined

//     const availableMembers = service.teamMembers.selectedMembers.filter(m => m.selected)
//     return availableMembers.length > 0 ? availableMembers[0].id : undefined
//   }

// async handlePaymentAndComplete(
//   bookingId: string,
//   transactionReference: string,
//   paymentData: {
//     amount: number
//     method: string
//     gateway: string
//     clientId: string
//     businessId: string,
//     paymentType?: 'full' | 'deposit' | 'remaining'
//   }
// ): Promise<PaymentResult> {
//   try {
//     const booking = await this.bookingService.getBookingById(bookingId)

//     if (!booking) {
//       throw new NotFoundException('Booking not found')
//     }

//     const isDepositPayment = paymentData.paymentType === 'deposit'
//     const isRemainingPayment = paymentData.paymentType === 'remaining'

//     // ✅ Transform booking source early for use in commission calculations
//     const bookingSourceDto = this.transformBookingSourceToDto(booking.bookingSource);

//     if (isDepositPayment) {
//       if (!booking.requiresDeposit) {
//         throw new BadRequestException('This booking does not require a deposit')
//       }

//       if (paymentData.amount !== booking.depositAmount) {
//         throw new BadRequestException(
//           `Deposit amount must be ₦${booking.depositAmount}`
//         )
//       }

//       await this.bookingService.updateBooking(bookingId, {
//         depositPaid: true,
//         depositTransactionId: transactionReference,
//         remainingAmount: booking.estimatedTotal - booking.depositAmount,
//         status: 'deposit_paid'
//       })

//       const payment = await this.paymentService.createPaymentFromBooking(
//         booking,
//         transactionReference,
//         {
//           paymentMethod: paymentData.method,
//           gateway: paymentData.gateway,
//           status: 'completed',
//           amount: paymentData.amount,
//           paymentType: 'deposit'
//         }
//       )

//       return {
//         paymentId: payment._id.toString(),
//         success: true,
//         message: 'Deposit paid successfully. Please pay remaining amount before appointment.',
//         transactionReference,
//         amount: paymentData.amount,
//         method: paymentData.method,
//         gateway: paymentData.gateway,
//         status: 'deposit_completed',
//         payment,
//         appointment: null,
//         remainingAmount: booking.estimatedTotal - booking.depositAmount
//       }
//     }

//     if (isRemainingPayment) {
//       if (!booking.depositPaid) {
//         throw new BadRequestException('Deposit must be paid first')
//       }

//       if (paymentData.amount !== booking.remainingAmount) {
//         throw new BadRequestException(
//           `Remaining amount must be ₦${booking.remainingAmount}`
//         )
//       }
//     }

//     const allowedStatuses = ['pending', 'payment_failed', 'deposit_paid']
//     if (!allowedStatuses.includes(booking.status)) {
//       throw new BadRequestException(
//         `Cannot process payment for booking with status '${booking.status}'. ` +
//         `Payment can only be processed for bookings with status 'pending', 'payment_failed', or 'deposit_paid'.`
//       )
//     }

//     if (booking.status === 'payment_failed') {
//       console.log('🔄 This is a payment retry - resetting booking status to pending')
//       await this.bookingService.updateBookingStatus(bookingId, 'pending')
//     }

//     // ✅ Fix: For remaining payments, validate against remaining amount, not total
//     if (isRemainingPayment) {
//       if (paymentData.amount !== booking.remainingAmount) {
//         throw new BadRequestException(
//           `Payment amount (${paymentData.amount}) does not match remaining amount (${booking.remainingAmount})`
//         )
//       }
//     } else if (!isDepositPayment && paymentData.amount !== booking.estimatedTotal) {
//       throw new BadRequestException(
//         `Payment amount (${paymentData.amount}) does not match booking total (${booking.estimatedTotal})`
//       )
//     }

//     const bookingDate = this.parseDate(booking.preferredDate)

//     const isStillAvailable = await this.checkAvailabilityForAllServices(
//       booking.businessId.toString(),
//       booking.services.map(s => s.serviceId.toString()),
//       bookingDate,
//       booking.preferredStartTime,
//       booking.totalDuration
//     )

//     if (!isStillAvailable) {
//       console.warn('⚠️ Time slot is no longer available')
//       await this.handleUnavailableSlot(booking, transactionReference)
//       throw new BadRequestException(
//         'Time slot is no longer available. Payment will be refunded.'
//       )
//     }

//     console.log('📅 Creating appointment from booking...')
//     const appointmentResult = await this.confirmBookingWithoutStaff(bookingId)

//     if (!appointmentResult || !appointmentResult.appointment) {
//       throw new Error('Failed to create appointment from booking')
//     }

//     console.log('✅ Appointment created:', appointmentResult.appointmentNumber)

//     const payment = await this.paymentService.createPaymentFromBooking(
//       booking,
//       transactionReference,
//       {
//         paymentMethod: paymentData.method,
//         gateway: paymentData.gateway,
//         status: 'completed',
//         amount: paymentData.amount,
//         paymentType: paymentData.paymentType || 'full'
//       }
//     )

//     // ✅ Use transformed booking source DTO
//     const commissionCalculation = await this.commissionCalculatorService
//       .calculateCommission(
//         bookingId,
//         {
//           businessId: booking.businessId.toString(),
//           clientId: booking.clientId.toString(),
//           totalAmount: booking.estimatedTotal,
//           sourceTracking: bookingSourceDto  // ✅ Use transformed DTO
//         }
//       )

//     if (commissionCalculation.isCommissionable) {
//       await this.commissionCalculatorService.createCommissionRecord(
//         bookingId,
//         payment._id.toString(),
//         {
//           businessId: booking.businessId.toString(),
//           clientId: booking.clientId.toString(),
//           totalAmount: booking.estimatedTotal,
//           sourceTracking: bookingSourceDto  // ✅ Use transformed DTO
//         },
//         commissionCalculation
//       )
//     }

//     await this.paymentService.updatePaymentStatus(
//       payment._id.toString(),
//       'completed',
//       transactionReference
//     )

//     await this.bookingService.linkAppointment(bookingId, appointmentResult.appointment._id.toString())

//     const appointmentDate = this.parseDate(booking.preferredDate)

//     try {
//       await this.notificationService.notifyPaymentConfirmation(
//         payment._id.toString(),
//         paymentData.clientId,
//         paymentData.businessId,
//         {
//           clientName: booking.clientName,
//           amount: paymentData.amount,
//           method: paymentData.method,
//           gateway: paymentData.gateway,
//           transactionId: transactionReference,
//           serviceName: booking.services.map(s => s.serviceName).join(', '),
//           appointmentDate: appointmentDate.toDateString(),
//           businessName: booking.businessName,
//           receiptUrl: `${process.env.APP_URL}/receipts/${payment._id}`,
//           clientEmail: booking.clientEmail,
//           clientPhone: booking.clientPhone
//         }
//       )
//     } catch (notificationError) {
//       console.warn('⚠️ Notification failed (continuing):', notificationError.message)
//     }

//     this.eventEmitter.emit('payment.completed', {
//       payment,
//       booking,
//       appointment: appointmentResult.appointment
//     })

//     return {
//       paymentId: payment._id.toString(),
//       success: true,
//       message: booking.status === 'payment_failed'
//         ? 'Payment retry successful! Your appointment has been confirmed.'
//         : 'Payment successful! Your appointment has been confirmed.',
//       transactionReference,
//       amount: paymentData.amount,
//       method: paymentData.method,
//       gateway: paymentData.gateway,
//       status: 'completed',
//       payment,
//       appointment: appointmentResult.appointment
//     }

//   } catch (error) {
//     console.error('❌ Payment processing failed:', error.message)

//     try {
//       await this.handlePaymentFailure(bookingId, transactionReference, error.message)
//     } catch (failureError) {
//       console.error('❌ Failed to handle payment failure:', failureError.message)
//     }

//     throw error
//   }
// }

//   // async handlePaymentAndComplete(
//   //   bookingId: string,
//   //   transactionReference: string,
//   //   paymentData: {
//   //     amount: number
//   //     method: string
//   //     gateway: string
//   //     clientId: string
//   //     businessId: string,
//   //     paymentType?: 'full' | 'deposit' | 'remaining'
//   //   }
//   // ): Promise<PaymentResult> {
//   //   try {
//   //     const booking = await this.bookingService.getBookingById(bookingId)

//   //     if (!booking) {
//   //       throw new NotFoundException('Booking not found')
//   //     }

//   //     const isDepositPayment = paymentData.paymentType === 'deposit'
//   //     const isRemainingPayment = paymentData.paymentType === 'remaining'

//   //     if (isDepositPayment) {
//   //       if (!booking.requiresDeposit) {
//   //         throw new BadRequestException('This booking does not require a deposit')
//   //       }

//   //       if (paymentData.amount !== booking.depositAmount) {
//   //         throw new BadRequestException(
//   //           `Deposit amount must be ₦${booking.depositAmount}`
//   //         )
//   //       }

//   //       await this.bookingService.updateBooking(bookingId, {
//   //         depositPaid: true,
//   //         depositTransactionId: transactionReference,
//   //         remainingAmount: booking.estimatedTotal - booking.depositAmount,
//   //         status: 'deposit_paid'
//   //       })

//   //       const payment = await this.paymentService.createPaymentFromBooking(
//   //         booking,
//   //         transactionReference,
//   //         {
//   //           paymentMethod: paymentData.method,
//   //           gateway: paymentData.gateway,
//   //           status: 'completed',
//   //           amount: paymentData.amount,
//   //           paymentType: 'deposit'
//   //         }
//   //       )

//   //       return {
//   //         paymentId: payment._id.toString(),
//   //         success: true,
//   //         message: 'Deposit paid successfully. Please pay remaining amount before appointment.',
//   //         transactionReference,
//   //         amount: paymentData.amount,
//   //         method: paymentData.method,
//   //         gateway: paymentData.gateway,
//   //         status: 'deposit_completed',
//   //         payment,
//   //         appointment: null,
//   //         remainingAmount: booking.estimatedTotal - booking.depositAmount
//   //       }
//   //     }

//   //     if (isRemainingPayment) {
//   //       if (!booking.depositPaid) {
//   //         throw new BadRequestException('Deposit must be paid first')
//   //       }

//   //       if (paymentData.amount !== booking.remainingAmount) {
//   //         throw new BadRequestException(
//   //           `Remaining amount must be ₦${booking.remainingAmount}`
//   //         )
//   //       }
//   //     }

//   //     const allowedStatuses = ['pending', 'payment_failed', 'deposit_paid']
//   //     if (!allowedStatuses.includes(booking.status)) {
//   //       throw new BadRequestException(
//   //         `Cannot process payment for booking with status '${booking.status}'. ` +
//   //         `Payment can only be processed for bookings with status 'pending', 'payment_failed', or 'deposit_paid'.`
//   //       )
//   //     }

//   //     if (booking.status === 'payment_failed') {
//   //       console.log('🔄 This is a payment retry - resetting booking status to pending')
//   //       await this.bookingService.updateBookingStatus(bookingId, 'pending')
//   //     }

//   //     if (!isDepositPayment && paymentData.amount !== booking.estimatedTotal) {
//   //       throw new BadRequestException(
//   //         `Payment amount (${paymentData.amount}) does not match booking total (${booking.estimatedTotal})`
//   //       )
//   //     }

//   //     const bookingDate = this.parseDate(booking.preferredDate)

//   //     const isStillAvailable = await this.checkAvailabilityForAllServices(
//   //       booking.businessId.toString(),
//   //       booking.services.map(s => s.serviceId.toString()),
//   //       bookingDate,
//   //       booking.preferredStartTime,
//   //       booking.totalDuration
//   //     )

//   //     if (!isStillAvailable) {
//   //       console.warn('⚠️ Time slot is no longer available')
//   //       await this.handleUnavailableSlot(booking, transactionReference)
//   //       throw new BadRequestException(
//   //         'Time slot is no longer available. Payment will be refunded.'
//   //       )
//   //     }

//   //     console.log('📅 Creating appointment from booking...')
//   //     const appointmentResult = await this.confirmBookingWithoutStaff(bookingId)

//   //     if (!appointmentResult || !appointmentResult.appointment) {
//   //       throw new Error('Failed to create appointment from booking')
//   //     }

//   //     console.log('✅ Appointment created:', appointmentResult.appointmentNumber)

//   //     const payment = await this.paymentService.createPaymentFromBooking(
//   //       booking,
//   //       transactionReference,
//   //       {
//   //         paymentMethod: paymentData.method,
//   //         gateway: paymentData.gateway,
//   //         status: 'completed',
//   //         amount: paymentData.amount,
//   //         paymentType: paymentData.paymentType || 'full'
//   //       }
//   //     )

//   //     const commissionCalculation = await this.commissionCalculatorService
//   //       .calculateCommission(
//   //         bookingId,
//   //         {
//   //           businessId: booking.businessId.toString(),
//   //           clientId: booking.clientId.toString(),
//   //           totalAmount: booking.estimatedTotal,
//   //           sourceTracking: booking.bookingSource
//   //         }
//   //       )

//   //     if (commissionCalculation.isCommissionable) {
//   //       await this.commissionCalculatorService.createCommissionRecord(
//   //         bookingId,
//   //         payment._id.toString(),
//   //         {
//   //           businessId: booking.businessId.toString(),
//   //           clientId: booking.clientId.toString(),
//   //           totalAmount: booking.estimatedTotal,
//   //           sourceTracking: booking.bookingSource
//   //         },
//   //         commissionCalculation
//   //       )
//   //     }

//   //     await this.paymentService.updatePaymentStatus(
//   //       payment._id.toString(),
//   //       'completed',
//   //       transactionReference
//   //     )

//   //     await this.bookingService.linkAppointment(bookingId, appointmentResult.appointment._id.toString())

//   //     const appointmentDate = this.parseDate(booking.preferredDate)

//   //     try {
//   //       await this.notificationService.notifyPaymentConfirmation(
//   //         payment._id.toString(),
//   //         paymentData.clientId,
//   //         paymentData.businessId,
//   //         {
//   //           clientName: booking.clientName,
//   //           amount: paymentData.amount,
//   //           method: paymentData.method,
//   //           gateway: paymentData.gateway,
//   //           transactionId: transactionReference,
//   //           serviceName: booking.services.map(s => s.serviceName).join(', '),
//   //           appointmentDate: appointmentDate.toDateString(),
//   //           businessName: booking.businessName,
//   //           receiptUrl: `${process.env.APP_URL}/receipts/${payment._id}`,
//   //           clientEmail: booking.clientEmail,
//   //           clientPhone: booking.clientPhone
//   //         }
//   //       )
//   //     } catch (notificationError) {
//   //       console.warn('⚠️ Notification failed (continuing):', notificationError.message)
//   //     }

//   //     this.eventEmitter.emit('payment.completed', {
//   //       payment,
//   //       booking,
//   //       appointment: appointmentResult.appointment
//   //     })

//   //     return {
//   //       paymentId: payment._id.toString(),
//   //       success: true,
//   //       message: booking.status === 'payment_failed'
//   //         ? 'Payment retry successful! Your appointment has been confirmed.'
//   //         : 'Payment successful! Your appointment has been confirmed.',
//   //       transactionReference,
//   //       amount: paymentData.amount,
//   //       method: paymentData.method,
//   //       gateway: paymentData.gateway,
//   //       status: 'completed',
//   //       payment,
//   //       appointment: appointmentResult.appointment
//   //     }

//   //   } catch (error) {
//   //     console.error('❌ Payment processing failed:', error.message)

//   //     try {
//   //       await this.handlePaymentFailure(bookingId, transactionReference, error.message)
//   //     } catch (failureError) {
//   //       console.error('❌ Failed to handle payment failure:', failureError.message)
//   //     }

//   //     throw error
//   //   }
//   // }

//   // OPTIONAL: Add a method to manually reset booking status for retry
//   async resetBookingForPaymentRetry(bookingId: string): Promise<void> {
//     const booking = await this.bookingService.getBookingById(bookingId)

//     if (!booking) {
//       throw new NotFoundException('Booking not found')
//     }

//     if (booking.status !== 'payment_failed') {
//       throw new BadRequestException(
//         `Cannot reset booking. Only bookings with 'payment_failed' status can be reset. Current status: ${booking.status}`
//       )
//     }

//     // Check if booking hasn't expired
//     if (booking.expiresAt && new Date() > new Date(booking.expiresAt)) {
//       throw new BadRequestException('Booking has expired. Please create a new booking.')
//     }

//     // Reset to pending
//     await this.bookingService.updateBookingStatus(bookingId, 'pending')

//     console.log(`✅ Booking ${booking.bookingNumber} reset to pending for payment retry`)
//   }

//   // NEW METHOD: Confirm booking and create appointment WITHOUT staff assignment
//   // Staff assignment is done separately after payment confirmation
//   async confirmBookingWithoutStaff(bookingId: string): Promise<AppointmentResult> {
//     console.log('=== ORCHESTRATOR: CONFIRM BOOKING WITHOUT STAFF ===')
//     console.log('BookingId:', bookingId)

//     try {
//       // STEP 1: Get booking
//       const booking = await this.bookingService.getBookingById(bookingId)
//       console.log('✅ Booking found:', booking.bookingNumber)
//       console.log('Current status:', booking.status)

//       // FIX: Accept both 'pending' and 'payment_failed' statuses
//       const allowedStatuses = ['pending', 'payment_failed']
//       if (!allowedStatuses.includes(booking.status)) {
//         throw new BadRequestException(
//           `Cannot confirm booking. Current status is '${booking.status}'. Only 'pending' or 'payment_failed' bookings can be confirmed. ` +
//           `This booking may have already been confirmed or expired.`
//         )
//       }

//       // STEP 2: Update booking status to confirmed
//       console.log('📝 Updating booking status to confirmed...')
//       await this.bookingService.updateBookingStatus(bookingId, 'confirmed')
//       console.log('✅ Booking status updated to confirmed')

//       // STEP 3: Create appointment (without staff assignment)
//       console.log('📅 Creating appointment from booking...')
//       const appointment = await this.appointmentService.createFromBooking(booking)

//       if (!appointment) {
//         throw new Error('Failed to create appointment')
//       }

//       console.log('✅ Appointment created:', appointment.appointmentNumber)
//       console.log('Appointment details:', {
//         id: appointment._id,
//         number: appointment.appointmentNumber,
//         date: appointment.selectedDate || appointment.scheduledDate,
//         time: appointment.selectedTime || appointment.scheduledTime
//       })

//       // STEP 4: Send notifications (without staff notifications since no staff assigned yet)
//       console.log('📧 Sending confirmation notifications')
//       try {
//         await this.sendClientConfirmationOnly(booking, appointment)
//         console.log('✅ Client notification sent successfully')
//       } catch (notificationError) {
//         console.warn('⚠️ Notification sending failed (continuing):', notificationError.message)
//       }

//       // STEP 5: Emit events
//       console.log('📡 Emitting booking events')
//       this.eventEmitter.emit('booking.confirmed', {
//         booking,
//         appointment,
//         staffAssigned: false // Indicates staff assignment pending
//       })

//       this.eventEmitter.emit('appointment.created', {
//         appointment,
//         booking,
//         staffAssigned: false
//       })

//       console.log('✅ BOOKING CONFIRMATION COMPLETE (Staff assignment pending)')

//       // STEP 6: Return success response
//       return {
//         appointmentId: appointment._id.toString(),
//         appointmentNumber: appointment.appointmentNumber,
//         scheduledDate: appointment.selectedDate || appointment.scheduledDate || booking.preferredDate,
//         scheduledTime: appointment.selectedTime || appointment.scheduledTime || booking.preferredStartTime,
//         status: appointment.status,
//         clientId: appointment.clientId.toString(),
//         businessId: appointment.businessInfo?.businessId || booking.businessId.toString(),
//         booking: booking,
//         message: 'Booking confirmed successfully. Staff will be assigned shortly.',
//         appointment,
//         assignment: null, // No staff assigned yet
//         assignments: [] // Empty array - staff to be assigned later
//       }
//     } catch (error) {
//       console.error('❌ BOOKING CONFIRMATION FAILED:', error.message)
//       console.error('Stack:', error.stack)
//       throw error
//     }
//   }

//   // Helper method: Send confirmation to client only (no staff notifications)
//   private async sendClientConfirmationOnly(booking: any, appointment: any): Promise<void> {
//     const bookingDate = this.parseDate(booking.preferredDate)

//     // Notify client about booking confirmation
//     await this.notificationService.notifyBookingConfirmation(
//       booking._id.toString(),
//       booking.clientId.toString(),
//       booking.businessId.toString(),
//       {
//         clientName: booking.clientName,
//         serviceName: booking.services.map(s => s.serviceName).join(', '),
//         date: bookingDate.toDateString(),
//         time: booking.preferredStartTime,
//         businessName: booking.businessName,
//         businessAddress: booking.businessAddress || 'N/A',
//         appointmentNumber: appointment.appointmentNumber,
//         clientEmail: booking.clientEmail,
//         clientPhone: booking.clientPhone,
//         staffCount: 0 // No staff assigned yet
//       }
//     )
//   }

//   // UPDATED: Make staff assignment truly optional
//   async confirmBookingAndCreateAppointment(
//     bookingId: string,
//     staffId?: string,
//     staffAssignments?: Array<{ staffId: string; serviceId: string; staffName?: string }>
//   ): Promise<AppointmentResult> {
//     console.log('=== ORCHESTRATOR: CONFIRM BOOKING START ===')
//     console.log('BookingId:', bookingId)
//     console.log('Single StaffId:', staffId)
//     console.log('Staff Assignments:', staffAssignments?.length || 0)

//     // If no staff provided, use the simpler confirmation flow
//     if (!staffId && (!staffAssignments || staffAssignments.length === 0)) {
//       console.log('⚠️ No staff provided - using confirmation without staff assignment')
//       return await this.confirmBookingWithoutStaff(bookingId)
//     }

//     try {
//       // STEP 1: Get booking
//       const booking = await this.bookingService.getBookingById(bookingId)
//       console.log('✅ Booking found:', booking.bookingNumber)
//       console.log('Current status:', booking.status)

//       // FIX: Better status validation with specific error message
//       if (booking.status !== 'pending') {
//         throw new BadRequestException(
//           `Cannot confirm booking. Current status is '${booking.status}'. Only 'pending' bookings can be confirmed. ` +
//           `This booking may have already been confirmed or expired.`
//         )
//       }

//       // STEP 2: Validate that we have staff assignments (either single or multiple)
//       // REMOVED: This validation is now handled earlier by checking and redirecting to confirmBookingWithoutStaff

//       // STEP 3: Validate staff availability for each service
//       const bookingDate = this.parseDate(booking.preferredDate)
//       const dateString = this.formatDateForAvailability(bookingDate)

//       let staffToValidate: Array<{ staffId: string; serviceId: string }> = []

//       if (staffAssignments && staffAssignments.length > 0) {
//         staffToValidate = staffAssignments.map(a => ({
//           staffId: a.staffId,
//           serviceId: a.serviceId
//         }))
//       } else if (staffId) {
//         // Legacy single staff for all services
//         staffToValidate = booking.services.map(s => ({
//           staffId: staffId,
//           serviceId: s.serviceId.toString()
//         }))
//       }

//       // Validate each staff member's availability
//       console.log(`🔍 Validating ${staffToValidate.length} staff assignments`)

//       const unavailableStaff: Array<{ staffId: string; serviceName: string; reason: string }> = []

//       for (const assignment of staffToValidate) {
//         const service = booking.services.find(s => s.serviceId.toString() === assignment.serviceId)

//         if (!service) {
//           throw new BadRequestException(`Service ${assignment.serviceId} not found in booking`)
//         }

//         const duration = service.duration + (service.bufferTime || 0)
//         const endTime = this.addMinutesToTime(booking.preferredStartTime, duration)

//         const isAvailable = await this.availabilityService.checkSlotAvailability({
//           businessId: booking.businessId.toString(),
//           serviceId: assignment.serviceId,
//           date: dateString,
//           startTime: booking.preferredStartTime,
//           duration: duration
//         })

//         if (!isAvailable) {
//           unavailableStaff.push({
//             staffId: assignment.staffId,
//             serviceName: service.serviceName,
//             reason: `Not available on ${dateString} from ${booking.preferredStartTime} to ${endTime}`
//           })
//           console.warn(`⚠️ Staff ${assignment.staffId} NOT available for service ${service.serviceName}`)
//         } else {
//           console.log(`✅ Staff ${assignment.staffId} available for service ${assignment.serviceId}`)
//         }
//       }

//       // FIX: Return detailed error if any staff is unavailable
//       if (unavailableStaff.length > 0) {
//         const errorDetails = unavailableStaff
//           .map(s => `${s.staffId}: ${s.serviceName} (${s.reason})`)
//           .join('; ')

//         throw new BadRequestException(
//           `The following staff members are not available for the requested time slot: ${errorDetails}. ` +
//           `Please try different staff or time slots.`
//         )
//       }

//       // STEP 4: Update booking status to confirmed (DO THIS FIRST before any other operations)
//       console.log('📝 Updating booking status to confirmed...')
//       await this.bookingService.updateBookingStatus(bookingId, 'confirmed', staffId)
//       console.log('✅ Booking status updated to confirmed')

//       // STEP 5: Create appointment
//       console.log('📅 Creating appointment from booking...')
//       const appointment = await this.appointmentService.createFromBooking(booking)
//       console.log('✅ Appointment created:', appointment.appointmentNumber)

//       // STEP 6: Create staff assignments
//       let staffAssignmentResults: any[] = []

//       if (staffAssignments && staffAssignments.length > 0) {
//         // Multiple staff assignments
//         console.log(`📋 Creating ${staffAssignments.length} staff assignments`)

//         for (const assignment of staffAssignments) {
//           try {
//             const service = booking.services.find(
//               s => s.serviceId.toString() === assignment.serviceId
//             )

//             if (!service) {
//               console.warn(`⚠️ Service ${assignment.serviceId} not found`)
//               continue
//             }

//             const duration = service.duration
//             const endTime = this.addMinutesToTime(booking.preferredStartTime, duration)

//             console.log(`📌 Assigning staff ${assignment.staffId} to service ${service.serviceName}`)
//             console.log(`   Time: ${booking.preferredStartTime} - ${endTime} (${duration} mins)`)

//             const result = await this.staffService.assignStaffToAppointment({
//               staffId: assignment.staffId,
//               businessId: booking.businessId.toString(),
//               appointmentId: appointment._id.toString(),
//               clientId: booking.clientId.toString(),
//               assignmentDate: bookingDate,
//               assignmentDetails: {
//                 startTime: booking.preferredStartTime,
//                 endTime: endTime,
//                 assignmentType: 'primary',
//                 estimatedDuration: duration,
//                 serviceId: assignment.serviceId,
//                 serviceName: service.serviceName,
//                 specialInstructions: booking.specialRequests || '',
//                 roomNumber: '',
//                 requiredEquipment: [],
//                 clientPreferences: '',
//                 setupTimeMinutes: 0,
//                 cleanupTimeMinutes: 0
//               },
//               assignedBy: staffId || assignment.staffId,
//               assignmentMethod: 'manual'
//             })

//             staffAssignmentResults.push({
//               staffId: assignment.staffId,
//               serviceId: assignment.serviceId,
//               staffName: assignment.staffName,
//               status: 'assigned',
//               ...result
//             })

//             console.log(`✅ Successfully assigned staff ${assignment.staffId}`)
//           } catch (error) {
//             console.error(`❌ Failed to assign staff ${assignment.staffId}:`, error.message)

//             // Log the error but continue with other staff
//             staffAssignmentResults.push({
//               staffId: assignment.staffId,
//               serviceId: assignment.serviceId,
//               staffName: assignment.staffName,
//               error: error.message,
//               status: 'failed'
//             })
//           }
//         }
//       } else if (staffId) {
//         // Single staff assignment (legacy)
//         console.log(`📋 Single staff assignment: ${staffId}`)

//         try {
//           const result = await this.staffService.autoAssignStaff(
//             booking.businessId.toString(),
//             appointment._id.toString(),
//             booking.clientId.toString(),
//             booking.services[0].serviceId.toString(),
//             bookingDate,
//             booking.preferredStartTime,
//             booking.estimatedEndTime
//           )

//           staffAssignmentResults.push(result)
//           console.log(`✅ Single staff assignment completed`)
//         } catch (error) {
//           console.error(`❌ Single staff assignment failed:`, error.message)
//           staffAssignmentResults.push({
//             staffId: staffId,
//             error: error.message,
//             status: 'failed'
//           })
//         }
//       }

//       // STEP 7: Send notifications (wrap in try-catch to not fail the whole operation)
//       console.log('📧 Sending confirmation notifications')
//       try {
//         await this.sendConfirmationNotifications(booking, appointment, staffAssignmentResults)
//         console.log('✅ Notifications sent successfully')
//       } catch (notificationError) {
//         console.warn('⚠️ Notification sending failed (continuing):', notificationError.message)
//         // Don't throw - notifications failing shouldn't fail the booking
//       }

//       // STEP 8: Emit events
//       console.log('📡 Emitting booking events')
//       this.eventEmitter.emit('booking.confirmed', {
//         booking,
//         staffId,
//         staffAssignments: staffAssignmentResults,
//         appointment
//       })

//       this.eventEmitter.emit('appointment.created', {
//         appointment,
//         booking,
//         staffAssignments: staffAssignmentResults
//       })

//       console.log('✅ BOOKING CONFIRMATION COMPLETE')

//       // STEP 9: Return success response
//       return {
//         appointmentId: appointment._id.toString(),
//         appointmentNumber: appointment.appointmentNumber,
//         scheduledDate: appointment.selectedDate,
//         scheduledTime: appointment.selectedTime,
//         status: appointment.status,
//         clientId: appointment.clientId.toString(),
//         businessId: appointment.businessInfo.businessId,
//         booking: booking,
//         message: `Booking confirmed with ${staffAssignmentResults.filter(s => s.status === 'assigned').length} staff member(s) assigned`,
//         appointment,
//         assignment: staffAssignmentResults.length === 1 ? staffAssignmentResults[0] : null,
//         assignments: staffAssignmentResults
//       }
//     } catch (error) {
//       console.error('❌ BOOKING CONFIRMATION FAILED:', error.message)
//       console.error('Stack:', error.stack)
//       throw error
//     }
//   }

//   // NEW: Add comprehensive staff availability setup when a staff member is added to a business
//   async setupDefaultStaffAvailability(
//     businessId: string,
//     staffId: string,
//     createdBy: string
//   ): Promise<void> {
//     console.log(`🌐 Setting up 24/7 availability for staff ${staffId}`)

//     try {
//       // Create 24/7 availability for next 365 days
//       const today = new Date()
//       const endDate = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000) // 365 days ahead

//       await this.availabilityService.setupStaffAvailability24x7(
//         businessId,
//         staffId,
//         today,
//         endDate,
//         createdBy
//       )

//       console.log(`✅ Successfully setup 24/7 availability for staff`)
//     } catch (error) {
//       console.error(`❌ Failed to setup staff availability:`, error.message)
//       throw error
//     }
//   }

//   // NEW: Enhanced error messages for staff availability
//   private async validateAndReportStaffAvailability(
//     staffAssignments: Array<{ staffId: string; serviceId: string; staffName?: string }>,
//     booking: any,
//     availabilityService: any
//   ): Promise<{ isValid: boolean; errors: string[] }> {
//     const errors: string[] = []

//     for (const assignment of staffAssignments) {
//       const service = booking.services.find(
//         s => s.serviceId.toString() === assignment.serviceId
//       )

//       if (!service) {
//         errors.push(`Service not found: ${assignment.serviceId}`)
//         continue
//       }

//       const duration = service.duration + (service.bufferTime || 0)
//       const endTime = this.addMinutesToTime(booking.preferredStartTime, duration)
//       const dateString = this.formatDateForAvailability(this.parseDate(booking.preferredDate))

//       // Check staff availability
//       const isAvailable = await availabilityService.checkSlotAvailability({
//         businessId: booking.businessId.toString(),
//         serviceId: assignment.serviceId,
//         date: dateString,
//         startTime: booking.preferredStartTime,
//         duration: duration
//       })

//       if (!isAvailable) {
//         errors.push(
//           `${assignment.staffName || 'Staff'} (${assignment.staffId}) is not available for ${service.serviceName} ` +
//           `on ${booking.preferredDate} from ${booking.preferredStartTime} to ${endTime}`
//         )
//       }
//     }

//     return {
//       isValid: errors.length === 0,
//       errors
//     }
//   }
// }

// src/modules/booking/services/booking-orchestrator.service.ts
import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common'
import { BookingService } from './booking.service'
import { AppointmentService } from '../../appointment/appointment.service'
import { PaymentService } from '../../payment/payment.service'
import { AvailabilityService } from '../../availability/availability.service'
import { NotificationService } from '../../notification/notification.service'
import { StaffService } from '../../staff/staff.service'
import { BusinessService } from '../../business/business.service'
import { ServiceService } from '../../service/service.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ServiceBookingDto } from "../dto/create-booking.dto"
import { CancellationPolicyService } from '../../cancellation/services/cancellation-policy.service'
import { NoShowManagementService } from '../../cancellation/services/no-show-management.service'
import { SubscriptionService } from '../../subscription/subscription.service'
import { AppointmentResult } from "../types/booking.types"
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { SourceTrackingService } from '../../commission/services/source-tracking.service'
import { CommissionCalculatorService } from '../../commission/services/commission-calculator.service'
import { CreateBookingWithSourceDto } from '../dto/create-booking-with-source.dto'
import { BookingSourceDto, BookingSourceType } from '../dto/create-booking-with-source.dto';
import { Types } from 'mongoose'

interface DepositCalculation {
  requiresDeposit: boolean;
  depositAmount: number;
  reason: string;
  percentage?: number;
}

interface BookingResult {
  bookingId: string
  bookingNumber: string
  estimatedTotal: number
  expiresAt: Date
  status: string
  clientId: string
  businessId: string
  booking: any
  availableSlots?: any[]
  message: string
  requiresPayment?: boolean
  requiresDeposit?: boolean
  depositAmount?: number
  depositReason?: string
  remainingAmount?: number
  commissionInfo?: any
  clientReliability?: any
}

interface PaymentResult {
  paymentId: string
  success: boolean
  message: string
  transactionReference: string
  amount: number
  method: string
  gateway: string
  status: string
  payment: any
  appointment: any
  remainingAmount?: number
}

@Injectable()
export class BookingOrchestrator {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly bookingService: BookingService,
    private readonly appointmentService: AppointmentService,
    private readonly paymentService: PaymentService,
    private readonly availabilityService: AvailabilityService,
    private readonly notificationService: NotificationService,
    private readonly staffService: StaffService,
    private readonly businessService: BusinessService,
    private readonly subscriptionService: SubscriptionService,
    private readonly serviceService: ServiceService,
    private readonly eventEmitter: EventEmitter2,
    private readonly cancellationPolicyService: CancellationPolicyService,
    private readonly noShowManagementService: NoShowManagementService,
    private readonly sourceTrackingService: SourceTrackingService,
    private readonly commissionCalculatorService: CommissionCalculatorService,
  ) { }

  // NEW HELPER METHOD: Calculate total buffer time
  private calculateTotalBufferTime(services: ServiceBookingDto[]): number {
    return services.reduce((total, service) => {
      return total + (service.bufferTime || 0)
    }, 0)
  }

  private normalizeBookingSource(dto: CreateBookingWithSourceDto): BookingSourceDto {
    // If bookingSource exists, merge with any legacy fields
    if (dto.bookingSource) {
      return {
        // Prioritize bookingSource.sourceType, fall back to legacy sourceType, default to DIRECT_LINK
        sourceType: dto.bookingSource.sourceType || dto.sourceType || BookingSourceType.DIRECT_LINK,

        // Merge other fields, prioritizing bookingSource values
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

    // If no bookingSource object, create one from legacy fields
    return {
      sourceType: dto.sourceType || BookingSourceType.DIRECT_LINK,
      sourceIdentifier: dto.sourceIdentifier,
      referralCode: dto.referralCode,
      utmSource: dto.utmSource,
      utmMedium: dto.utmMedium,
      utmCampaign: dto.utmCampaign,
    };
  }

  private transformBookingSourceToDto(bookingSource: any): BookingSourceDto {
    if (!bookingSource) {
      return {
        sourceType: BookingSourceType.DIRECT_LINK,
      };
    }

    // Convert string sourceType to enum
    const sourceType = bookingSource.sourceType
      ? (BookingSourceType[bookingSource.sourceType.toUpperCase()] || BookingSourceType.DIRECT_LINK)
      : BookingSourceType.DIRECT_LINK;

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


  private async sendConfirmationNotifications(
    booking: any,
    appointment: any,
    staffAssignments: any[]
  ): Promise<void> {
    const bookingDate = this.parseDate(booking.preferredDate)

    // Notify client about booking confirmation
    await this.notificationService.notifyBookingConfirmation(
      booking._id.toString(),
      booking.clientId.toString(),
      booking.businessId.toString(),
      {
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
      }
    )

    // Notify each assigned staff member
    for (const assignment of staffAssignments) {
      if (assignment.status === 'assigned' && assignment.staffId) {
        try {
          // Find the service this staff is assigned to
          const assignedService = booking.services.find(
            s => s.serviceId.toString() === assignment.serviceId
          )

          await this.notificationService.notifyStaffAssignment(
            appointment._id.toString(),
            assignment.staffId,
            booking.businessId.toString(),
            {
              staffName: assignment.staffName || 'Staff Member',
              clientName: booking.clientName,
              serviceName: assignedService?.serviceName || 'Service',
              date: bookingDate.toDateString(),
              time: booking.preferredStartTime,
              businessName: booking.businessName,
              appointmentNumber: appointment.appointmentNumber,
              staffEmail: assignment.email || 'staff@email.com',
              staffPhone: assignment.phone || '+1234567890'
            }
          )

          // this.logger.log(`✅ Notification sent to staff ${assignment.staffId}`)
        } catch (error) {
          this.logger.error(`Failed to notify staff ${assignment.staffId}: ${error.message}`)
        }
      }
    }
  }

  // async createBookingWithValidation(
  //   createBookingDto: CreateBookingWithSourceDto
  // ): Promise<BookingResult> {
  //   try {
  //     const preferredDate = this.parseDate(createBookingDto.preferredDate);

  //     const limitsCheck = await this.subscriptionService.checkLimits(
  //       createBookingDto.businessId,
  //       'booking'
  //     );

  //     if (!limitsCheck.isValid) {
  //       throw new BadRequestException(`Subscription limits exceeded`);
  //     }

  //     const serviceIds = createBookingDto.services.map(s => s.serviceId);
  //     const services = await this.serviceService.getServicesByIds(serviceIds);
  //     const totalAmount = this.calculateTotalPrice(services);

  //     // ✅ Normalize booking source to ensure sourceType is set
  //     const normalizedBookingSource = this.normalizeBookingSource(createBookingDto);

  //     console.log('📊 Normalized booking source:', {
  //       sourceType: normalizedBookingSource.sourceType,
  //       trackingCode: normalizedBookingSource.trackingCode,
  //       hasLegacyFields: !!(createBookingDto.sourceType || createBookingDto.utmSource),
  //     });

  //     // Validate the normalized source data
  //     const sourceValidation = this.sourceTrackingService.validateSourceData(
  //       normalizedBookingSource
  //     );

  //     if (!sourceValidation.isValid) {
  //       throw new BadRequestException(
  //         `Invalid source tracking data: ${sourceValidation.errors.join(', ')}`
  //       );
  //     }

  //     const clientReliability = await this.noShowManagementService
  //       .shouldRequireDeposit(
  //         createBookingDto.clientId,
  //         createBookingDto.businessId
  //       );

  //     const depositPolicy = await this.cancellationPolicyService
  //       .calculateDepositAmount(
  //         createBookingDto.businessId,
  //         totalAmount,
  //         serviceIds
  //       );

  //     const requiresDeposit = depositPolicy.requiresDeposit ||
  //       clientReliability.requiresDeposit;

  //     const depositAmount = requiresDeposit ? depositPolicy.depositAmount : 0;
  //     const depositReason = clientReliability.requiresDeposit
  //       ? clientReliability.reason
  //       : depositPolicy.reason;

  //     // Calculate commission with normalized source
  //     const commissionPreview = await this.commissionCalculatorService
  //       .calculateCommission(
  //         'preview',
  //         {
  //           businessId: createBookingDto.businessId,
  //           clientId: createBookingDto.clientId,
  //           totalAmount,
  //           sourceTracking: normalizedBookingSource  // ✅ Use normalized source
  //         }
  //       );

  //     const totalDuration = this.calculateTotalDuration(services);
  //     const isAvailable = await this.checkAvailabilityForAllServices(
  //       createBookingDto.businessId,
  //       serviceIds,
  //       preferredDate,
  //       createBookingDto.preferredStartTime,
  //       totalDuration
  //     );

  //     if (!isAvailable) {
  //       throw new BadRequestException('Selected time slot is not available');
  //     }

  //     const bookingData = {
  //       clientId: createBookingDto.clientId,
  //       businessId: createBookingDto.businessId,
  //       preferredDate,
  //       preferredStartTime: createBookingDto.preferredStartTime,
  //       clientName: createBookingDto.clientName,
  //       clientEmail: createBookingDto.clientEmail,
  //       clientPhone: createBookingDto.clientPhone,
  //       specialRequests: createBookingDto.specialRequests,
  //       services: services.map((service, index) => ({
  //         serviceId: service._id,
  //         serviceName: service.basicDetails.serviceName,
  //         duration: this.getServiceDurationInMinutes(service),
  //         bufferTime: createBookingDto.services[index].bufferTime || 0,
  //         price: service.pricingAndDuration.price.amount
  //       })),
  //       estimatedEndTime: this.addMinutesToTime(
  //         createBookingDto.preferredStartTime,
  //         totalDuration
  //       ),
  //       totalDuration,
  //       estimatedTotal: totalAmount,
  //       status: 'pending',
  //       bookingSource: normalizedBookingSource,  // ✅ Use normalized source
  //       requiresDeposit,
  //       depositAmount,
  //       depositReason,
  //       remainingAmount: requiresDeposit ? totalAmount - depositAmount : totalAmount,
  //       commissionPreview: commissionPreview.isCommissionable ? {
  //         rate: commissionPreview.commissionRate,
  //         amount: commissionPreview.commissionAmount,
  //         reason: commissionPreview.reason
  //       } : null,
  //       clientReliabilityScore: clientReliability.score
  //     };

  //     const booking = await this.bookingService.createBooking(bookingData);

  //     // Track conversion if tracking code exists
  //     if (normalizedBookingSource.trackingCode) {
  //       await this.sourceTrackingService.recordConversion(
  //         normalizedBookingSource.trackingCode
  //       );
  //     }

  //     await this.notificationService.notifyStaffNewBooking(booking);
  //     this.eventEmitter.emit('booking.created', booking);

  //     return {
  //       bookingId: booking._id.toString(),
  //       bookingNumber: booking.bookingNumber,
  //       estimatedTotal: booking.estimatedTotal,
  //       expiresAt: booking.expiresAt,
  //       status: booking.status,
  //       clientId: booking.clientId.toString(),
  //       businessId: booking.businessId.toString(),
  //       booking,
  //       requiresDeposit,
  //       depositAmount,
  //       depositReason,
  //       remainingAmount: bookingData.remainingAmount,
  //       commissionInfo: commissionPreview.isCommissionable ? {
  //         willBeCharged: true,
  //         rate: commissionPreview.commissionRate,
  //         amount: commissionPreview.commissionAmount,
  //         reason: commissionPreview.reason,
  //         businessPayout: commissionPreview.businessPayout
  //       } : {
  //         willBeCharged: false,
  //         reason: commissionPreview.reason,
  //         businessPayout: totalAmount
  //       },
  //       clientReliability: {
  //         score: clientReliability.score,
  //         requiresDeposit: clientReliability.requiresDeposit,
  //         reason: clientReliability.reason
  //       },
  //       message: requiresDeposit
  //         ? `Booking created. Deposit of ₦${depositAmount} required to confirm.`
  //         : 'Booking created successfully. Awaiting confirmation.'
  //     };

  //   } catch (error) {
  //     this.logger.error(`Booking creation failed: ${error.message}`);
  //     throw error;
  //   }
  // }

  async createBookingWithValidation(
    createBookingDto: CreateBookingWithSourceDto
  ): Promise<BookingResult> {
    try {
      const preferredDate = this.parseDate(createBookingDto.preferredDate);

      // ✅ CHANGED: Use subscriptionService to check limits
      const limitsCheck = await this.subscriptionService.checkLimits(
        createBookingDto.businessId,
        'booking'
      );

      if (!limitsCheck.isValid) {
        throw new BadRequestException(`Subscription limits exceeded`);
      }

      const serviceIds = createBookingDto.services.map(s => s.serviceId);
      const services = await this.serviceService.getServicesByIds(serviceIds);
      const totalAmount = this.calculateTotalPrice(services);

      // ✅ Normalize booking source to ensure sourceType is set
      const normalizedBookingSource = this.normalizeBookingSource(createBookingDto);

      console.log('📊 Normalized booking source:', {
        sourceType: normalizedBookingSource.sourceType,
        trackingCode: normalizedBookingSource.trackingCode,
        hasLegacyFields: !!(createBookingDto.sourceType || createBookingDto.utmSource),
      });

      // Validate the normalized source data
      const sourceValidation = this.sourceTrackingService.validateSourceData(
        normalizedBookingSource
      );

      if (!sourceValidation.isValid) {
        throw new BadRequestException(
          `Invalid source tracking data: ${sourceValidation.errors.join(', ')}`
        );
      }

      const clientReliability = await this.noShowManagementService
        .shouldRequireDeposit(
          createBookingDto.clientId,
          createBookingDto.businessId
        );

      const depositPolicy = await this.cancellationPolicyService
        .calculateDepositAmount(
          createBookingDto.businessId,
          totalAmount,
          serviceIds
        );

      const requiresDeposit = depositPolicy.requiresDeposit ||
        clientReliability.requiresDeposit;

      const depositAmount = requiresDeposit ? depositPolicy.depositAmount : 0;
      const depositReason = clientReliability.requiresDeposit
        ? clientReliability.reason
        : depositPolicy.reason;

      // Calculate commission with normalized source
      const commissionPreview = await this.commissionCalculatorService
        .calculateCommission(
          'preview',
          {
            businessId: createBookingDto.businessId,
            clientId: createBookingDto.clientId,
            totalAmount,
            sourceTracking: normalizedBookingSource  // ✅ Use normalized source
          }
        );

      const totalDuration = this.calculateTotalDuration(services);

      console.log(`[v0] Checking availability for business ${createBookingDto.businessId}`)
      console.log(`[v0] Date: ${preferredDate.toISOString()}, Time: ${createBookingDto.preferredStartTime}, Duration: ${totalDuration}min`)

      const isAvailable = await this.checkAvailabilityForAllServices(
        createBookingDto.businessId,
        serviceIds,
        preferredDate,
        createBookingDto.preferredStartTime,
        totalDuration
      );

      if (!isAvailable) {
        console.error(`[v0] Availability check failed for business ${createBookingDto.businessId}`)
        throw new BadRequestException('Selected time slot is not available');
      }

      console.log(`[v0] ✅ Time slot is available, proceeding with booking`)

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
        estimatedEndTime: this.addMinutesToTime(
          createBookingDto.preferredStartTime,
          totalDuration
        ),
        totalDuration,
        estimatedTotal: totalAmount,
        status: 'pending',
        bookingSource: normalizedBookingSource,  // ✅ Use normalized source
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

      // Track conversion if tracking code exists
      if (normalizedBookingSource.trackingCode) {
        await this.sourceTrackingService.recordConversion(
          normalizedBookingSource.trackingCode
        );
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

    } catch (error) {
      this.logger.error(`Booking creation failed: ${error.message}`);
      throw error;
    }
  }


  private parseDate(date: Date | string): Date {
    if (date instanceof Date) {
      return date
    }
    const parsedDate = new Date(date + 'T00:00:00.000Z')
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(`Invalid date format: ${date}`)
    }
    return parsedDate
  }

  private formatDateForAvailability(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }



  private async checkAvailabilityForAllServices(
    businessId: string,
    serviceIds: string[],
    date: Date,
    startTime: string,
    totalDuration: number
  ): Promise<boolean> {
    // ✅ Step 1: Check BUSINESS WORKING HOURS
    const isWithinBusinessHours = await this.checkBusinessWorkingHours(
      businessId,
      date,
      startTime,
      totalDuration
    )

    if (!isWithinBusinessHours) {
      console.log('❌ Time slot outside business hours')
      return false
    }

    // ✅ Step 2: Check for CONFLICTING BOOKINGS
    const hasConflict = await this.checkForConflictingBookings(
      businessId,
      date,
      startTime,
      totalDuration
    )

    if (hasConflict) {
      console.log('❌ Time slot already booked')
      return false
    }

    console.log('✅ Time slot is available')
    return true
  }

  //   private async checkBusinessWorkingHours(
  //     businessId: string,
  //     date: Date,
  //     startTime: string,
  //     totalDuration: number
  //   ): Promise<boolean> {
  //     try {
  //       // Get business details to check operating hours
  //       const business = await this.businessService.getById(businessId)

  //       if (!business) {
  //         throw new BadRequestException('Business not found')
  //       }

  //       // Get the day of week (0 = Sunday, 1 = Monday, etc.)
  //       const dayOfWeek = date.getDay()
  //       const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  //       const currentDay = dayNames[dayOfWeek]

  //       // Check if business is open on this day
  //       const businessHours = business.businessHours

  // if (!businessHours || businessHours.length === 0) {
  //   console.log(`❌ No business hours configured`)
  //   return false
  // }

  // // Find the schedule for the current day
  // const daySchedule = businessHours.find(
  //   schedule => schedule.day.toLowerCase() === currentDay.toLowerCase()
  // )

  // if (!daySchedule) {
  //   console.log(`❌ No schedule found for ${currentDay}`)
  //   return false
  // }
  //       // const businessHours = business.operatingHours || business.workingHours

  //       // if (!businessHours || !businessHours[currentDay]) {
  //       //   console.log(`❌ Business closed on ${currentDay}`)
  //       //   return false
  //       // }

  //       // const daySchedule = businessHours[currentDay]

  //       // // If explicitly closed
  //       // if (daySchedule.isClosed || !daySchedule.isOpen) {
  //       //   console.log(`❌ Business marked as closed on ${currentDay}`)
  //       //   return false
  //       // }

  //       // Parse opening and closing times
  //       const [openHour, openMin] = (daySchedule.openTime || '09:00').split(':').map(Number)
  // const [closeHour, closeMin] = (daySchedule.closeTime || '17:00').split(':').map(Number)
  //       // const [openHour, openMin] = (daySchedule.openingTime || daySchedule.startTime || '09:00').split(':').map(Number)
  //       // const [closeHour, closeMin] = (daySchedule.closingTime || daySchedule.endTime || '17:00').split(':').map(Number)

  //       // Parse requested start time
  //       const [reqHour, reqMin] = startTime.split(':').map(Number)

  //       // Convert times to minutes for easier comparison
  //       const openingMins = openHour * 60 + openMin
  //       const closingMins = closeHour * 60 + closeMin
  //       const requestStartMins = reqHour * 60 + reqMin
  //       const requestEndMins = requestStartMins + totalDuration

  //       console.log(`⏰ Business hours: ${openHour}:${openMin.toString().padStart(2, '0')} - ${closeHour}:${closeMin.toString().padStart(2, '0')}`)
  //       console.log(`📅 Requested slot: ${reqHour}:${reqMin.toString().padStart(2, '0')} - ${Math.floor(requestEndMins / 60)}:${(requestEndMins % 60).toString().padStart(2, '0')}`)

  //       // Check if requested time is within business hours
  //       const isWithinHours = requestStartMins >= openingMins && requestEndMins <= closingMins

  //       if (!isWithinHours) {
  //         console.log(`❌ Requested time slot is outside business hours`)
  //         return false
  //       }

  //       console.log(`✅ Time slot is available within business hours`)
  //       return true

  //     } catch (error) {
  //       console.error(`❌ Error checking business hours: ${error.message}`)
  //       // Default to false if we can't verify business hours
  //       return false
  //     }
  //   }

  private async checkBusinessWorkingHours(
    businessId: string,
    date: Date,
    startTime: string,
    totalDuration: number
  ): Promise<boolean> {
    try {
      // Get business details to check operating hours
      const business = await this.businessService.getById(businessId)

      if (!business) {
        throw new BadRequestException('Business not found')
      }

      // Get the day of week (0 = Sunday, 1 = Monday, etc.)
      const dayOfWeek = date.getDay()
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      const currentDay = dayNames[dayOfWeek]

      // ✅ FIX: Use the correct field name and array structure
      const businessHours = business.businessHours

      if (!businessHours || businessHours.length === 0) {
        console.log(`⚠️  No business hours configured - allowing booking (assuming 24/7 operation)`)
        return true // Allow bookings when no hours configured
      }

      // ✅ FIX: Find the schedule for the current day
      const daySchedule = businessHours.find(
        schedule => schedule.day.toLowerCase() === currentDay
      )

      if (!daySchedule) {
        console.log(`⚠️  No schedule found for ${currentDay} - allowing booking`)
        return true // Allow if specific day not configured
      }

      // ✅ FIX: Check if business is open on this day
      if (!daySchedule.isOpen) {
        console.log(`❌ Business marked as closed on ${currentDay}`)
        return false
      }

      // ✅ FIX: Use correct field names from schema
      const [openHour, openMin] = (daySchedule.openTime || '09:00').split(':').map(Number)
      const [closeHour, closeMin] = (daySchedule.closeTime || '17:00').split(':').map(Number)

      // Parse requested start time
      const [reqHour, reqMin] = startTime.split(':').map(Number)

      // Convert times to minutes for easier comparison
      const openingMins = openHour * 60 + openMin
      const closingMins = closeHour * 60 + closeMin
      const requestStartMins = reqHour * 60 + reqMin
      const requestEndMins = requestStartMins + totalDuration

      console.log(`⏰ Business hours: ${openHour}:${openMin.toString().padStart(2, '0')} - ${closeHour}:${closeMin.toString().padStart(2, '0')}`)
      console.log(`📅 Requested slot: ${reqHour}:${reqMin.toString().padStart(2, '0')} - ${Math.floor(requestEndMins / 60)}:${(requestEndMins % 60).toString().padStart(2, '0')}`)

      // Check if requested time is within business hours
      const isWithinHours = requestStartMins >= openingMins && requestEndMins <= closingMins

      if (!isWithinHours) {
        console.log(`❌ Requested time slot is outside business hours`)
        return false
      }

      console.log(`✅ Time slot is available within business hours`)
      return true

    } catch (error) {
      console.error(`❌ Error checking business hours: ${error.message}`)
      return false
    }
  }

  /**
   * Check for conflicting bookings at the same time slot
   * Prevents double-booking by checking existing confirmed/pending bookings
   */
  private async checkForConflictingBookings(
    businessId: string,
    date: Date,
    startTime: string,
    totalDuration: number
  ): Promise<boolean> {
    try {
      // Parse requested time slot
      const [reqHour, reqMin] = startTime.split(':').map(Number)
      const requestStartMins = reqHour * 60 + reqMin
      const requestEndMins = requestStartMins + totalDuration

      // Create date range for the booking day
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      console.log(`🔍 Checking for conflicts on ${date.toISOString().split('T')[0]} from ${startTime} (${totalDuration} mins)`)

      // Find all bookings for this business on this date
      // Only consider bookings that are not cancelled/expired
      const result = await this.bookingService.getBookings({
        businessId,
        startDate: startOfDay,
        endDate: endOfDay,
        status: ['pending', 'confirmed', 'payment_pending', 'paid']
      })

      const existingBookings = result.bookings

      if (!existingBookings || existingBookings.length === 0) {
        console.log(`✅ No existing bookings found for this date`)
        return false // No conflicts
      }

      console.log(`📋 Found ${existingBookings.length} existing booking(s) on this date`)

      // Check each existing booking for time overlap
      for (const booking of existingBookings) {
        const existingStart = booking.preferredStartTime
        const existingDuration = booking.totalDuration || 60

        const [existingHour, existingMin] = existingStart.split(':').map(Number)
        const existingStartMins = existingHour * 60 + existingMin
        const existingEndMins = existingStartMins + existingDuration

        console.log(`  📌 Existing booking ${booking.bookingNumber}: ${existingStart} - ${Math.floor(existingEndMins / 60)}:${(existingEndMins % 60).toString().padStart(2, '0')}`)

        // Check for overlap
        // Two time slots overlap if:
        // (StartA < EndB) AND (EndA > StartB)
        const hasOverlap = (requestStartMins < existingEndMins) && (requestEndMins > existingStartMins)

        if (hasOverlap) {
          console.log(`  ❌ CONFLICT DETECTED with booking ${booking.bookingNumber}`)
          return true // Conflict found
        }
      }

      console.log(`✅ No time conflicts found`)
      return false // No conflicts

    } catch (error) {
      console.error(`❌ Error checking for conflicting bookings: ${error.message}`)
      // Be conservative - if we can't check, assume there might be a conflict
      return true
    }
  }

  private async handlePaymentFailure(
    bookingId: string,
    transactionReference: string,
    errorMessage: string
  ): Promise<void> {
    // 1. Update booking status
    await this.bookingService.updateBookingStatus(bookingId, 'payment_failed')

    // 2. Create failed payment record
    const booking = await this.bookingService.getBookingById(bookingId)

    const payment = await this.paymentService.createFailedPayment({
      bookingId,
      transactionReference,
      errorMessage,
      clientId: booking.clientId.toString(),
      businessId: booking.businessId.toString(),
      amount: booking.estimatedTotal
    })

    // Parse booking date
    const bookingDate = this.parseDate(booking.preferredDate)

    // 3. Send failure notification
    await this.notificationService.notifyPaymentFailed(
      payment._id.toString(),
      booking.clientId.toString(),
      booking.businessId.toString(),
      {
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
      }
    )
  }

  private async handleUnavailableSlot(booking: any, transactionReference: string): Promise<void> {
    // Update booking status
    await this.bookingService.updateBookingStatus(booking._id.toString(), 'slot_unavailable')

    // Initiate refund (integrate with your payment provider's refund API)
    await this.paymentService.initiateRefund(booking.businessId.toString(), transactionReference, booking.estimatedTotal)

    // Parse booking date
    const bookingDate = this.parseDate(booking.preferredDate)

    // Notify client
    await this.notificationService.notifySlotUnavailableRefund(
      booking._id.toString(),
      booking.clientId.toString(),
      booking.businessId.toString(),
      {
        clientName: booking.clientName,
        serviceName: booking.services.map(s => s.serviceName).join(', '),
        date: bookingDate.toDateString(),
        time: booking.preferredStartTime,
        businessName: booking.businessName,
        businessPhone: booking.businessPhone || 'N/A',
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone
      }
    )
  }

  private async getServicesDetails(serviceIds: string[]): Promise<any[]> {
    return await this.serviceService.getServicesByIds(serviceIds)
  }

  private calculateTotalDuration(services: any[]): number {
    return services.reduce((total, service) => {
      const duration = service.pricingAndDuration.duration.servicingTime
      const minutes = duration.unit === 'h' ? duration.value * 60 : duration.value
      return total + minutes
    }, 0)
  }

  private calculateTotalPrice(services: any[]): number {
    return services.reduce((total, service) => {
      return total + service.pricingAndDuration.price.amount
    }, 0)
  }

  private getServiceDurationInMinutes(service: any): number {
    const duration = service.pricingAndDuration.duration.servicingTime
    return duration.unit === 'h' ? duration.value * 60 : duration.value
  }

  private addMinutesToTime(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + mins + minutes
    const newHours = Math.floor(totalMinutes / 60)
    const newMins = totalMinutes % 60
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
  }

  private getPreferredStaff(service: any): Types.ObjectId | undefined {
    if (service.teamMembers.allTeamMembers) return undefined

    const availableMembers = service.teamMembers.selectedMembers.filter(m => m.selected)
    return availableMembers.length > 0 ? availableMembers[0].id : undefined
  }

  async handlePaymentAndComplete(
    bookingId: string,
    transactionReference: string,
    paymentData: {
      amount: number
      method: string
      gateway: string
      clientId: string
      businessId: string,
      paymentType?: 'full' | 'deposit' | 'remaining'
    }
  ): Promise<PaymentResult> {
    try {
      const booking = await this.bookingService.getBookingById(bookingId)

      if (!booking) {
        throw new NotFoundException('Booking not found')
      }

      const isDepositPayment = paymentData.paymentType === 'deposit'
      const isRemainingPayment = paymentData.paymentType === 'remaining'

      // ✅ Transform booking source early for use in commission calculations
      const bookingSourceDto = this.transformBookingSourceToDto(booking.bookingSource);

      if (isDepositPayment) {
        if (!booking.requiresDeposit) {
          throw new BadRequestException('This booking does not require a deposit')
        }

        if (paymentData.amount !== booking.depositAmount) {
          throw new BadRequestException(
            `Deposit amount must be ₦${booking.depositAmount}`
          )
        }

        await this.bookingService.updateBooking(bookingId, {
          depositPaid: true,
          depositTransactionId: transactionReference,
          remainingAmount: booking.estimatedTotal - booking.depositAmount,
          status: 'deposit_paid'
        })

        const payment = await this.paymentService.createPaymentFromBooking(
          booking,
          transactionReference,
          {
            paymentMethod: paymentData.method,
            gateway: paymentData.gateway,
            status: 'completed',
            amount: paymentData.amount,
            paymentType: 'deposit'
          }
        )

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
        }
      }

      if (isRemainingPayment) {
        if (!booking.depositPaid) {
          throw new BadRequestException('Deposit must be paid first')
        }

        if (paymentData.amount !== booking.remainingAmount) {
          throw new BadRequestException(
            `Remaining amount must be ₦${booking.remainingAmount}`
          )
        }
      }

      const allowedStatuses = ['pending', 'payment_failed', 'deposit_paid']
      if (!allowedStatuses.includes(booking.status)) {
        throw new BadRequestException(
          `Cannot process payment for booking with status '${booking.status}'. ` +
          `Payment can only be processed for bookings with status 'pending', 'payment_failed', or 'deposit_paid'.`
        )
      }

      if (booking.status === 'payment_failed') {
        console.log('🔄 This is a payment retry - resetting booking status to pending')
        await this.bookingService.updateBookingStatus(bookingId, 'pending')
      }

      // ✅ Fix: For remaining payments, validate against remaining amount, not total
      if (isRemainingPayment) {
        if (paymentData.amount !== booking.remainingAmount) {
          throw new BadRequestException(
            `Payment amount (${paymentData.amount}) does not match remaining amount (${booking.remainingAmount})`
          )
        }
      } else if (!isDepositPayment && paymentData.amount !== booking.estimatedTotal) {
        throw new BadRequestException(
          `Payment amount (${paymentData.amount}) does not match booking total (${booking.estimatedTotal})`
        )
      }

      const bookingDate = this.parseDate(booking.preferredDate)

      const isStillAvailable = await this.checkAvailabilityForAllServices(
        booking.businessId.toString(),
        booking.services.map(s => s.serviceId.toString()),
        bookingDate,
        booking.preferredStartTime,
        booking.totalDuration
      )

      if (!isStillAvailable) {
        console.warn('⚠️ Time slot is no longer available')
        await this.handleUnavailableSlot(booking, transactionReference)
        throw new BadRequestException(
          'Time slot is no longer available. Payment will be refunded.'
        )
      }

      console.log('📅 Creating appointment from booking...')
      const appointmentResult = await this.confirmBookingWithoutStaff(bookingId)

      if (!appointmentResult || !appointmentResult.appointment) {
        throw new Error('Failed to create appointment from booking')
      }

      console.log('✅ Appointment created:', appointmentResult.appointmentNumber)

      const payment = await this.paymentService.createPaymentFromBooking(
        booking,
        transactionReference,
        {
          paymentMethod: paymentData.method,
          gateway: paymentData.gateway,
          status: 'completed',
          amount: paymentData.amount,
          paymentType: paymentData.paymentType || 'full'
        }
      )

      // ✅ Use transformed booking source DTO
      const commissionCalculation = await this.commissionCalculatorService
        .calculateCommission(
          bookingId,
          {
            businessId: booking.businessId.toString(),
            clientId: booking.clientId.toString(),
            totalAmount: booking.estimatedTotal,
            sourceTracking: bookingSourceDto  // ✅ Use transformed DTO
          }
        )

      if (commissionCalculation.isCommissionable) {
        await this.commissionCalculatorService.createCommissionRecord(
          bookingId,
          payment._id.toString(),
          {
            businessId: booking.businessId.toString(),
            clientId: booking.clientId.toString(),
            totalAmount: booking.estimatedTotal,
            sourceTracking: bookingSourceDto  // ✅ Use transformed DTO
          },
          commissionCalculation
        )
      }

      await this.paymentService.updatePaymentStatus(
        payment._id.toString(),
        'completed',
        transactionReference
      )

      await this.bookingService.linkAppointment(bookingId, appointmentResult.appointment._id.toString())

      const appointmentDate = this.parseDate(booking.preferredDate)

      try {
        await this.notificationService.notifyPaymentConfirmation(
          payment._id.toString(),
          paymentData.clientId,
          paymentData.businessId,
          {
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
          }
        )
      } catch (notificationError) {
        console.warn('⚠️ Notification failed (continuing):', notificationError.message)
      }

      this.eventEmitter.emit('payment.completed', {
        payment,
        booking,
        appointment: appointmentResult.appointment
      })

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
      }

    } catch (error) {
      console.error('❌ Payment processing failed:', error.message)

      try {
        await this.handlePaymentFailure(bookingId, transactionReference, error.message)
      } catch (failureError) {
        console.error('❌ Failed to handle payment failure:', failureError.message)
      }

      throw error
    }
  }

  // async handlePaymentAndComplete(
  //   bookingId: string,
  //   transactionReference: string,
  //   paymentData: {
  //     amount: number
  //     method: string
  //     gateway: string
  //     clientId: string
  //     businessId: string,
  //     paymentType?: 'full' | 'deposit' | 'remaining'
  //   }
  // ): Promise<PaymentResult> {
  //   try {
  //     const booking = await this.bookingService.getBookingById(bookingId)

  //     if (!booking) {
  //       throw new NotFoundException('Booking not found')
  //     }

  //     const isDepositPayment = paymentData.paymentType === 'deposit'
  //     const isRemainingPayment = paymentData.paymentType === 'remaining'

  //     if (isDepositPayment) {
  //       if (!booking.requiresDeposit) {
  //         throw new BadRequestException('This booking does not require a deposit')
  //       }

  //       if (paymentData.amount !== booking.depositAmount) {
  //         throw new BadRequestException(
  //           `Deposit amount must be ₦${booking.depositAmount}`
  //         )
  //       }

  //       await this.bookingService.updateBooking(bookingId, {
  //         depositPaid: true,
  //         depositTransactionId: transactionReference,
  //         remainingAmount: booking.estimatedTotal - booking.depositAmount,
  //         status: 'deposit_paid'
  //       })

  //       const payment = await this.paymentService.createPaymentFromBooking(
  //         booking,
  //         transactionReference,
  //         {
  //           paymentMethod: paymentData.method,
  //           gateway: paymentData.gateway,
  //           status: 'completed',
  //           amount: paymentData.amount,
  //           paymentType: 'deposit'
  //         }
  //       )

  //       return {
  //         paymentId: payment._id.toString(),
  //         success: true,
  //         message: 'Deposit paid successfully. Please pay remaining amount before appointment.',
  //         transactionReference,
  //         amount: paymentData.amount,
  //         method: paymentData.method,
  //         gateway: paymentData.gateway,
  //         status: 'deposit_completed',
  //         payment,
  //         appointment: null,
  //         remainingAmount: booking.estimatedTotal - booking.depositAmount
  //       }
  //     }

  //     if (isRemainingPayment) {
  //       if (!booking.depositPaid) {
  //         throw new BadRequestException('Deposit must be paid first')
  //       }

  //       if (paymentData.amount !== booking.remainingAmount) {
  //         throw new BadRequestException(
  //           `Remaining amount must be ₦${booking.remainingAmount}`
  //         )
  //       }
  //     }

  //     const allowedStatuses = ['pending', 'payment_failed', 'deposit_paid']
  //     if (!allowedStatuses.includes(booking.status)) {
  //       throw new BadRequestException(
  //         `Cannot process payment for booking with status '${booking.status}'. ` +
  //         `Payment can only be processed for bookings with status 'pending', 'payment_failed', or 'deposit_paid'.`
  //       )
  //     }

  //     if (booking.status === 'payment_failed') {
  //       console.log('🔄 This is a payment retry - resetting booking status to pending')
  //       await this.bookingService.updateBookingStatus(bookingId, 'pending')
  //     }

  //     if (!isDepositPayment && paymentData.amount !== booking.estimatedTotal) {
  //       throw new BadRequestException(
  //         `Payment amount (${paymentData.amount}) does not match booking total (${booking.estimatedTotal})`
  //       )
  //     }

  //     const bookingDate = this.parseDate(booking.preferredDate)

  //     const isStillAvailable = await this.checkAvailabilityForAllServices(
  //       booking.businessId.toString(),
  //       booking.services.map(s => s.serviceId.toString()),
  //       bookingDate,
  //       booking.preferredStartTime,
  //       booking.totalDuration
  //     )

  //     if (!isStillAvailable) {
  //       console.warn('⚠️ Time slot is no longer available')
  //       await this.handleUnavailableSlot(booking, transactionReference)
  //       throw new BadRequestException(
  //         'Time slot is no longer available. Payment will be refunded.'
  //       )
  //     }

  //     console.log('📅 Creating appointment from booking...')
  //     const appointmentResult = await this.confirmBookingWithoutStaff(bookingId)

  //     if (!appointmentResult || !appointmentResult.appointment) {
  //       throw new Error('Failed to create appointment from booking')
  //     }

  //     console.log('✅ Appointment created:', appointmentResult.appointmentNumber)

  //     const payment = await this.paymentService.createPaymentFromBooking(
  //       booking,
  //       transactionReference,
  //       {
  //         paymentMethod: paymentData.method,
  //         gateway: paymentData.gateway,
  //         status: 'completed',
  //         amount: paymentData.amount,
  //         paymentType: paymentData.paymentType || 'full'
  //       }
  //     )

  //     const commissionCalculation = await this.commissionCalculatorService
  //       .calculateCommission(
  //         bookingId,
  //         {
  //           businessId: booking.businessId.toString(),
  //           clientId: booking.clientId.toString(),
  //           totalAmount: booking.estimatedTotal,
  //           sourceTracking: booking.bookingSource
  //         }
  //       )

  //     if (commissionCalculation.isCommissionable) {
  //       await this.commissionCalculatorService.createCommissionRecord(
  //         bookingId,
  //         payment._id.toString(),
  //         {
  //           businessId: booking.businessId.toString(),
  //           clientId: booking.clientId.toString(),
  //           totalAmount: booking.estimatedTotal,
  //           sourceTracking: booking.bookingSource
  //         },
  //         commissionCalculation
  //       )
  //     }

  //     await this.paymentService.updatePaymentStatus(
  //       payment._id.toString(),
  //       'completed',
  //       transactionReference
  //     )

  //     await this.bookingService.linkAppointment(bookingId, appointmentResult.appointment._id.toString())

  //     const appointmentDate = this.parseDate(booking.preferredDate)

  //     try {
  //       await this.notificationService.notifyPaymentConfirmation(
  //         payment._id.toString(),
  //         paymentData.clientId,
  //         paymentData.businessId,
  //         {
  //           clientName: booking.clientName,
  //           amount: paymentData.amount,
  //           method: paymentData.method,
  //           gateway: paymentData.gateway,
  //           transactionId: transactionReference,
  //           serviceName: booking.services.map(s => s.serviceName).join(', '),
  //           appointmentDate: appointmentDate.toDateString(),
  //           businessName: booking.businessName,
  //           receiptUrl: `${process.env.APP_URL}/receipts/${payment._id}`,
  //           clientEmail: booking.clientEmail,
  //           clientPhone: booking.clientPhone
  //         }
  //       )
  //     } catch (notificationError) {
  //       console.warn('⚠️ Notification failed (continuing):', notificationError.message)
  //     }

  //     this.eventEmitter.emit('payment.completed', {
  //       payment,
  //       booking,
  //       appointment: appointmentResult.appointment
  //     })

  //     return {
  //       paymentId: payment._id.toString(),
  //       success: true,
  //       message: booking.status === 'payment_failed'
  //         ? 'Payment retry successful! Your appointment has been confirmed.'
  //         : 'Payment successful! Your appointment has been confirmed.',
  //       transactionReference,
  //       amount: paymentData.amount,
  //       method: paymentData.method,
  //       gateway: paymentData.gateway,
  //       status: 'completed',
  //       payment,
  //       appointment: appointmentResult.appointment
  //     }

  //   } catch (error) {
  //     console.error('❌ Payment processing failed:', error.message)

  //     try {
  //       await this.handlePaymentFailure(bookingId, transactionReference, error.message)
  //     } catch (failureError) {
  //       console.error('❌ Failed to handle payment failure:', failureError.message)
  //     }

  //     throw error
  //   }
  // }

  // OPTIONAL: Add a method to manually reset booking status for retry
  async resetBookingForPaymentRetry(bookingId: string): Promise<void> {
    const booking = await this.bookingService.getBookingById(bookingId)

    if (!booking) {
      throw new NotFoundException('Booking not found')
    }

    if (booking.status !== 'payment_failed') {
      throw new BadRequestException(
        `Cannot reset booking. Only bookings with 'payment_failed' status can be reset. Current status: ${booking.status}`
      )
    }

    // Check if booking hasn't expired
    if (booking.expiresAt && new Date() > new Date(booking.expiresAt)) {
      throw new BadRequestException('Booking has expired. Please create a new booking.')
    }

    // Reset to pending
    await this.bookingService.updateBookingStatus(bookingId, 'pending')

    console.log(`✅ Booking ${booking.bookingNumber} reset to pending for payment retry`)
  }

  // NEW METHOD: Confirm booking and create appointment WITHOUT staff assignment
  // Staff assignment is done separately after payment confirmation
  async confirmBookingWithoutStaff(bookingId: string): Promise<AppointmentResult> {
    console.log('=== ORCHESTRATOR: CONFIRM BOOKING WITHOUT STAFF ===')
    console.log('BookingId:', bookingId)

    try {
      // STEP 1: Get booking
      const booking = await this.bookingService.getBookingById(bookingId)
      console.log('✅ Booking found:', booking.bookingNumber)
      console.log('Current status:', booking.status)

      // FIX: Accept 'pending', 'payment_failed', AND 'confirmed' statuses
      const allowedStatuses = ['pending', 'payment_failed', 'confirmed']
      if (!allowedStatuses.includes(booking.status)) {
        throw new BadRequestException(
          `Cannot confirm booking. Current status is '${booking.status}'. Only 'pending', 'payment_failed' or 'confirmed' bookings can be confirmed. ` +
          `This booking may have already been expired.`
        )
      }

      // STEP 2: Update booking status to confirmed
      console.log('📝 Updating booking status to confirmed...')
      await this.bookingService.updateBookingStatus(bookingId, 'confirmed')
      console.log('✅ Booking status updated to confirmed')

      // STEP 3: Create appointment (without staff assignment)
      console.log('📅 Creating appointment from booking...')
      const appointment = await this.appointmentService.createFromBooking(booking)

      if (!appointment) {
        throw new Error('Failed to create appointment')
      }

      console.log('✅ Appointment created:', appointment.appointmentNumber)

      // STEP 3.5: Link appointment to booking
      await this.bookingService.linkAppointment(bookingId, appointment._id.toString())
      console.log('✅ Appointment linked to booking')

      console.log('Appointment details:', {
        id: appointment._id,
        number: appointment.appointmentNumber,
        date: appointment.selectedDate || appointment.scheduledDate,
        time: appointment.selectedTime || appointment.scheduledTime
      })

      // STEP 4: Send notifications (without staff notifications since no staff assigned yet)
      console.log('📧 Sending confirmation notifications')
      try {
        await this.sendClientConfirmationOnly(booking, appointment)
        console.log('✅ Client notification sent successfully')
      } catch (notificationError) {
        console.warn('⚠️ Notification sending failed (continuing):', notificationError.message)
      }

      // STEP 5: Emit events
      console.log('📡 Emitting booking events')
      this.eventEmitter.emit('booking.confirmed', {
        booking,
        appointment,
        staffAssigned: false // Indicates staff assignment pending
      })

      this.eventEmitter.emit('appointment.created', {
        appointment,
        booking,
        staffAssigned: false
      })

      console.log('✅ BOOKING CONFIRMATION COMPLETE (Staff assignment pending)')

      // STEP 6: Return success response
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
        assignment: null, // No staff assigned yet
        assignments: [] // Empty array - staff to be assigned later
      }
    } catch (error) {
      console.error('❌ BOOKING CONFIRMATION FAILED:', error.message)
      console.error('Stack:', error.stack)
      throw error
    }
  }

  // Helper method: Send confirmation to client only (no staff notifications)
  private async sendClientConfirmationOnly(booking: any, appointment: any): Promise<void> {
    const bookingDate = this.parseDate(booking.preferredDate)

    // Notify client about booking confirmation
    await this.notificationService.notifyBookingConfirmation(
      booking._id.toString(),
      booking.clientId.toString(),
      booking.businessId.toString(),
      {
        clientName: booking.clientName,
        serviceName: booking.services.map(s => s.serviceName).join(', '),
        date: bookingDate.toDateString(),
        time: booking.preferredStartTime,
        businessName: booking.businessName,
        businessAddress: booking.businessAddress || 'N/A',
        appointmentNumber: appointment.appointmentNumber,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone,
        staffCount: 0 // No staff assigned yet
      }
    )
  }

  // UPDATED: Make staff assignment truly optional
  async confirmBookingAndCreateAppointment(
    bookingId: string,
    staffId?: string,
    staffAssignments?: Array<{ staffId: string; serviceId: string; staffName?: string }>
  ): Promise<AppointmentResult> {
    console.log('=== ORCHESTRATOR: CONFIRM BOOKING START ===')
    console.log('BookingId:', bookingId)
    console.log('Single StaffId:', staffId)
    console.log('Staff Assignments:', staffAssignments?.length || 0)

    // If no staff provided, use the simpler confirmation flow
    if (!staffId && (!staffAssignments || staffAssignments.length === 0)) {
      console.log('⚠️ No staff provided - using confirmation without staff assignment')
      return await this.confirmBookingWithoutStaff(bookingId)
    }

    try {
      // STEP 1: Get booking
      const booking = await this.bookingService.getBookingById(bookingId)
      console.log('✅ Booking found:', booking.bookingNumber)
      console.log('Current status:', booking.status)

      // FIX: Better status validation with specific error message
      const allowedStatuses = ['pending', 'payment_failed', 'confirmed']
      if (!allowedStatuses.includes(booking.status)) {
        throw new BadRequestException(
          `Cannot confirm booking. Current status is '${booking.status}'. Only 'pending', 'payment_failed' or 'confirmed' bookings can be confirmed. ` +
          `This booking may have already been expired.`
        )
      }

      // STEP 2: Validate that we have staff assignments (either single or multiple)
      // REMOVED: This validation is now handled earlier by checking and redirecting to confirmBookingWithoutStaff

      // STEP 3: Validate staff availability for each service
      const bookingDate = this.parseDate(booking.preferredDate)
      const dateString = this.formatDateForAvailability(bookingDate)

      let staffToValidate: Array<{ staffId: string; serviceId: string }> = []

      if (staffAssignments && staffAssignments.length > 0) {
        staffToValidate = staffAssignments.map(a => ({
          staffId: a.staffId,
          serviceId: a.serviceId
        }))
      } else if (staffId) {
        // Legacy single staff for all services
        staffToValidate = booking.services.map(s => ({
          staffId: staffId,
          serviceId: s.serviceId.toString()
        }))
      }

      // Validate each staff member's availability
      console.log(`🔍 Validating ${staffToValidate.length} staff assignments`)

      const unavailableStaff: Array<{ staffId: string; serviceName: string; reason: string }> = []

      for (const assignment of staffToValidate) {
        const service = booking.services.find(s => s.serviceId.toString() === assignment.serviceId)

        if (!service) {
          throw new BadRequestException(`Service ${assignment.serviceId} not found in booking`)
        }

        const duration = service.duration + (service.bufferTime || 0)
        const endTime = this.addMinutesToTime(booking.preferredStartTime, duration)

        const isAvailable = await this.availabilityService.checkSlotAvailability({
          businessId: booking.businessId.toString(),
          serviceId: assignment.serviceId,
          date: dateString,
          startTime: booking.preferredStartTime,
          duration: duration
        })

        if (!isAvailable) {
          unavailableStaff.push({
            staffId: assignment.staffId,
            serviceName: service.serviceName,
            reason: `Not available on ${dateString} from ${booking.preferredStartTime} to ${endTime}`
          })
          console.warn(`⚠️ Staff ${assignment.staffId} NOT available for service ${service.serviceName}`)
        } else {
          console.log(`✅ Staff ${assignment.staffId} available for service ${assignment.serviceId}`)
        }
      }

      // FIX: Return detailed error if any staff is unavailable
      if (unavailableStaff.length > 0) {
        const errorDetails = unavailableStaff
          .map(s => `${s.staffId}: ${s.serviceName} (${s.reason})`)
          .join('; ')

        throw new BadRequestException(
          `The following staff members are not available for the requested time slot: ${errorDetails}. ` +
          `Please try different staff or time slots.`
        )
      }

      // STEP 4: Update booking status to confirmed (DO THIS FIRST before any other operations)
      console.log('📝 Updating booking status to confirmed...')
      await this.bookingService.updateBookingStatus(bookingId, 'confirmed', staffId)
      console.log('✅ Booking status updated to confirmed')

      // STEP 5: Create appointment
      console.log('📅 Creating appointment from booking...')
      const appointment = await this.appointmentService.createFromBooking(booking)
      console.log('✅ Appointment created:', appointment.appointmentNumber)

      // STEP 5.5: Link appointment to booking
      await this.bookingService.linkAppointment(bookingId, appointment._id.toString())
      console.log('✅ Appointment linked to booking')

      // STEP 6: Create staff assignments
      let staffAssignmentResults: any[] = []

      if (staffAssignments && staffAssignments.length > 0) {
        // Multiple staff assignments
        console.log(`📋 Creating ${staffAssignments.length} staff assignments`)

        for (const assignment of staffAssignments) {
          try {
            const service = booking.services.find(
              s => s.serviceId.toString() === assignment.serviceId
            )

            if (!service) {
              console.warn(`⚠️ Service ${assignment.serviceId} not found`)
              continue
            }

            const duration = service.duration
            const endTime = this.addMinutesToTime(booking.preferredStartTime, duration)

            console.log(`📌 Assigning staff ${assignment.staffId} to service ${service.serviceName}`)
            console.log(`   Time: ${booking.preferredStartTime} - ${endTime} (${duration} mins)`)

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
            })

            staffAssignmentResults.push({
              staffId: assignment.staffId,
              serviceId: assignment.serviceId,
              staffName: assignment.staffName,
              status: 'assigned',
              ...result
            })

            console.log(`✅ Successfully assigned staff ${assignment.staffId}`)
          } catch (error) {
            console.error(`❌ Failed to assign staff ${assignment.staffId}:`, error.message)

            // Log the error but continue with other staff
            staffAssignmentResults.push({
              staffId: assignment.staffId,
              serviceId: assignment.serviceId,
              staffName: assignment.staffName,
              error: error.message,
              status: 'failed'
            })
          }
        }
      } else if (staffId) {
        // Single staff assignment (legacy)
        console.log(`📋 Single staff assignment: ${staffId}`)

        try {
          const result = await this.staffService.autoAssignStaff(
            booking.businessId.toString(),
            appointment._id.toString(),
            booking.clientId.toString(),
            booking.services[0].serviceId.toString(),
            bookingDate,
            booking.preferredStartTime,
            booking.estimatedEndTime
          )

          staffAssignmentResults.push(result)
          console.log(`✅ Single staff assignment completed`)
        } catch (error) {
          console.error(`❌ Single staff assignment failed:`, error.message)
          staffAssignmentResults.push({
            staffId: staffId,
            error: error.message,
            status: 'failed'
          })
        }
      }

      // STEP 7: Send notifications (wrap in try-catch to not fail the whole operation)
      console.log('📧 Sending confirmation notifications')
      try {
        await this.sendConfirmationNotifications(booking, appointment, staffAssignmentResults)
        console.log('✅ Notifications sent successfully')
      } catch (notificationError) {
        console.warn('⚠️ Notification sending failed (continuing):', notificationError.message)
        // Don't throw - notifications failing shouldn't fail the booking
      }

      // STEP 8: Emit events
      console.log('📡 Emitting booking events')
      this.eventEmitter.emit('booking.confirmed', {
        booking,
        staffId,
        staffAssignments: staffAssignmentResults,
        appointment
      })

      this.eventEmitter.emit('appointment.created', {
        appointment,
        booking,
        staffAssignments: staffAssignmentResults
      })

      console.log('✅ BOOKING CONFIRMATION COMPLETE')

      // STEP 9: Return success response
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
      }
    } catch (error) {
      console.error('❌ BOOKING CONFIRMATION FAILED:', error.message)
      console.error('Stack:', error.stack)
      throw error
    }
  }

  // NEW: Add comprehensive staff availability setup when a staff member is added to a business
  async setupDefaultStaffAvailability(
    businessId: string,
    staffId: string,
    createdBy: string
  ): Promise<void> {
    console.log(`🌐 Setting up 24/7 availability for staff ${staffId}`)

    try {
      // Create 24/7 availability for next 365 days
      const today = new Date()
      const endDate = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000) // 365 days ahead

      await this.availabilityService.setupStaffAvailability24x7(
        businessId,
        staffId,
        today,
        endDate,
        createdBy
      )

      console.log(`✅ Successfully setup 24/7 availability for staff`)
    } catch (error) {
      console.error(`❌ Failed to setup staff availability:`, error.message)
      throw error
    }
  }

  // NEW: Enhanced error messages for staff availability
  private async validateAndReportStaffAvailability(
    staffAssignments: Array<{ staffId: string; serviceId: string; staffName?: string }>,
    booking: any,
    availabilityService: any
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = []

    for (const assignment of staffAssignments) {
      const service = booking.services.find(
        s => s.serviceId.toString() === assignment.serviceId
      )

      if (!service) {
        errors.push(`Service not found: ${assignment.serviceId}`)
        continue
      }

      const duration = service.duration + (service.bufferTime || 0)
      const endTime = this.addMinutesToTime(booking.preferredStartTime, duration)
      const dateString = this.formatDateForAvailability(this.parseDate(booking.preferredDate))

      // Check staff availability
      const isAvailable = await availabilityService.checkSlotAvailability({
        businessId: booking.businessId.toString(),
        serviceId: assignment.serviceId,
        date: dateString,
        startTime: booking.preferredStartTime,
        duration: duration
      })

      if (!isAvailable) {
        errors.push(
          `${assignment.staffName || 'Staff'} (${assignment.staffId}) is not available for ${service.serviceName} ` +
          `on ${booking.preferredDate} from ${booking.preferredStartTime} to ${endTime}`
        )
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
