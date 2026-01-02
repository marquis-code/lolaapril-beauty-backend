// // jobs/processors/payout.processor.ts
// import { Process, Processor } from '@nestjs/bull';
// import { Job } from 'bull';
// import { Injectable, Logger } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Payment, PaymentDocument } from '../../payment/schemas/payment.schema';
// import { Booking, BookingDocument } from '../../booking/schemas/booking.schema';
// import { GatewayManagerService } from '../../integration/gateway-manager.service';
// import { NotificationService } from '../../notification/notification.service';
// import { CommissionService } from '../../commission/services/commission.service';

// interface PayoutJobData {
//   tenantId: string;
//   amount: number;
//   period: 'daily' | 'weekly' | 'monthly';
//   startDate?: Date;
//   endDate?: Date;
// }

// interface PayoutResult {
//   success: boolean;
//   payoutId: string;
//   amount: number;
//   fees: number;
//   netAmount: number;
//   transactionId?: string;
//   error?: string;
// }

// @Processor('payouts')
// @Injectable()
// export class PayoutProcessor {
//   private readonly logger = new Logger(PayoutProcessor.name);

//   constructor(
//     @InjectModel(Payment.name)
//     private paymentModel: Model<PaymentDocument>,
//     @InjectModel(Booking.name)
//     private bookingModel: Model<BookingDocument>,
//     private gatewayManager: GatewayManagerService,
//     private notificationService: NotificationService,
//     private commissionService: CommissionService,
//   ) {}

//   @Process('process-payout')
//   async handlePayout(job: Job<PayoutJobData>): Promise<PayoutResult> {
//     const { tenantId, amount, period } = job.data;

//     try {
//       this.logger.log(`Processing payout for tenant ${tenantId}: $${amount}`);

//       // 1. Verify payout eligibility
//       const eligibility = await this.verifyPayoutEligibility(tenantId, amount);
//       if (!eligibility.eligible) {
//         throw new Error(eligibility.reason);
//       }

//       // 2. Calculate platform fees and commissions
//       const fees = await this.calculatePayoutFees(tenantId, amount);
//       const netAmount = amount - fees.totalPlatformFee;

//       // 3. Get tenant's bank account details
//       const bankDetails = await this.getTenantBankDetails(tenantId);
//       if (!bankDetails) {
//         throw new Error('Bank account details not configured');
//       }

//       // 4. Initiate transfer to business bank account
//       const transferResult = await this.initiateTransfer(
//         tenantId,
//         netAmount,
//         bankDetails,
//         period
//       );

//       // 5. Record transaction
//       const payoutRecord = await this.recordPayoutTransaction({
//         tenantId,
//         amount,
//         fees: fees.totalPlatformFee,
//         netAmount,
//         transactionId: transferResult.transactionId,
//         period,
//         status: 'completed'
//       });

//       // 6. Update payment records
//       await this.updatePaymentRecords(tenantId, payoutRecord._id);

//       // 7. Send confirmation notification
//       await this.sendPayoutConfirmation(tenantId, {
//         amount,
//         netAmount,
//         fees: fees.totalPlatformFee,
//         payoutId: payoutRecord._id.toString(),
//         transactionId: transferResult.transactionId
//       });

//       this.logger.log(`Payout completed successfully: ${payoutRecord._id}`);

//       return {
//         success: true,
//         payoutId: payoutRecord._id.toString(),
//         amount,
//         fees: fees.totalPlatformFee,
//         netAmount,
//         transactionId: transferResult.transactionId
//       };

//     } catch (error) {
//       this.logger.error(`Payout failed for tenant ${tenantId}: ${error.message}`, error.stack);
      
//       // Record failed payout
//       await this.recordFailedPayout(tenantId, amount, error.message);
      
//       // Notify tenant of failure
//       await this.sendPayoutFailureNotification(tenantId, error.message);

//       return {
//         success: false,
//         payoutId: `FAILED-${Date.now()}`,
//         amount,
//         fees: 0,
//         netAmount: 0,
//         error: error.message
//       };
//     }
//   }

//   @Process('schedule-payouts')
//   async schedulePayouts(job: Job): Promise<void> {
//     try {
//       this.logger.log('Scheduling payouts for eligible tenants');

//       // Find all tenants eligible for payout
//       const eligibleTenants = await this.findEligibleTenants();

//       this.logger.log(`Found ${eligibleTenants.length} eligible tenants`);

