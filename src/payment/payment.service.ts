import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { Payment, PaymentDocument } from "./schemas/payment.schema";
import { Booking, BookingDocument } from "../booking/schemas/booking.schema";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { ApiResponse } from "../common/interfaces/common.interface";
import { PaymentQueryDto } from "./dto/payment-query.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { NotificationService } from '../notification/notification.service';
import { PricingService } from '../pricing/pricing.service';
import { CommissionService } from '../commission/services/commission.service';
import { GatewayManagerService } from '../integration/gateway-manager.service';
import { JobsService } from '../jobs/jobs.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class PaymentService {
  private readonly paystackSecretKey: string;
  private readonly paystackBaseUrl = 'https://api.paystack.co';

  constructor(
    @InjectModel(Payment.name) 
    private paymentModel: Model<PaymentDocument>,
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    private notificationService: NotificationService,
    private configService: ConfigService,
    private pricingService: PricingService,
    private commissionService: CommissionService,
    private gatewayManager: GatewayManagerService,
    private jobsService: JobsService,
    private cacheService: CacheService,
  ) {
    this.paystackSecretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
  }

  // ========================================
  // NEW MULTI-GATEWAY PAYMENT INITIALIZATION
  // ========================================
  async initializePayment(data: {
    email: string;
    amount: number;
    clientId: string;
    tenantId: string;
    appointmentId?: string;
    bookingId?: string;
    gateway?: string;
    metadata?: any;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('🚀 Initializing payment with data:', {
        email: data.email,
        amount: data.amount,
        clientId: data.clientId,
        tenantId: data.tenantId,
        gateway: data.gateway || 'paystack',
      });

      // Calculate fees using pricing service
      const feeCalculation = await this.pricingService.calculateFees(
        data.tenantId,
        data.amount,
      );

      console.log('💰 Fee calculation:', feeCalculation);

      // Generate payment reference
      const paymentReference = await this.generatePaymentReference();

      // Determine gateway (default to paystack for backward compatibility)
      const gateway = data.gateway || 'paystack';

      // Get frontend URL
      const frontendUrl = this.configService.get('FRONTEND_URL') 
                       || this.configService.get('APP_URL') 
                       || 'http://localhost:3001';

      // Prepare metadata with fee information
      const enrichedMetadata = {
        ...data.metadata,
        clientId: data.clientId,
        tenantId: data.tenantId,
        appointmentId: data.appointmentId,
        bookingId: data.bookingId,
        paymentReference,
        feeCalculation,
        callback_url: `${frontendUrl}/payment/callback`,
      };

      // Use gateway manager to process payment
      const gatewayResponse = await this.gatewayManager.processPayment(
        gateway,
        data.amount,
        {
          email: data.email,
          metadata: enrichedMetadata,
          reference: paymentReference,
        },
      );

      // Process payment items from metadata
      const paymentItems = this.buildPaymentItems(data.metadata, data.amount);

      console.log(`💳 Creating payment record with ${paymentItems.length} items`);

      // Create pending payment record with proper field mapping
      const paymentData: any = {
        clientId: new Types.ObjectId(data.clientId),
        appointmentId: data.appointmentId ? new Types.ObjectId(data.appointmentId) : undefined,
        bookingId: data.bookingId ? new Types.ObjectId(data.bookingId) : undefined,
        businessId: data.tenantId ? new Types.ObjectId(data.tenantId) : undefined,
        paymentReference,
        items: paymentItems,
        subtotal: feeCalculation.bookingAmount,
        totalAmount: data.amount,
        paymentMethod: 'online',
        gateway,
        status: 'pending',
        gatewayResponse: JSON.stringify(gatewayResponse),
        metadata: enrichedMetadata,
      };

      // Add platformFee and businessReceives if they exist in schema
      if (feeCalculation.totalPlatformFee !== undefined) {
        paymentData.platformFee = feeCalculation.totalPlatformFee;
      }
      if (feeCalculation.businessReceives !== undefined) {
        paymentData.businessReceives = feeCalculation.businessReceives;
      }

      const payment = new this.paymentModel(paymentData);
      await payment.save();

      console.log('✅ Payment initialized successfully:', {
        paymentId: payment._id,
        reference: paymentReference,
        gateway,
      });

      return {
        success: true,
        data: {
          authorizationUrl: gatewayResponse.authorization_url || gatewayResponse.authorizationUrl,
          accessCode: gatewayResponse.access_code || gatewayResponse.accessCode,
          reference: paymentReference,
          paymentId: payment._id.toString(),
          feeBreakdown: feeCalculation,
        },
        message: 'Payment initialized successfully',
      };
    } catch (error) {
      console.error('❌ Payment initialization error:', error.message);
      throw new BadRequestException(`Failed to initialize payment: ${error.message}`);
    }
  }

  // ========================================
  // VERIFY PAYMENT (Multi-Gateway Support)
  // ========================================
  async verifyPayment(reference: string): Promise<ApiResponse<Payment>> {
    try {
      // Check cache first
      const cacheKey = `payment:verified:${reference}`;
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        console.log('✅ Payment verification from cache');
        return cached;
      }

      // Find payment by reference
      const payment = await this.paymentModel.findOne({ paymentReference: reference });

      if (!payment) {
        throw new NotFoundException('Payment record not found');
      }

      console.log('🔍 Verifying payment:', {
        reference,
        paymentId: payment._id,
        gateway: payment.gateway,
        status: payment.status,
      });

      // If already completed, return cached result
      if (payment.status === 'completed') {
        const result = {
          success: true,
          data: payment,
          message: 'Payment already completed',
        };
        await this.cacheService.set(cacheKey, result, 3600);
        return result;
      }

      // Verify with gateway
      const gatewayResponse = await this.gatewayManager.verifyPayment(
        payment.gateway || 'paystack',
        reference,
      );

      console.log('🔐 Gateway verification response:', gatewayResponse.status);

      // Update payment based on gateway response
      const updateData: any = {
        gatewayResponse: JSON.stringify(gatewayResponse),
        updatedAt: new Date(),
      };

      if (gatewayResponse.status === 'success') {
        updateData.status = 'completed';
        updateData.paidAt = new Date();
        updateData.transactionId = gatewayResponse.id?.toString() || gatewayResponse.reference;

        // Update booking status to confirmed
        if (payment.bookingId) {
          try {
            const booking = await this.bookingModel.findByIdAndUpdate(
              payment.bookingId,
              {
                status: 'confirmed',
                updatedAt: new Date(),
              },
              { new: true }
            );
            console.log('✅ Booking status updated to confirmed');

            // Calculate and update booking commission
            if (booking && payment.businessId) {
              try {
                const commissionCalc = await this.commissionService.calculateBookingCommission(booking);
                
                await this.commissionService.updateBookingCommission(
                  booking._id.toString(),
                  {
                    commissionRate: commissionCalc.commissionRate,
                    commissionAmount: commissionCalc.commissionAmount,
                    platformFee: commissionCalc.platformFee,
                    processingFee: commissionCalc.processingFee,
                  }
                );
                
                console.log('✅ Commission calculated and updated');
              } catch (commissionError) {
                console.error('❌ Failed to calculate commission:', commissionError);
              }
            }
          } catch (bookingError) {
            console.error('❌ Failed to update booking status:', bookingError);
          }
        }

        // Schedule payout job - use payment amount minus fees
        if (payment.businessId && payment.totalAmount) {
          try {
            // Calculate business receives amount
            const platformFee = (payment as any).platformFee || payment.totalAmount * 0.05;
            const businessReceivesAmount = payment.totalAmount - platformFee;
            
            await this.jobsService.schedulePayout(
              payment.businessId.toString(),
              businessReceivesAmount,
              'weekly',
            );
            console.log('✅ Payout job scheduled');
          } catch (payoutError) {
            console.error('❌ Failed to schedule payout:', payoutError);
          }
        }

        // Send payment confirmation notification
        try {
          await this.notificationService.notifyPaymentConfirmation(
            payment._id.toString(),
            payment.clientId.toString(),
            payment.businessId?.toString() || '',
            {
              clientName: gatewayResponse.customer?.name || 'Customer',
              amount: payment.totalAmount,
              method: payment.paymentMethod,
              transactionId: updateData.transactionId,
              serviceName: payment.items.map(item => item.itemName).join(', '),
              appointmentDate: payment.metadata?.preferredDate,
              businessName: payment.metadata?.businessName || 'Business',
              receiptUrl: `${this.configService.get('FRONTEND_URL')}/receipts/${payment._id}`,
              clientEmail: gatewayResponse.customer?.email || payment.metadata?.clientEmail,
              clientPhone: payment.metadata?.clientPhone,
            }
          );
          console.log('✅ Payment confirmation notification sent');
        } catch (notificationError) {
          console.error('❌ Failed to send notification:', notificationError);
        }

      } else if (gatewayResponse.status === 'failed') {
        updateData.status = 'failed';
        
        // Update booking status to payment_failed
        if (payment.bookingId) {
          try {
            await this.bookingModel.findByIdAndUpdate(
              payment.bookingId,
              {
                status: 'payment_failed',
                updatedAt: new Date(),
              }
            );
            console.log('✅ Booking status updated to payment_failed');
          } catch (bookingError) {
            console.error('❌ Failed to update booking status:', bookingError);
          }
        }
      } else {
        updateData.status = 'processing';
      }

      // Update payment record
      const updatedPayment = await this.paymentModel.findByIdAndUpdate(
        payment._id,
        updateData,
        { new: true, runValidators: true }
      )
        .populate('clientId', 'firstName lastName email')
        .populate('bookingId')
        .exec();

      console.log('✅ Payment updated:', {
        paymentId: updatedPayment._id,
        status: updatedPayment.status,
      });

      const result = {
        success: true,
        data: updatedPayment,
        message: `Payment ${gatewayResponse.status}`,
      };

      // Cache successful verification
      if (updatedPayment.status === 'completed') {
        await this.cacheService.set(cacheKey, result, 3600);
      }

      return result;

    } catch (error) {
      console.error('❌ Payment verification error:', error.message);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      if (axios.isAxiosError(error)) {
        throw new BadRequestException(
          error.response?.data?.message || 'Failed to verify payment'
        );
      }
      
      throw new BadRequestException(`Failed to verify payment: ${error.message}`);
    }
  }

  // ========================================
  // WEBHOOK HANDLER
  // ========================================
  async handleWebhook(payload: any, signature: string, source: string): Promise<void> {
    try {
      // Verify webhook signature
      const crypto = require('crypto');
      const hash = crypto
        .createHmac('sha512', this.paystackSecretKey)
        .update(JSON.stringify(payload))
        .digest('hex');

      if (hash !== signature) {
        throw new BadRequestException('Invalid webhook signature');
      }

      console.log(`📨 Processing ${source} webhook:`, payload.event);

      const event = payload.event;

      switch (event) {
        case 'charge.success':
          await this.handleSuccessfulCharge(payload.data);
          break;
        case 'charge.failed':
          await this.handleFailedCharge(payload.data);
          break;
        case 'transfer.success':
        case 'transfer.failed':
          console.log(`Transfer event: ${event}`);
          break;
        default:
          console.log(`Unhandled webhook event: ${event}`);
      }
    } catch (error) {
      console.error('❌ Webhook handling error:', error);
      throw error;
    }
  }

  private async handleSuccessfulCharge(data: any): Promise<void> {
    const payment = await this.paymentModel.findOne({ 
      paymentReference: data.reference 
    });

    if (payment && payment.status !== 'completed') {
      await this.paymentModel.findByIdAndUpdate(payment._id, {
        status: 'completed',
        transactionId: data.id.toString(),
        paidAt: new Date(),
        gatewayResponse: JSON.stringify(data),
        updatedAt: new Date(),
      });

      // Update booking if exists
      if (payment.bookingId) {
        await this.bookingModel.findByIdAndUpdate(
          payment.bookingId,
          { status: 'confirmed', updatedAt: new Date() }
        );
      }

      console.log('✅ Webhook: Payment completed');
    }
  }

  private async handleFailedCharge(data: any): Promise<void> {
    const payment = await this.paymentModel.findOne({ 
      paymentReference: data.reference 
    });

    if (payment) {
      await this.paymentModel.findByIdAndUpdate(payment._id, {
        status: 'failed',
        gatewayResponse: JSON.stringify(data),
        updatedAt: new Date(),
      });

      // Update booking if exists
      if (payment.bookingId) {
        await this.bookingModel.findByIdAndUpdate(
          payment.bookingId,
          { status: 'payment_failed', updatedAt: new Date() }
        );
      }

      console.log('✅ Webhook: Payment failed');
    }
  }

  // ========================================
  // CREATE PAYMENT FROM BOOKING
  // ========================================
  // async createPaymentFromBooking(
  //   booking: any,
  //   transactionReference: string,
  //   paymentInfo: {
  //     paymentMethod: string;
  //     gateway: string;
  //     status: string;
  //   }
  // ): Promise<any> {
  //   try {
  //     const paymentMethodMap: Record<string, string> = {
  //       'card': 'card',
  //       'bank_transfer': 'bank_transfer',
  //       'mobile_money': 'mobile_money',
  //       'crypto': 'crypto',
  //       'cash': 'cash',
  //       'online': 'online',
  //     };

  //     const mappedMethod = paymentMethodMap[paymentInfo.paymentMethod] || 'online';

  //     // Calculate fees
  //     let feeCalculation;
  //     try {
  //       feeCalculation = await this.pricingService.calculateFees(
  //         booking.businessId.toString(),
  //         booking.estimatedTotal,
  //       );
  //     } catch (feeError) {
  //       console.warn('⚠️ Fee calculation failed, using default:', feeError.message);
  //       feeCalculation = {
  //         bookingAmount: booking.estimatedTotal,
  //         totalPlatformFee: booking.estimatedTotal * 0.05,
  //         businessReceives: booking.estimatedTotal * 0.95,
  //       };
  //     }

  //     const paymentData: any = {
  //       clientId: new Types.ObjectId(booking.clientId.toString()),
  //       bookingId: new Types.ObjectId(booking._id.toString()),
  //       businessId: new Types.ObjectId(booking.businessId.toString()),
  //       paymentReference: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  //       transactionId: transactionReference,
  //       items: booking.services.map((service: any) => ({
  //         itemType: 'service',
  //         itemId: new Types.ObjectId(service.serviceId.toString()),
  //         itemName: service.serviceName,
  //         quantity: 1,
  //         unitPrice: service.price,
  //         totalPrice: service.price,
  //         discount: 0,
  //         tax: 0,
  //       })),
  //       subtotal: booking.estimatedTotal,
  //       totalTax: 0,
  //       totalDiscount: 0,
  //       totalAmount: booking.estimatedTotal,
  //       paymentMethod: mappedMethod,
  //       gateway: paymentInfo.gateway,
  //       status: paymentInfo.status || 'completed',
  //       paidAt: paymentInfo.status === 'completed' ? new Date() : undefined,
  //       metadata: {
  //         bookingNumber: booking.bookingNumber,
  //         clientName: booking.clientName,
  //         clientEmail: booking.clientEmail,
  //         serviceName: booking.services.map((s: any) => s.serviceName).join(', '),
  //       },
  //     };

  //     // Add optional fields if they exist in schema
  //     if (feeCalculation.totalPlatformFee !== undefined) {
  //       paymentData.platformFee = feeCalculation.totalPlatformFee;
  //     }
  //     if (feeCalculation.businessReceives !== undefined) {
  //       paymentData.businessReceives = feeCalculation.businessReceives;
  //     }

  //     const paymentRecord = new this.paymentModel(paymentData);
  //     await paymentRecord.save();
      
  //     console.log('✅ Payment record created:', paymentRecord._id.toString());

  //     // Calculate commission if payment completed
  //     if (paymentInfo.status === 'completed') {
  //       try {
  //         const commissionCalc = await this.commissionService.calculateBookingCommission(booking);
          
  //         await this.commissionService.updateBookingCommission(
  //           booking._id.toString(),
  //           {
  //             commissionRate: commissionCalc.commissionRate,
  //             commissionAmount: commissionCalc.commissionAmount,
  //             platformFee: commissionCalc.platformFee,
  //             processingFee: commissionCalc.processingFee,
  //           }
  //         );
          
  //         console.log('✅ Commission calculated and updated');
  //       } catch (error) {
  //         console.error('⚠️ Commission calculation failed:', error.message);
  //       }
  //     }
      
  //     return JSON.parse(JSON.stringify(paymentRecord));
  //   } catch (error: any) {
  //     console.error('❌ Failed to create payment record:', error.message);
  //     throw new BadRequestException(`Failed to create payment record: ${error.message}`);
  //   }
  // }

  // Update the createPaymentFromBooking method signature in payment.service.ts