//       // Schedule individual payout jobs
//       for (const tenant of eligibleTenants) {
//         const payoutAmount = await this.calculateTenantPayout(tenant.tenantId);

//         if (payoutAmount > 0) {
//           await job.queue.add('process-payout', {
//             tenantId: tenant.tenantId,
//             amount: payoutAmount,
//             period: tenant.payoutSchedule || 'weekly',
//             startDate: tenant.lastPayoutDate,
//             endDate: new Date()
//           }, {
//             attempts: 3,
//             backoff: {
//               type: 'exponential',
//               delay: 60000 // 1 minute
//             }
//           });

//           this.logger.log(`Scheduled payout for tenant ${tenant.tenantId}: $${payoutAmount}`);
//         }
//       }

//     } catch (error) {
//       this.logger.error('Failed to schedule payouts', error.stack);
//       throw error;
//     }
//   }

//   // Helper methods
//   private async verifyPayoutEligibility(
//     tenantId: string,
//     amount: number
//   ): Promise<{ eligible: boolean; reason?: string }> {
//     // Check minimum payout threshold
//     const minThreshold = 100; // $100 minimum
//     if (amount < minThreshold) {
//       return {
//         eligible: false,
//         reason: `Amount below minimum threshold of $${minThreshold}`
//       };
//     }

//     // Check pending payouts
//     const pendingPayouts = await this.paymentModel.countDocuments({
//       businessId: new Types.ObjectId(tenantId),
//       status: 'pending',
//       'metadata.payoutStatus': 'processing'
//     });

//     if (pendingPayouts > 0) {
//       return {
//         eligible: false,
//         reason: 'Pending payout already in progress'
//       };
//     }

//     // Check account status
//     // In production, verify business account is active and verified
    
//     return { eligible: true };
//   }

//   private async calculatePayoutFees(
//     tenantId: string,
//     amount: number
//   ): Promise<any> {
//     // Use commission service to calculate fees
//     return await this.commissionService.calculateFees(tenantId, amount);
//   }

//   private async getTenantBankDetails(tenantId: string): Promise<any> {
//     // In production, fetch from tenant configuration
//     // This would include bank account number, routing number, etc.
//     return {
//       accountNumber: 'XXXXXXXXXX',
//       bankCode: 'XXX',
//       accountName: 'Business Account'
//     };
//   }

//   private async initiateTransfer(
//     tenantId: string,
//     amount: number,
//     bankDetails: any,
//     period: string
//   ): Promise<any> {
//     // Use gateway manager to process transfer
//     // This would vary by payment gateway (Paystack, Stripe, etc.)
//     try {
//       const gateway = 'paystack'; // Or get from tenant config
      
//       const transferResult = await this.gatewayManager.processTransfer(
//         gateway,
//         amount,
//         {
//           recipient: bankDetails.accountNumber,
//           bankCode: bankDetails.bankCode,
//           accountName: bankDetails.accountName,
//           reference: `PAYOUT-${tenantId}-${Date.now()}`,
//           reason: `${period} payout`
//         }
//       );

//       return transferResult;
//     } catch (error) {
//       this.logger.error('Transfer initiation failed', error.stack);
//       throw error;
//     }
//   }

//   private async recordPayoutTransaction(data: any): Promise<any> {
//     // Create payout record in database
//     // You might have a separate Payout schema for this
//     const payoutRecord = await this.paymentModel.create({
//       businessId: new Types.ObjectId(data.tenantId),
//       paymentReference: `PAYOUT-${Date.now()}`,
//       transactionId: data.transactionId,
//       subtotal: data.amount,
//       totalAmount: data.netAmount,
//       paymentMethod: 'bank_transfer',
//       status: data.status,
//       gateway: 'paystack',
//       metadata: {
//         type: 'payout',
//         period: data.period,
//         fees: data.fees,
//         processedAt: new Date()
//       }
//     });

//     return payoutRecord;
//   }

//   private async updatePaymentRecords(
//     tenantId: string,
//     payoutId: Types.ObjectId
//   ): Promise<void> {
//     // Mark all completed payments as paid out
//     await this.paymentModel.updateMany(
//       {
//         businessId: new Types.ObjectId(tenantId),
//         status: 'completed',
//         'metadata.payoutStatus': { $ne: 'paid' }
//       },
//       {
//         $set: {
//           'metadata.payoutStatus': 'paid',
//           'metadata.payoutId': payoutId,
//           'metadata.paidOutAt': new Date()
//         }
//       }
//     );
//   }

//   private async sendPayoutConfirmation(
//     tenantId: string,
//     details: any
//   ): Promise<void> {
//     try {
//       // Send email/SMS notification to business owner
//       // You would need to get business owner contact details
//       this.logger.log(`Sending payout confirmation to tenant ${tenantId}`);
      
//       // Implement notification logic
//     } catch (error) {
//       this.logger.error('Failed to send payout confirmation', error.stack);
//     }
//   }

//   private async recordFailedPayout(
//     tenantId: string,
//     amount: number,
//     errorMessage: string
//   ): Promise<void> {
//     await this.paymentModel.create({
//       businessId: new Types.ObjectId(tenantId),
//       paymentReference: `PAYOUT-FAILED-${Date.now()}`,
//       subtotal: amount,
//       totalAmount: amount,
//       paymentMethod: 'bank_transfer',
//       status: 'failed',
//       metadata: {
//         type: 'payout',
//         error: errorMessage,
//         failedAt: new Date()
//       }
//     });
//   }

//   private async sendPayoutFailureNotification(
//     tenantId: string,
//     errorMessage: string
//   ): Promise<void> {
//     try {
//       this.logger.log(`Sending payout failure notification to tenant ${tenantId}`);
//       // Implement notification logic
//     } catch (error) {
//       this.logger.error('Failed to send failure notification', error.stack);
//     }
//   }

//   private async findEligibleTenants(): Promise<any[]> {
//     // Find tenants due for payout based on their schedule
//     const now = new Date();
    