async createPaymentFromBooking(
  booking: any,
  transactionReference: string,
  paymentInfo: {
    paymentMethod: string;
    gateway: string;
    status: string;
    amount: number;  // ✅ ADDED: Include amount in the interface
    paymentType?: 'full' | 'deposit' | 'remaining';  // ✅ ADDED: Include paymentType
  }
): Promise<any> {
  try {
    const paymentMethodMap: Record<string, string> = {
      'card': 'card',
      'bank_transfer': 'bank_transfer',
      'mobile_money': 'mobile_money',
      'crypto': 'crypto',
      'cash': 'cash',
      'online': 'online',
    };

    const mappedMethod = paymentMethodMap[paymentInfo.paymentMethod] || 'online';

    // Calculate fees based on the actual payment amount (not booking total)
    // This is important for deposit payments
    let feeCalculation;
    try {
      feeCalculation = await this.pricingService.calculateFees(
        booking.businessId.toString(),
        paymentInfo.amount,  // ✅ FIXED: Use paymentInfo.amount instead of booking.estimatedTotal
      );
    } catch (feeError) {
      console.warn('⚠️ Fee calculation failed, using default:', feeError.message);
      feeCalculation = {
        bookingAmount: paymentInfo.amount,
        totalPlatformFee: paymentInfo.amount * 0.05,
        businessReceives: paymentInfo.amount * 0.95,
      };
    }

    const paymentData: any = {
      clientId: new Types.ObjectId(booking.clientId.toString()),
      bookingId: new Types.ObjectId(booking._id.toString()),
      businessId: new Types.ObjectId(booking.businessId.toString()),
      paymentReference: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId: transactionReference,
      items: booking.services.map((service: any) => ({
        itemType: 'service',
        itemId: new Types.ObjectId(service.serviceId.toString()),
        itemName: service.serviceName,
        quantity: 1,
        unitPrice: service.price,
        totalPrice: service.price,
        discount: 0,
        tax: 0,
      })),
      subtotal: paymentInfo.amount,  // ✅ FIXED: Use actual payment amount
      totalTax: 0,
      totalDiscount: 0,
      totalAmount: paymentInfo.amount,  // ✅ FIXED: Use actual payment amount
      paymentMethod: mappedMethod,
      gateway: paymentInfo.gateway,
      status: paymentInfo.status || 'completed',
      paidAt: paymentInfo.status === 'completed' ? new Date() : undefined,
      metadata: {
        bookingNumber: booking.bookingNumber,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        serviceName: booking.services.map((s: any) => s.serviceName).join(', '),
        paymentType: paymentInfo.paymentType || 'full',  // ✅ ADDED: Track payment type
        bookingTotal: booking.estimatedTotal,  // ✅ ADDED: Track original booking total
      },
    };

    // Add optional fields if they exist in schema
    if (feeCalculation.totalPlatformFee !== undefined) {
      paymentData.platformFee = feeCalculation.totalPlatformFee;
    }
    if (feeCalculation.businessReceives !== undefined) {
      paymentData.businessReceives = feeCalculation.businessReceives;
    }

    const paymentRecord = new this.paymentModel(paymentData);
    await paymentRecord.save();
    
    console.log('✅ Payment record created:', {
      paymentId: paymentRecord._id.toString(),
      amount: paymentInfo.amount,
      type: paymentInfo.paymentType || 'full',
      bookingTotal: booking.estimatedTotal,
    });

    // Calculate commission if payment completed
    if (paymentInfo.status === 'completed') {
      try {
        const commissionCalc = await this.commissionService.calculateBookingCommission(booking);
        
        await this.commissionService.updateBookingCommission(
          booking._id.toString(),
          {
            commissionRate: commissionCalc.commissionRate,
            commissionAmount: commissionCalc.commissionAmount,
            platformFee: commissionCalc.platformFee,
            processingFee: commissionCalc.processingFee,
          }
        );
        
        console.log('✅ Commission calculated and updated');
      } catch (error) {
        console.error('⚠️ Commission calculation failed:', error.message);
      }
    }
    
    return JSON.parse(JSON.stringify(paymentRecord));
  } catch (error: any) {
    console.error('❌ Failed to create payment record:', error.message);
    throw new BadRequestException(`Failed to create payment record: ${error.message}`);
  }
}

  // ========================================
  // CREATE FAILED PAYMENT
  // ========================================
  async createFailedPayment(data: {
    bookingId: string;
    transactionReference: string;
    errorMessage: string;
    clientId: string;
    businessId: string;
    amount: number;
  }): Promise<any> {
    try {
      const failedPaymentData = {
        clientId: new Types.ObjectId(data.clientId),
        bookingId: new Types.ObjectId(data.bookingId),
        businessId: new Types.ObjectId(data.businessId),
        paymentReference: `PAY-FAILED-${Date.now()}`,
        transactionId: data.transactionReference,
        subtotal: data.amount,
        totalAmount: data.amount,
        paymentMethod: 'online',
        gateway: 'unknown',
        status: 'failed',
        metadata: {
          failureReason: data.errorMessage,
        },
      };

      const failedPayment = new this.paymentModel(failedPaymentData);
      await failedPayment.save();
      
      console.log('✅ Failed payment record created');
      
      return JSON.parse(JSON.stringify(failedPayment));
    } catch (error: any) {
      console.error('❌ Failed to create failed payment record:', error.message);
      throw new BadRequestException(`Failed to create failed payment record: ${error.message}`);
    }
  }

  // ========================================
  // CREATE PAYMENT FOR APPOINTMENT
  // ========================================
  async createPaymentForAppointment(appointment: any): Promise<any> {
    try {
      const paymentData = {
        appointmentId: appointment._id,
        clientId: appointment.clientId,
        businessId: appointment.businessInfo.businessId,
        amount: appointment.paymentDetails.total.amount,
        currency: appointment.paymentDetails.total.currency,
        paymentMethod: appointment.paymentDetails.paymentMethod,
        status: 'completed',
        transactionDate: new Date(),
        description: `Payment for ${appointment.serviceDetails.serviceName}`,
        serviceDetails: {
          serviceName: appointment.serviceDetails.serviceName,
          serviceDescription: appointment.serviceDetails.serviceDescription,
        },
        metadata: {
          appointmentNumber: appointment.appointmentNumber,
          appointmentDate: appointment.selectedDate,
          appointmentTime: appointment.selectedTime,
        },
      };

      const payment = new this.paymentModel(paymentData);
      const savedPayment = await payment.save();

      // Send notification
      try {
        await this.notificationService.notifyPaymentConfirmation(
          savedPayment._id.toString(),
          appointment.clientId.toString(),
          appointment.businessInfo.businessId,
          {
            clientName: appointment.clientId,
            amount: paymentData.amount,
            method: paymentData.paymentMethod,
            transactionId: savedPayment._id.toString(),
            serviceName: appointment.serviceDetails.serviceName,
            appointmentDate: appointment.selectedDate,
            businessName: appointment.businessInfo.businessName,
            receiptUrl: `${this.configService.get('FRONTEND_URL')}/receipts/${savedPayment._id}`,
            clientEmail: appointment.clientEmail,
            clientPhone: appointment.clientPhone,
          }
        );
      } catch (notificationError) {
        console.error('⚠️ Notification failed:', notificationError);
      }

      return savedPayment;
    } catch (error) {
      console.error('❌ Error creating payment for appointment:', error);
      throw error;
    }
  }

  // ========================================
  // UPDATE PAYMENT STATUS
  // ========================================
  async updatePaymentStatus(
    paymentId: string,
    status: 'completed' | 'failed' | 'pending' | 'cancelled' | 'refunded',
    transactionReference: string
  ): Promise<any> {
    try {
      const updateData: any = {
        status,
        transactionId: transactionReference,
        updatedAt: new Date(),
      };
      
      if (status === 'completed') {
        updateData.paidAt = new Date();
      }

      const payment = await this.paymentModel.findByIdAndUpdate(
        paymentId,
        updateData,
        { new: true }
      ).exec();

      if (!payment) {
        throw new NotFoundException(`Payment ${paymentId} not found`);
      }

      // Clear cache
      if (payment.paymentReference) {
        await this.cacheService.del(`payment:verified:${payment.paymentReference}`);
      }

      console.log('✅ Payment status updated:', status);
      return JSON.parse(JSON.stringify(payment));
    } catch (error: any) {
      console.error('❌ Failed to update payment status:', error.message);
      throw new BadRequestException(`Failed to update payment status: ${error.message}`);
    }
  }

  // ========================================
  // REFUND PAYMENT
  // ========================================
  async processRefund(id: string, refundAmount: number, refundReason: string): Promise<ApiResponse<Payment>> {
    try {
      const payment = await this.paymentModel.findById(id);

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      if (payment.status !== 'completed') {
        throw new BadRequestException('Can only refund completed payments');
      }

      const totalRefunded = (payment.refundedAmount || 0) + refundAmount;

      if (totalRefunded > payment.totalAmount) {
        throw new BadRequestException('Refund amount exceeds payment total');
      }

      // Process refund with gateway
      try {
        await this.gatewayManager.refundPayment(
          payment.gateway || 'paystack',
          payment.transactionId,
          refundAmount,
        );
      } catch (gatewayError) {
        console.error('⚠️ Gateway refund failed:', gatewayError.message);
        throw new BadRequestException(`Refund failed: ${gatewayError.message}`);
      }

      const newStatus = totalRefunded === payment.totalAmount ? 'refunded' : 'partially_refunded';

      const updatedPayment = await this.paymentModel.findByIdAndUpdate(
        id,
        {
          refundedAmount: totalRefunded,
          refundedAt: new Date(),
          refundReason,
          status: newStatus,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      // Clear cache
      if (payment.paymentReference) {
        await this.cacheService.del(`payment:verified:${payment.paymentReference}`);
      }

      console.log('✅ Refund processed successfully');

      return {
        success: true,
        data: updatedPayment,
        message: 'Refund processed successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to process refund: ${error.message}`);
    }
  }

  async initiateRefund(transactionReference: string, amount: number): Promise<void> {
    try {
      console.log(`💰 Initiating refund for transaction: ${transactionReference}`);
      
      const payment = await this.paymentModel.findOne({ transactionId: transactionReference });

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      await this.processRefund(payment._id.toString(), amount, 'Refund requested');
      
      console.log('✅ Refund initiated successfully');
    } catch (error: any) {
      console.error('❌ Failed to initiate refund:', error.message);
      throw new BadRequestException(`Failed to initiate refund: ${error.message}`);
    }
  }

  // ========================================
  // CRUD OPERATIONS
  // ========================================
  async create(createPaymentDto: CreatePaymentDto): Promise<ApiResponse<Payment>> {
    try {
      const payment = new this.paymentModel(createPaymentDto);
      const savedPayment = await payment.save();

      return {
        success: true,
        data: savedPayment,
        message: 'Payment created successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Failed to create payment: ${error.message}`);
    }
  }

  async findAll(): Promise<ApiResponse<Payment[]>> {
    try {
      const payments = await this.paymentModel
        .find()
        .populate('clientId', 'profile.firstName profile.lastName profile.email')
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: payments,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch payments: ${error.message}`);
    }
  }

  async findAllWithQuery(query: PaymentQueryDto) {
    const {
      page = 1,
      limit = 10,
      clientId,
      appointmentId,
      bookingId,
      status,
      paymentMethod,
      startDate,
      endDate,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};

    if (clientId) filter.clientId = clientId;
    if (appointmentId) filter.appointmentId = appointmentId;
    if (bookingId) filter.bookingId = bookingId;
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { paymentReference: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const payments = await this.paymentModel
      .find(filter)
      .populate('clientId', 'firstName lastName email phone')
      .populate('appointmentId', 'selectedDate selectedTime')
      .populate('bookingId', 'bookingDate startTime')
      .populate('processedBy', 'firstName lastName email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.paymentModel.countDocuments(filter).exec();

    return {
      success: true,
      data: {
        payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async findOne(id: string): Promise<ApiResponse<Payment>> {
    try {
      const payment = await this.paymentModel
        .findById(id)
        .populate('clientId', 'profile.firstName profile.lastName profile.email');

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      return {
        success: true,
        data: payment,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to fetch payment: ${error.message}`);
    }
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<ApiResponse<Payment>> {
    try {
      const payment = await this.paymentModel
        .findByIdAndUpdate(
          id,
          { ...updatePaymentDto, updatedAt: new Date() },
          { new: true }
        )
        .populate('clientId', 'firstName lastName email phone')
        .populate('processedBy', 'firstName lastName email')
        .exec();

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      return {
        success: true,
        data: payment,
        message: 'Payment updated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update payment: ${error.message}`);
    }
  }

  async updateStatus(id: string, status: string, transactionId?: string): Promise<ApiResponse<Payment>> {
    try {
      const updateData: any = { status, updatedAt: new Date() };

      if (status === 'completed') {
        updateData.paidAt = new Date();
      }

      if (transactionId) {
        updateData.transactionId = transactionId;
      }

      const payment = await this.paymentModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      return {
        success: true,
        data: payment,
        message: 'Payment status updated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update payment status: ${error.message}`);
    }
  }

  async remove(id: string): Promise<ApiResponse<void>> {
    try {
      const result = await this.paymentModel.findByIdAndDelete(id);
      
      if (!result) {
        throw new NotFoundException('Payment not found');
      }

      return {
        success: true,
        message: 'Payment deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete payment: ${error.message}`);
    }
  }

  // ========================================
  // QUERY OPERATIONS
  // ========================================
  async getPaymentByAppointment(appointmentId: string): Promise<any> {
    try {
      const payment = await this.paymentModel
        .findOne({ appointmentId: new Types.ObjectId(appointmentId) })
        .exec();

      return payment;
    } catch (error) {
      console.error('❌ Error getting payment by appointment:', error);
      return null;
    }
  }

  async getPaymentByBookingId(bookingId: string): Promise<any> {
    try {
      const payment = await this.paymentModel
        .findOne({ bookingId: new Types.ObjectId(bookingId) })
        .exec();
      
      if (!payment) {
        return null;
      }
      
      return JSON.parse(JSON.stringify(payment));
    } catch (error: any) {
      console.error('❌ Failed to get payment by booking ID:', error.message);
      return null;
    }
  }

  // ========================================
  // STATISTICS
  // ========================================
  async getPaymentStats(): Promise<ApiResponse<any>> {
    try {
      const totalPayments = await this.paymentModel.countDocuments().exec();
      const completedPayments = await this.paymentModel.countDocuments({ status: 'completed' }).exec();
      const pendingPayments = await this.paymentModel.countDocuments({ status: 'pending' }).exec();
      
      const totalRevenueResult = await this.paymentModel.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]).exec();

      const platformFeeResult = await this.paymentModel.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$platformFee' } } },
      ]).exec();

      const paymentMethodStats = await this.paymentModel.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: '$paymentMethod', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
        { $sort: { total: -1 } },
      ]);

      const gatewayStats = await this.paymentModel.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: '$gateway', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
        { $sort: { total: -1 } },
      ]);

      return {
        success: true,
        data: {
          totalPayments,
          completedPayments,
          totalRevenue: totalRevenueResult[0]?.total || 0,
          totalPlatformFees: platformFeeResult[0]?.total || 0,
          pendingPayments,
          paymentMethodStats,
          gatewayStats,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get payment stats: ${error.message}`);
    }
  }

  // ========================================
  // HELPER METHODS
  // ========================================
  private async generatePaymentReference(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `PAY-${timestamp}-${random}`;
  }

  private buildPaymentItems(metadata: any, amount: number): any[] {
    let paymentItems = [];
    
    if (metadata?.services && Array.isArray(metadata.services)) {
      console.log(`📦 Processing ${metadata.services.length} services`);
      
      paymentItems = metadata.services.map((service: any, index: number) => {
        const serviceId = service.serviceId || service._id || service.id;
        
        let itemId: Types.ObjectId;
        if (serviceId && Types.ObjectId.isValid(serviceId)) {
          itemId = new Types.ObjectId(serviceId);
        } else {
          itemId = new Types.ObjectId();
        }
        
        return {
          itemType: 'service',
          itemId,
          itemName: service.serviceName || service.name || `Service ${index + 1}`,
          quantity: service.quantity || 1,
          unitPrice: service.price || 0,
          totalPrice: service.price || 0,
          discount: service.discount || 0,
          tax: service.tax || 0,
        };
      });
    }
    
    if (paymentItems.length === 0) {
      console.log('📦 No services provided, creating default payment item');
      
      paymentItems.push({
        itemType: 'service',
        itemId: new Types.ObjectId(),
        itemName: metadata?.serviceName || 'Payment',
        quantity: 1,
        unitPrice: amount,
        totalPrice: amount,
        discount: 0,
        tax: 0,
      });
    }

    return paymentItems;
  }
}