//     // This is simplified - in production, you'd have a tenant/business schema
//     // with payout schedule configuration
//     const tenants = await this.paymentModel.aggregate([
//       {
//         $match: {
//           status: 'completed',
//           'metadata.payoutStatus': { $ne: 'paid' }
//         }
//       },
//       {
//         $group: {
//           _id: '$businessId',
//           totalAmount: { $sum: '$totalAmount' },
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $match: {
//           totalAmount: { $gte: 100 } // Minimum payout threshold
//         }
//       }
//     ]);

//     return tenants.map(t => ({
//       tenantId: t._id.toString(),
//       amount: t.totalAmount,
//       payoutSchedule: 'weekly', // Get from config
//       lastPayoutDate: null // Get from payout history
//     }));
//   }

//   private async calculateTenantPayout(tenantId: string): Promise<number> {
//     const result = await this.paymentModel.aggregate([
//       {
//         $match: {
//           businessId: new Types.ObjectId(tenantId),
//           status: 'completed',
//           'metadata.payoutStatus': { $ne: 'paid' }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: '$totalAmount' }
//         }
//       }
//     ]);

//     return result[0]?.total || 0;
//   }
// }


// jobs/processors/payout.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from '../../payment/schemas/payment.schema';
import { Booking, BookingDocument } from '../../booking/schemas/booking.schema';
import { GatewayManagerService } from '../../integration/gateway-manager.service';
import { NotificationService } from '../../notification/notification.service';
import { CommissionCalculatorService } from '../../commission/services/commission-calculator.service';

interface PayoutJobData {
  tenantId: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly';
  startDate?: Date;
  endDate?: Date;
}

interface PayoutResult {
  success: boolean;
  payoutId: string;
  amount: number;
  fees: number;
  netAmount: number;
  transactionId?: string;
  error?: string;
}

@Processor('payouts')
@Injectable()
export class PayoutProcessor {
  private readonly logger = new Logger(PayoutProcessor.name);

  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    private gatewayManager: GatewayManagerService,
    private notificationService: NotificationService,
    private commissionCalculatorService: CommissionCalculatorService,
  ) {}

  @Process('process-payout')
  async handlePayout(job: Job<PayoutJobData>): Promise<PayoutResult> {
    const { tenantId, amount, period } = job.data;

    try {
      this.logger.log(`Processing payout for tenant ${tenantId}: $${amount}`);

      // 1. Verify payout eligibility
      const eligibility = await this.verifyPayoutEligibility(tenantId, amount);
      if (!eligibility.eligible) {
        throw new Error(eligibility.reason);
      }

      // 2. Calculate platform fees and commissions
      const fees = await this.calculatePayoutFees(tenantId, amount);
      const netAmount = amount - fees.totalPlatformFee;

      // 3. Get tenant's bank account details
      const bankDetails = await this.getTenantBankDetails(tenantId);
      if (!bankDetails) {
        throw new Error('Bank account details not configured');
      }

      // 4. Initiate transfer to business bank account
      const transferResult = await this.initiateTransfer(
        tenantId,
        netAmount,
        bankDetails,
        period
      );

      // 5. Record transaction
      const payoutRecord = await this.recordPayoutTransaction({
        tenantId,
        amount,
        fees: fees.totalPlatformFee,
        netAmount,
        transactionId: transferResult.transactionId,
        period,
        status: 'completed'
      });

      // 6. Update payment records
      await this.updatePaymentRecords(tenantId, payoutRecord._id);

      // 7. Send confirmation notification
      await this.sendPayoutConfirmation(tenantId, {
        amount,
        netAmount,
        fees: fees.totalPlatformFee,
        payoutId: payoutRecord._id.toString(),
        transactionId: transferResult.transactionId
      });

      this.logger.log(`Payout completed successfully: ${payoutRecord._id}`);

      return {
        success: true,
        payoutId: payoutRecord._id.toString(),
        amount,
        fees: fees.totalPlatformFee,
        netAmount,
        transactionId: transferResult.transactionId
      };

    } catch (error) {
      this.logger.error(`Payout failed for tenant ${tenantId}: ${error.message}`, error.stack);
      
      // Record failed payout
      await this.recordFailedPayout(tenantId, amount, error.message);
      
      // Notify tenant of failure
      await this.sendPayoutFailureNotification(tenantId, error.message);

      return {
        success: false,
        payoutId: `FAILED-${Date.now()}`,
        amount,
        fees: 0,
        netAmount: 0,
        error: error.message
      };
    }
  }

  @Process('schedule-payouts')
  async schedulePayouts(job: Job): Promise<void> {
    try {
      this.logger.log('Scheduling payouts for eligible tenants');

      // Find all tenants eligible for payout
      const eligibleTenants = await this.findEligibleTenants();

      this.logger.log(`Found ${eligibleTenants.length} eligible tenants`);

      // Schedule individual payout jobs
      for (const tenant of eligibleTenants) {
        const payoutAmount = await this.calculateTenantPayout(tenant.tenantId);

        if (payoutAmount > 0) {
          await job.queue.add('process-payout', {
            tenantId: tenant.tenantId,
            amount: payoutAmount,
            period: tenant.payoutSchedule || 'weekly',
            startDate: tenant.lastPayoutDate,
            endDate: new Date()
          }, {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 60000 // 1 minute
            }
          });

          this.logger.log(`Scheduled payout for tenant ${tenant.tenantId}: $${payoutAmount}`);
        }
      }

    } catch (error) {
      this.logger.error('Failed to schedule payouts', error.stack);
      throw error;
    }
  }

  // Helper methods
  private async verifyPayoutEligibility(
    tenantId: string,
    amount: number
  ): Promise<{ eligible: boolean; reason?: string }> {
    // Check minimum payout threshold
    const minThreshold = 100; // $100 minimum
    if (amount < minThreshold) {
      return {
        eligible: false,
        reason: `Amount below minimum threshold of $${minThreshold}`
      };
    }

    // Check pending payouts
    const pendingPayouts = await this.paymentModel.countDocuments({
      businessId: new Types.ObjectId(tenantId),
      status: 'pending',
      'metadata.payoutStatus': 'processing'
    });

    if (pendingPayouts > 0) {
      return {
        eligible: false,
        reason: 'Pending payout already in progress'
      };
    }

    // Check account status
    // In production, verify business account is active and verified
    
    return { eligible: true };
  }

  private async calculatePayoutFees(
    tenantId: string,
    amount: number
  ): Promise<any> {
    // Get commission summary for the tenant
    const summary = await this.commissionCalculatorService.getBusinessCommissionSummary(
      tenantId
    );

    // Calculate platform fees
    const platformFeePercentage = 2.5; // 2.5% platform fee
    const platformFee = (amount * platformFeePercentage) / 100;

    return {
      totalPlatformFee: platformFee,
      commissionDeductions: summary.summary.totalCommissions || 0,
      breakdown: {
        platformFee,
        commissions: summary.summary.totalCommissions || 0
      }
    };
  }

  private async getTenantBankDetails(tenantId: string): Promise<any> {
    // In production, fetch from tenant configuration
    // This would include bank account number, routing number, etc.
    return {
      accountNumber: 'XXXXXXXXXX',
      bankCode: 'XXX',
      accountName: 'Business Account'
    };
  }

  private async initiateTransfer(
    tenantId: string,
    amount: number,
    bankDetails: any,
    period: string
  ): Promise<any> {
    // Use gateway manager to process transfer
    // This would vary by payment gateway (Paystack, Stripe, etc.)
    try {
      const gateway = 'paystack'; // Or get from tenant config
      
      const transferResult = await this.gatewayManager.processTransfer(
        gateway,
        amount,
        {
          recipient: bankDetails.accountNumber,
          bankCode: bankDetails.bankCode,
          accountName: bankDetails.accountName,
          reference: `PAYOUT-${tenantId}-${Date.now()}`,
          reason: `${period} payout`
        }
      );

      return transferResult;
    } catch (error) {
      this.logger.error('Transfer initiation failed', error.stack);
      throw error;
    }
  }

  private async recordPayoutTransaction(data: any): Promise<any> {
    // Create payout record in database
    // You might have a separate Payout schema for this
    const payoutRecord = await this.paymentModel.create({
      businessId: new Types.ObjectId(data.tenantId),
      paymentReference: `PAYOUT-${Date.now()}`,
      transactionId: data.transactionId,
      subtotal: data.amount,
      totalAmount: data.netAmount,
      paymentMethod: 'bank_transfer',
      status: data.status,
      gateway: 'paystack',
      metadata: {
        type: 'payout',
        period: data.period,
        fees: data.fees,
        processedAt: new Date()
      }
    });

    return payoutRecord;
  }

  private async updatePaymentRecords(
    tenantId: string,
    payoutId: Types.ObjectId
  ): Promise<void> {
    // Mark all completed payments as paid out
    await this.paymentModel.updateMany(
      {
        businessId: new Types.ObjectId(tenantId),
        status: 'completed',
        'metadata.payoutStatus': { $ne: 'paid' }
      },
      {
        $set: {
          'metadata.payoutStatus': 'paid',
          'metadata.payoutId': payoutId,
          'metadata.paidOutAt': new Date()
        }
      }
    );
  }

  private async sendPayoutConfirmation(
    tenantId: string,
    details: any
  ): Promise<void> {
    try {
      // Send email/SMS notification to business owner
      // You would need to get business owner contact details
      this.logger.log(`Sending payout confirmation to tenant ${tenantId}`);
      
      // Implement notification logic
    } catch (error) {
      this.logger.error('Failed to send payout confirmation', error.stack);
    }
  }

  private async recordFailedPayout(
    tenantId: string,
    amount: number,
    errorMessage: string
  ): Promise<void> {
    await this.paymentModel.create({
      businessId: new Types.ObjectId(tenantId),
      paymentReference: `PAYOUT-FAILED-${Date.now()}`,
      subtotal: amount,
      totalAmount: amount,
      paymentMethod: 'bank_transfer',
      status: 'failed',
      metadata: {
        type: 'payout',
        error: errorMessage,
        failedAt: new Date()
      }
    });
  }

  private async sendPayoutFailureNotification(
    tenantId: string,
    errorMessage: string
  ): Promise<void> {
    try {
      this.logger.log(`Sending payout failure notification to tenant ${tenantId}`);
      // Implement notification logic
    } catch (error) {
      this.logger.error('Failed to send failure notification', error.stack);
    }
  }

  private async findEligibleTenants(): Promise<any[]> {
    // Find tenants due for payout based on their schedule
    const now = new Date();
    
    // This is simplified - in production, you'd have a tenant/business schema
    // with payout schedule configuration
    const tenants = await this.paymentModel.aggregate([
      {
        $match: {
          status: 'completed',
          'metadata.payoutStatus': { $ne: 'paid' }
        }
      },
      {
        $group: {
          _id: '$businessId',
          totalAmount: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          totalAmount: { $gte: 100 } // Minimum payout threshold
        }
      }
    ]);

    return tenants.map(t => ({
      tenantId: t._id.toString(),
      amount: t.totalAmount,
      payoutSchedule: 'weekly', // Get from config
      lastPayoutDate: null // Get from payout history
    }));
  }

  private async calculateTenantPayout(tenantId: string): Promise<number> {
    const result = await this.paymentModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(tenantId),
          status: 'completed',
          'metadata.payoutStatus': { $ne: 'paid' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    return result[0]?.total || 0;
  }
}