// import { Injectable, Logger, NotFoundException } from '@nestjs/common'
// import { InjectModel } from '@nestjs/mongoose'
// import { Model, Types } from 'mongoose'
// import { 
//   CancellationPolicy, 
//   CancellationPolicyDocument 
// } from '../schemas/cancellation-policy.schema'

// export interface DepositCalculation {
//   requiresDeposit: boolean
//   depositAmount: number
//   depositPercentage: number
//   reason: string
// }

// @Injectable()
// export class CancellationPolicyService {
//   private readonly logger = new Logger(CancellationPolicyService.name)

//   constructor(
//     @InjectModel(CancellationPolicy.name)
//     private policyModel: Model<CancellationPolicyDocument>
//   ) {}

//   // ✅ FIX: This method was missing
//   async getBusinessPolicy(
//     businessId: string,
//     serviceId?: string
//   ): Promise<any> {
//     const query: any = {
//       businessId: new Types.ObjectId(businessId),
//       isActive: true
//     }

//     if (serviceId) {
//       query.applicableServices = new Types.ObjectId(serviceId)
//     }

//     const policy = await this.policyModel.findOne(query)

//     if (policy) {
//       return policy
//     }

//     const defaultPolicy = await this.policyModel.findOne({
//       businessId: new Types.ObjectId(businessId),
//       isActive: true,
//       applicableServices: { $size: 0 }
//     })

//     if (defaultPolicy) {
//       return defaultPolicy
//     }

//     return await this.createDefaultPolicy(businessId)
//   }

//   // ✅ FIX: This method was missing
//   async createOrUpdatePolicy(
//     businessId: string,
//     policyDto: any
//   ): Promise<any> {
//     const existingPolicy = await this.policyModel.findOne({
//       businessId: new Types.ObjectId(businessId),
//       isActive: true
//     })

//     if (existingPolicy) {
//       Object.assign(existingPolicy, policyDto)
//       await existingPolicy.save()
      
//       this.logger.log(`Updated policy ${existingPolicy._id} for business ${businessId}`)
//       return existingPolicy
//     }

//     const newPolicy = await this.policyModel.create({
//       ...policyDto,
//       businessId: new Types.ObjectId(businessId),
//       isActive: true
//     })

//     this.logger.log(`Created new policy ${newPolicy._id} for business ${businessId}`)
//     return newPolicy
//   }

//   async calculateDepositAmount(
//     businessId: string,
//     totalAmount: number,
//     serviceIds?: string[]
//   ): Promise<DepositCalculation> {
//     const policy = await this.getBusinessPolicy(businessId, serviceIds?.[0])

//     if (!policy || !policy.requiresDeposit) {
//       return {
//         requiresDeposit: false,
//         depositAmount: 0,
//         depositPercentage: 0,
//         reason: 'Business does not require deposits'
//       }
//     }

//     const depositAmount = Math.max(
//       (totalAmount * policy.depositPercentage) / 100,
//       policy.minimumDepositAmount || 0
//     )

//     return {
//       requiresDeposit: true,
//       depositAmount: Math.round(depositAmount),
//       depositPercentage: policy.depositPercentage,
//       reason: `${policy.depositPercentage}% deposit required by business policy`
//     }
//   }

//   // ✅ FIX: This method was missing
//   async calculateRefund(
//     businessId: string,
//     appointmentDate: Date,
//     paidAmount: number,
//     depositAmount: number = 0
//   ): Promise<{
//     canCancel: boolean
//     refundAmount: number
//     penaltyAmount: number
//     refundPercentage: number
//     reason: string
//     hoursNotice: number
//   }> {
//     const policy = await this.getBusinessPolicy(businessId)
    
//     const hoursUntilAppointment = 
//       (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60)

//     const applicableRule = policy.rules
//       ?.sort((a, b) => b.hoursBeforeAppointment - a.hoursBeforeAppointment)
//       .find(rule => hoursUntilAppointment >= rule.hoursBeforeAppointment)

//     if (!applicableRule) {
//       if (!policy.allowSameDayCancellation) {
//         return {
//           canCancel: false,
//           refundAmount: 0,
//           penaltyAmount: paidAmount,
//           refundPercentage: 0,
//           reason: 'Same-day cancellations not allowed',
//           hoursNotice: hoursUntilAppointment
//         }
//       }

//       const refundAmount = (paidAmount * policy.sameDayRefundPercentage) / 100
//       return {
//         canCancel: true,
//         refundAmount: Math.round(refundAmount),
//         penaltyAmount: Math.round(paidAmount - refundAmount),
//         refundPercentage: policy.sameDayRefundPercentage,
//         reason: 'Same-day cancellation - reduced refund',
//         hoursNotice: hoursUntilAppointment
//       }
//     }

//     const refundAmount = (paidAmount * applicableRule.refundPercentage) / 100
//     const penaltyAmount = (paidAmount * applicableRule.penaltyPercentage) / 100

//     return {
//       canCancel: true,
//       refundAmount: Math.round(refundAmount),
//       penaltyAmount: Math.round(penaltyAmount),
//       refundPercentage: applicableRule.refundPercentage,
//       reason: applicableRule.description || 
//         `Cancelled ${hoursUntilAppointment.toFixed(1)} hours before appointment`,
//       hoursNotice: hoursUntilAppointment
//     }
//   }


//   //Added
//   async updatePolicy(
//   businessId: string,
//   updateDto: Partial<any>
// ): Promise<any> {
//   const policy = await this.policyModel.findOne({
//     businessId: new Types.ObjectId(businessId),
//     isActive: true
//   });

//   if (!policy) {
//     throw new NotFoundException('No active policy found for this business');
//   }

//   Object.assign(policy, updateDto);
//   await policy.save();

//   this.logger.log(`Updated policy ${policy._id} for business ${businessId}`);
//   return policy;
// }

// /**
//  * Get policy by ID
//  */
// async getPolicyById(policyId: string): Promise<any> {
//   const policy = await this.policyModel.findById(policyId);
  
//   if (!policy) {
//     throw new NotFoundException('Policy not found');
//   }

//   return policy;
// }

// /**
//  * Deactivate policy
//  */
// async deactivatePolicy(businessId: string, policyId: string): Promise<any> {
//   const policy = await this.policyModel.findOne({
//     _id: policyId,
//     businessId: new Types.ObjectId(businessId)
//   });

//   if (!policy) {
//     throw new NotFoundException('Policy not found');
//   }

//   policy.isActive = false;
//   await policy.save();

//   this.logger.log(`Deactivated policy ${policyId} for business ${businessId}`);
//   return policy;
// }

// // ==================== no-show-management.service.ts (NEW METHODS) ====================

// // Add these new methods to your NoShowManagementService class:
// async getClientHistory(
//   clientId: string,
//   businessId: string,
//   limit: number = 20
// ): Promise<any> {
//   const records = await this.noShowModel
//     .find({
//       clientId: new Types.ObjectId(clientId),
//       businessId: new Types.ObjectId(businessId)
//     })
//     .sort({ recordedAt: -1 })
//     .limit(limit)
//     .exec();

//   return {
//     total: records.length,
//     records: records.map(r => ({
//       id: r._id,
//       type: r.type,
//       appointmentDate: r.appointmentDate,
//       scheduledTime: r.scheduledTime,
//       bookedAmount: r.bookedAmount,
//       penaltyCharged: r.penaltyCharged || 0,
//       depositForfeited: r.depositForfeited || false,
//       recordedAt: r.recordedAt
//     }))
//   };
// }

// /**
//  * Get reliability metrics for business
//  */
// async getReliabilityMetrics(businessId: string): Promise<any> {
//   const metrics = await this.reliabilityModel.aggregate([
//     {
//       $match: {
//         businessId: new Types.ObjectId(businessId)
//       }
//     },
//     {
//       $group: {
//         _id: null,
//         totalClients: { $sum: 1 },
//         avgReliabilityScore: { $avg: '$reliabilityScore' },
//         clientsRequiringDeposit: {
//           $sum: { $cond: ['$requiresDeposit', 1, 0] }
//         },
//         blacklistedClients: {
//           $sum: { $cond: ['$isBlacklisted', 1, 0] }
//         },
//         highRiskClients: {
//           $sum: { 
//             $cond: [
//               { $eq: ['$riskLevel', 'high'] },
//               1,
//               0
//             ]
//           }
//         }
//       }
//     }
//   ]).exec();

//   return metrics[0] || {
//     totalClients: 0,
//     avgReliabilityScore: 100,
//     clientsRequiringDeposit: 0,
//     blacklistedClients: 0,
//     highRiskClients: 0
//   };
// }

// /**
//  * Get cancellation trends over time
//  */
// async getCancellationTrends(
//   businessId: string,
//   startDate: Date,
//   endDate: Date,
//   groupBy: 'day' | 'week' | 'month' = 'day'
// ): Promise<any> {
//   const groupFormat = {
//     day: { $dateToString: { format: '%Y-%m-%d', date: '$recordedAt' } },
//     week: { $dateToString: { format: '%Y-W%V', date: '$recordedAt' } },
//     month: { $dateToString: { format: '%Y-%m', date: '$recordedAt' } }
//   };

//   const trends = await this.noShowModel.aggregate([
//     {
//       $match: {
//         businessId: new Types.ObjectId(businessId),
//         recordedAt: {
//           $gte: startDate,
//           $lte: endDate
//         }
//       }
//     },
//     {
//       $group: {
//         _id: {
//           period: groupFormat[groupBy],
//           type: '$type'
//         },
//         count: { $sum: 1 },
//         totalAmount: { $sum: '$bookedAmount' },
//         totalPenalties: { $sum: '$penaltyCharged' }
//       }
//     },
//     {
//       $sort: { '_id.period': 1 }
//     }
//   ]).exec();

//   // Format the results
//   const formattedTrends = {};
//   trends.forEach(item => {
//     const period = item._id.period;
//     if (!formattedTrends[period]) {
//       formattedTrends[period] = {
//         period,
//         noShows: 0,
//         lateCancellations: 0,
//         sameDayCancellations: 0,
//         totalIncidents: 0,
//         revenueLost: 0,
//         penaltiesCollected: 0
//       };
//     }

//     const data = formattedTrends[period];
//     data.totalIncidents += item.count;
//     data.revenueLost += item.totalAmount;
//     data.penaltiesCollected += item.totalPenalties;

//     if (item._id.type === 'no_show') {
//       data.noShows += item.count;
//     } else if (item._id.type === 'late_cancellation') {
//       data.lateCancellations += item.count;
//     } else if (item._id.type === 'same_day_cancellation') {
//       data.sameDayCancellations += item.count;
//     }
//   });

//   return {
//     groupBy,
//     startDate,
//     endDate,
//     trends: Object.values(formattedTrends)
//   };
// }

// /**
//  * Record completed appointment (improves reliability score)
//  */
// async recordCompletedAppointment(
//   clientId: string,
//   businessId: string,
//   appointmentId: string
// ): Promise<void> {
//   await this.updateReliabilityScore(
//     clientId,
//     businessId,
//     'completed'
//   );

//   this.logger.log(
//     `Completed appointment recorded for client ${clientId}`
//   );
// }

// /**
//  * Blacklist a client
//  */
// async blacklistClient(
//   clientId: string,
//   businessId: string,
//   reason: string,
//   adminId: string
// ): Promise<void> {
//   await this.reliabilityModel.updateOne(
//     {
//       clientId: new Types.ObjectId(clientId),
//       businessId: new Types.ObjectId(businessId)
//     },
//     {
//       $set: {
//         isBlacklisted: true,
//         blacklistReason: reason,
//         blacklistedAt: new Date(),
//         requiresDeposit: true,
//         riskLevel: 'high'
//       }
//     },
//     { upsert: true }
//   ).exec();

//   // Emit event for notifications
//   this.eventEmitter.emit('client.blacklisted', {
//     clientId,
//     businessId,
//     reason,
//     adminId
//   });

//   this.logger.warn(`Client ${clientId} blacklisted by admin ${adminId}: ${reason}`);
// }

// /**
//  * Remove client from blacklist
//  */
// async unblacklistClient(
//   clientId: string,
//   businessId: string,
//   adminId: string
// ): Promise<void> {
//   await this.reliabilityModel.updateOne(
//     {
//       clientId: new Types.ObjectId(clientId),
//       businessId: new Types.ObjectId(businessId)
//     },
//     {
//       $set: {
//         isBlacklisted: false,
//         blacklistReason: null,
//         blacklistedAt: null
//       }
//     }
//   ).exec();

//   // Emit event
//   this.eventEmitter.emit('client.unblacklisted', {
//     clientId,
//     businessId,
//     adminId
//   });

//   this.logger.log(`Client ${clientId} removed from blacklist by admin ${adminId}`);
// }

//   private async createDefaultPolicy(businessId: string): Promise<any> {
//     const defaultPolicy = await this.policyModel.create({
//       businessId: new Types.ObjectId(businessId),
//       policyName: 'Default Cancellation Policy',
//       requiresDeposit: true,
//       depositPercentage: 20,
//       minimumDepositAmount: 1000,
//       cancellationWindowHours: 24,
//       rules: [
//         {
//           hoursBeforeAppointment: 48,
//           refundPercentage: 100,
//           penaltyPercentage: 0,
//           description: 'Full refund for cancellations 48+ hours before'
//         },
//         {
//           hoursBeforeAppointment: 24,
//           refundPercentage: 50,
//           penaltyPercentage: 50,
//           description: '50% refund for 24-48 hours notice'
//         }
//       ],
//       allowSameDayCancellation: true,
//       sameDayRefundPercentage: 0,
//       sendReminders: true,
//       reminderHours: [24, 4, 1],
//       maxNoShowsBeforeDeposit: 2,
//       isActive: true,
//       applicableServices: [],
//       description: 'Standard cancellation policy'
//     })

//     this.logger.log(`Created default policy for business ${businessId}`)
//     return defaultPolicy
//   }
// }



// import { Injectable, Logger, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { 
//   CancellationPolicy, 
//   CancellationPolicyDocument 
// } from '../schemas/cancellation-policy.schema';

// export interface DepositCalculation {
//   requiresDeposit: boolean;
//   depositAmount: number;
//   depositPercentage: number;
//   reason: string;
// }

// export interface RefundCalculation {
//   canCancel: boolean;
//   refundAmount: number;
//   penaltyAmount: number;
//   refundPercentage: number;
//   reason: string;
//   hoursNotice: number;
// }

// @Injectable()
// export class CancellationPolicyService {
//   private readonly logger = new Logger(CancellationPolicyService.name);

//   constructor(
//     @InjectModel(CancellationPolicy.name)
//     private policyModel: Model<CancellationPolicyDocument>
//   ) {}

//   /**
//    * Get business cancellation policy
//    */
//   async getBusinessPolicy(
//     businessId: string,
//     serviceId?: string
//   ): Promise<CancellationPolicyDocument> {
//     const query: any = {
//       businessId: new Types.ObjectId(businessId),
//       isActive: true
//     };

//     if (serviceId) {
//       query.applicableServices = new Types.ObjectId(serviceId);
//     }

//     const policy = await this.policyModel.findOne(query);

//     if (policy) {
//       return policy;
//     }

//     // Try to get default policy (no specific services)
//     const defaultPolicy = await this.policyModel.findOne({
//       businessId: new Types.ObjectId(businessId),
//       isActive: true,
//       applicableServices: { $size: 0 }
//     });

//     if (defaultPolicy) {
//       return defaultPolicy;
//     }

//     // Create default policy if none exists
//     return await this.createDefaultPolicy(businessId);
//   }

//   /**
//    * Create or update cancellation policy
//    */
//   async createOrUpdatePolicy(
//     businessId: string,
//     policyDto: any
//   ): Promise<CancellationPolicyDocument> {
//     const existingPolicy = await this.policyModel.findOne({
//       businessId: new Types.ObjectId(businessId),
//       isActive: true
//     });

//     if (existingPolicy) {
//       Object.assign(existingPolicy, policyDto);
//       await existingPolicy.save();
      
//       this.logger.log(`Updated policy ${existingPolicy._id} for business ${businessId}`);
//       return existingPolicy;
//     }

//     const newPolicy = await this.policyModel.create({
//       ...policyDto,
//       businessId: new Types.ObjectId(businessId),
//       isActive: true
//     });

//     this.logger.log(`Created new policy ${newPolicy._id} for business ${businessId}`);
//     return newPolicy;
//   }

//   /**
//    * Update existing policy
//    */
//   async updatePolicy(
//     businessId: string,
//     updateDto: Partial<any>
//   ): Promise<CancellationPolicyDocument> {
//     const policy = await this.policyModel.findOne({
//       businessId: new Types.ObjectId(businessId),
//       isActive: true
//     });

//     if (!policy) {
//       throw new NotFoundException('No active policy found for this business');
//     }

//     Object.assign(policy, updateDto);
//     await policy.save();

//     this.logger.log(`Updated policy ${policy._id} for business ${businessId}`);
//     return policy;
//   }

//   /**
//    * Get policy by ID
//    */
//   async getPolicyById(policyId: string): Promise<CancellationPolicyDocument> {
//     const policy = await this.policyModel.findById(policyId);
    
//     if (!policy) {
//       throw new NotFoundException('Policy not found');
//     }

//     return policy;
//   }

//   /**
//    * Deactivate policy
//    */
//   async deactivatePolicy(businessId: string, policyId: string): Promise<CancellationPolicyDocument> {
//     const policy = await this.policyModel.findOne({
//       _id: policyId,
//       businessId: new Types.ObjectId(businessId)
//     });

//     if (!policy) {
//       throw new NotFoundException('Policy not found');
//     }

//     policy.isActive = false;
//     await policy.save();

//     this.logger.log(`Deactivated policy ${policyId} for business ${businessId}`);
//     return policy;
//   }

//   /**
//    * Calculate deposit amount based on policy
//    */
//   async calculateDepositAmount(
//     businessId: string,
//     totalAmount: number,
//     serviceIds?: string[]
//   ): Promise<DepositCalculation> {
//     const policy = await this.getBusinessPolicy(businessId, serviceIds?.[0]);

//     if (!policy || !policy.requiresDeposit) {
//       return {
//         requiresDeposit: false,
//         depositAmount: 0,
//         depositPercentage: 0,
//         reason: 'Business does not require deposits'
//       };
//     }

//     const depositAmount = Math.max(
//       (totalAmount * policy.depositPercentage) / 100,
//       policy.minimumDepositAmount || 0
//     );

//     return {
//       requiresDeposit: true,
//       depositAmount: Math.round(depositAmount),
//       depositPercentage: policy.depositPercentage,
//       reason: `${policy.depositPercentage}% deposit required by business policy`
//     };
//   }

//   /**
//    * Calculate refund based on cancellation policy
//    */
//   async calculateRefund(
//     businessId: string,
//     appointmentDate: Date,
//     paidAmount: number,
//     depositAmount: number = 0
//   ): Promise<RefundCalculation> {
//     const policy = await this.getBusinessPolicy(businessId);
    
//     const hoursUntilAppointment = 
//       (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60);

//     // Find applicable rule based on hours notice
//     const applicableRule = policy.rules
//       ?.sort((a, b) => b.hoursBeforeAppointment - a.hoursBeforeAppointment)
//       .find(rule => hoursUntilAppointment >= rule.hoursBeforeAppointment);

//     if (!applicableRule) {
//       // No rule applies - check same-day cancellation policy
//       if (!policy.allowSameDayCancellation) {
//         return {
//           canCancel: false,
//           refundAmount: 0,
//           penaltyAmount: paidAmount,
//           refundPercentage: 0,
//           reason: 'Same-day cancellations not allowed',
//           hoursNotice: hoursUntilAppointment
//         };
//       }

//       const refundAmount = (paidAmount * policy.sameDayRefundPercentage) / 100;
//       return {
//         canCancel: true,
//         refundAmount: Math.round(refundAmount),
//         penaltyAmount: Math.round(paidAmount - refundAmount),
//         refundPercentage: policy.sameDayRefundPercentage,
//         reason: 'Same-day cancellation - reduced refund',
//         hoursNotice: hoursUntilAppointment
//       };
//     }

//     const refundAmount = (paidAmount * applicableRule.refundPercentage) / 100;
//     const penaltyAmount = (paidAmount * applicableRule.penaltyPercentage) / 100;

//     return {
//       canCancel: true,
//       refundAmount: Math.round(refundAmount),
//       penaltyAmount: Math.round(penaltyAmount),
//       refundPercentage: applicableRule.refundPercentage,
//       reason: applicableRule.description || 
//         `Cancelled ${hoursUntilAppointment.toFixed(1)} hours before appointment`,
//       hoursNotice: hoursUntilAppointment
//     };
//   }

//   /**
//    * Create default cancellation policy
//    */
//   private async createDefaultPolicy(businessId: string): Promise<CancellationPolicyDocument> {
//     const defaultPolicy = await this.policyModel.create({
//       businessId: new Types.ObjectId(businessId),
//       policyName: 'Default Cancellation Policy',
//       requiresDeposit: true,
//       depositPercentage: 20,
//       minimumDepositAmount: 1000,
//       cancellationWindowHours: 24,
//       rules: [
//         {
//           hoursBeforeAppointment: 48,
//           refundPercentage: 100,
//           penaltyPercentage: 0,
//           description: 'Full refund for cancellations 48+ hours before'
//         },
//         {
//           hoursBeforeAppointment: 24,
//           refundPercentage: 50,
//           penaltyPercentage: 50,
//           description: '50% refund for 24-48 hours notice'
//         }
//       ],
//       allowSameDayCancellation: true,
//       sameDayRefundPercentage: 0,
//       sendReminders: true,
//       reminderHours: [24, 4, 1],
//       maxNoShowsBeforeDeposit: 2,
//       isActive: true,
//       applicableServices: [],
//       description: 'Standard cancellation policy'
//     });

//     this.logger.log(`Created default policy for business ${businessId}`);
//     return defaultPolicy;
//   }
// }

// import { Injectable, Logger, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { 
//   CancellationPolicy, 
//   CancellationPolicyDocument 
// } from '../schemas/cancellation-policy.schema';

// export interface DepositCalculation {
//   requiresDeposit: boolean;
//   depositAmount: number;
//   depositPercentage: number;
//   reason: string;
// }

// export interface RefundCalculation {
//   canCancel: boolean;
//   refundAmount: number;
//   penaltyAmount: number;
//   refundPercentage: number;
//   reason: string;
//   hoursNotice: number;
// }

// @Injectable()
// export class CancellationPolicyService {
//   private readonly logger = new Logger(CancellationPolicyService.name);

//   constructor(
//     @InjectModel(CancellationPolicy.name)
//     private policyModel: Model<CancellationPolicyDocument>
//   ) {}

//   /**
//    * Get business cancellation policy
//    */
//   async getBusinessPolicy(
//     businessId: string,
//     serviceId?: string
//   ): Promise<any> {
//     const query: any = {
//       businessId: new Types.ObjectId(businessId),
//       isActive: true
//     };

//     if (serviceId) {
//       query.applicableServices = new Types.ObjectId(serviceId);
//     }

//     // AGGRESSIVE FIX: Use exec() and return plain object with JSON parse/stringify
//     const policy = await this.policyModel.findOne(query).exec();

//     if (policy) {
//       return JSON.parse(JSON.stringify(policy));
//     }

//     // Try to get default policy (no specific services)
//     const defaultPolicy = await this.policyModel.findOne({
//       businessId: new Types.ObjectId(businessId),
//       isActive: true,
//       applicableServices: { $size: 0 }
//     }).exec();

//     if (defaultPolicy) {
//       return JSON.parse(JSON.stringify(defaultPolicy));
//     }

//     // Create default policy if none exists
//     return this.createDefaultPolicy(businessId);
//   }

//   /**
//    * Create or update cancellation policy
//    */
//   async createOrUpdatePolicy(
//     businessId: string,
//     policyDto: any
//   ): Promise<any> {
//     const existingPolicy = await this.policyModel.findOne({
//       businessId: new Types.ObjectId(businessId),
//       isActive: true
//     }).exec();

//     if (existingPolicy) {
//       Object.assign(existingPolicy, policyDto);
//       await existingPolicy.save();
      
//       this.logger.log(`Updated policy ${existingPolicy._id} for business ${businessId}`);
//       return JSON.parse(JSON.stringify(existingPolicy));
//     }

//     const newPolicy = await this.policyModel.create({
//       ...policyDto,
//       businessId: new Types.ObjectId(businessId),
//       isActive: true
//     });

//     this.logger.log(`Created new policy ${newPolicy._id} for business ${businessId}`);
//     return JSON.parse(JSON.stringify(newPolicy));
//   }

//   /**
//    * Update existing policy
//    */
//   async updatePolicy(
//     businessId: string,
//     updateDto: any
//   ): Promise<any> {
//     const policy = await this.policyModel.findOne({
//       businessId: new Types.ObjectId(businessId),
//       isActive: true
//     }).exec();

//     if (!policy) {
//       throw new NotFoundException('No active policy found for this business');
//     }

//     Object.assign(policy, updateDto);
//     await policy.save();

//     this.logger.log(`Updated policy ${policy._id} for business ${businessId}`);
//     return JSON.parse(JSON.stringify(policy));
//   }

//   /**
//    * Get policy by ID
//    */
//   async getPolicyById(policyId: string): Promise<any> {
//     const policy = await this.policyModel.findById(policyId).exec();
    
//     if (!policy) {
//       throw new NotFoundException('Policy not found');
//     }

//     return JSON.parse(JSON.stringify(policy));
//   }

//   /**
//    * Deactivate policy
//    */
//   async deactivatePolicy(businessId: string, policyId: string): Promise<any> {
//     const policy = await this.policyModel.findOne({
//       _id: policyId,
//       businessId: new Types.ObjectId(businessId)
//     }).exec();

//     if (!policy) {
//       throw new NotFoundException('Policy not found');
//     }

//     policy.isActive = false;
//     await policy.save();

//     this.logger.log(`Deactivated policy ${policyId} for business ${businessId}`);
//     return JSON.parse(JSON.stringify(policy));
//   }

//   /**
//    * Calculate deposit amount based on policy
//    */
//   async calculateDepositAmount(
//     businessId: string,
//     totalAmount: number,
//     serviceIds?: string[]
//   ): Promise<DepositCalculation> {
//     const policy = await this.getBusinessPolicy(businessId, serviceIds?.[0]);

//     if (!policy || !policy.requiresDeposit) {
//       return {
//         requiresDeposit: false,
//         depositAmount: 0,
//         depositPercentage: 0,
//         reason: 'Business does not require deposits'
//       };
//     }

//     const depositAmount = Math.max(
//       (totalAmount * policy.depositPercentage) / 100,
//       policy.minimumDepositAmount || 0
//     );

//     return {
//       requiresDeposit: true,
//       depositAmount: Math.round(depositAmount),
//       depositPercentage: policy.depositPercentage,
//       reason: `${policy.depositPercentage}% deposit required by business policy`
//     };
//   }

//   /**
//    * Calculate refund based on cancellation policy
//    */
//   async calculateRefund(
//     businessId: string,
//     appointmentDate: Date,
//     paidAmount: number,
//     depositAmount: number = 0
//   ): Promise<RefundCalculation> {
//     const policy = await this.getBusinessPolicy(businessId);
    
//     if (!policy) {
//       throw new NotFoundException('No policy found for business');
//     }

//     const hoursUntilAppointment = 
//       (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60);

//     // Find applicable rule based on hours notice
//     const applicableRule = policy.rules
//       ?.sort((a: any, b: any) => b.hoursBeforeAppointment - a.hoursBeforeAppointment)
//       .find((rule: any) => hoursUntilAppointment >= rule.hoursBeforeAppointment);

//     if (!applicableRule) {
//       // No rule applies - check same-day cancellation policy
//       if (!policy.allowSameDayCancellation) {
//         return {
//           canCancel: false,
//           refundAmount: 0,
//           penaltyAmount: paidAmount,
//           refundPercentage: 0,
//           reason: 'Same-day cancellations not allowed',
//           hoursNotice: hoursUntilAppointment
//         };
//       }

//       const refundAmount = (paidAmount * policy.sameDayRefundPercentage) / 100;
//       return {
//         canCancel: true,
//         refundAmount: Math.round(refundAmount),
//         penaltyAmount: Math.round(paidAmount - refundAmount),
//         refundPercentage: policy.sameDayRefundPercentage,
//         reason: 'Same-day cancellation - reduced refund',
//         hoursNotice: hoursUntilAppointment
//       };
//     }

//     const refundAmount = (paidAmount * applicableRule.refundPercentage) / 100;
//     const penaltyAmount = (paidAmount * applicableRule.penaltyPercentage) / 100;

//     return {
//       canCancel: true,
//       refundAmount: Math.round(refundAmount),
//       penaltyAmount: Math.round(penaltyAmount),
//       refundPercentage: applicableRule.refundPercentage,
//       reason: applicableRule.description || 
//         `Cancelled ${hoursUntilAppointment.toFixed(1)} hours before appointment`,
//       hoursNotice: hoursUntilAppointment
//     };
//   }

//   /**
//    * Create default cancellation policy
//    */
//   private async createDefaultPolicy(businessId: string): Promise<any> {
//     const defaultPolicy = await this.policyModel.create({
//       businessId: new Types.ObjectId(businessId),
//       policyName: 'Default Cancellation Policy',
//       requiresDeposit: true,
//       depositPercentage: 20,
//       minimumDepositAmount: 1000,
//       cancellationWindowHours: 24,
//       rules: [
//         {
//           hoursBeforeAppointment: 48,
//           refundPercentage: 100,
//           penaltyPercentage: 0,
//           description: 'Full refund for cancellations 48+ hours before'
//         },
//         {
//           hoursBeforeAppointment: 24,
//           refundPercentage: 50,
//           penaltyPercentage: 50,
//           description: '50% refund for 24-48 hours notice'
//         }
//       ],
//       allowSameDayCancellation: true,
//       sameDayRefundPercentage: 0,
//       sendReminders: true,
//       reminderHours: [24, 4, 1],
//       maxNoShowsBeforeDeposit: 2,
//       isActive: true,
//       applicableServices: [],
//       description: 'Standard cancellation policy'
//     });

//     this.logger.log(`Created default policy for business ${businessId}`);
//     return JSON.parse(JSON.stringify(defaultPolicy));
//   }
// }

// import { Injectable, Logger, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { 
//   CancellationPolicy, 
//   CancellationPolicyDocument 
// } from '../schemas/cancellation-policy.schema';

// export interface DepositCalculation {
//   requiresDeposit: boolean;
//   depositAmount: number;
//   depositPercentage: number;
//   reason: string;
// }

// export interface RefundCalculation {
//   canCancel: boolean;
//   refundAmount: number;
//   penaltyAmount: number;
//   refundPercentage: number;
//   reason: string;
//   hoursNotice: number;
// }

// @Injectable()
// export class CancellationPolicyService {
//   private readonly logger = new Logger(CancellationPolicyService.name);

//   constructor(
//     @InjectModel('CancellationPolicy')
//     private policyModel: Model<CancellationPolicyDocument>
//   ) {}

//   /**
//    * Get business cancellation policy
//    */
//   async getBusinessPolicy(
//     businessId: string,
//     serviceId?: string
//   ): Promise<any> {
//     const query: any = {
//       businessId: new Types.ObjectId(businessId),
//       isActive: true
//     };

//     if (serviceId) {
//       query.applicableServices = new Types.ObjectId(serviceId);
//     }

//     // AGGRESSIVE FIX: Use exec() and return plain object with JSON parse/stringify
//     const policy = await this.policyModel.findOne(query).exec();

//     if (policy) {
//       return JSON.parse(JSON.stringify(policy));
//     }

//     // Try to get default policy (no specific services)
//     const defaultPolicy = await this.policyModel.findOne({
//       businessId: new Types.ObjectId(businessId),
//       isActive: true,
//       applicableServices: { $size: 0 }
//     }).exec();

//     if (defaultPolicy) {
//       return JSON.parse(JSON.stringify(defaultPolicy));
//     }

//     // Create default policy if none exists
//     return this.createDefaultPolicy(businessId);
//   }

//   /**
//    * Create or update cancellation policy
//    */
//   async createOrUpdatePolicy(
//     businessId: string,
//     policyDto: any
//   ): Promise<any> {
//     const existingPolicy = await this.policyModel.findOne({
//       businessId: new Types.ObjectId(businessId),
//       isActive: true
//     }).exec();

//     if (existingPolicy) {
//       Object.assign(existingPolicy, policyDto);
//       await existingPolicy.save();
      
//       this.logger.log(`Updated policy ${existingPolicy._id} for business ${businessId}`);
//       return JSON.parse(JSON.stringify(existingPolicy));
//     }

//     const newPolicy = await this.policyModel.create({
//       ...policyDto,
//       businessId: new Types.ObjectId(businessId),
//       isActive: true
//     });

//     this.logger.log(`Created new policy ${newPolicy._id} for business ${businessId}`);
//     return JSON.parse(JSON.stringify(newPolicy));
//   }

//   /**
//    * Update existing policy
//    */
//   async updatePolicy(
//     businessId: string,
//     updateDto: any
//   ): Promise<any> {
//     const policy = await this.policyModel.findOne({
//       businessId: new Types.ObjectId(businessId),
//       isActive: true
//     }).exec();

//     if (!policy) {
//       throw new NotFoundException('No active policy found for this business');
//     }

//     Object.assign(policy, updateDto);
//     await policy.save();

//     this.logger.log(`Updated policy ${policy._id} for business ${businessId}`);
//     return JSON.parse(JSON.stringify(policy));
//   }

//   /**
//    * Get policy by ID
//    */
//   async getPolicyById(policyId: string): Promise<any> {
//     const policy = await this.policyModel.findById(policyId).exec();
    
//     if (!policy) {
//       throw new NotFoundException('Policy not found');
//     }

//     return JSON.parse(JSON.stringify(policy));
//   }

//   /**
//    * Deactivate policy
//    */
//   async deactivatePolicy(businessId: string, policyId: string): Promise<any> {
//     const policy = await this.policyModel.findOne({
//       _id: policyId,
//       businessId: new Types.ObjectId(businessId)
//     }).exec();

//     if (!policy) {
//       throw new NotFoundException('Policy not found');
//     }

//     policy.isActive = false;
//     await policy.save();

//     this.logger.log(`Deactivated policy ${policyId} for business ${businessId}`);
//     return JSON.parse(JSON.stringify(policy));
//   }

//   /**
//    * Calculate deposit amount based on policy
//    */
//   async calculateDepositAmount(
//     businessId: string,
//     totalAmount: number,
//     serviceIds?: string[]
//   ): Promise<DepositCalculation> {
//     const policy = await this.getBusinessPolicy(businessId, serviceIds?.[0]);

//     if (!policy || !policy.requiresDeposit) {
//       return {
//         requiresDeposit: false,
//         depositAmount: 0,
//         depositPercentage: 0,
//         reason: 'Business does not require deposits'
//       };
//     }

//     const depositAmount = Math.max(
//       (totalAmount * policy.depositPercentage) / 100,
//       policy.minimumDepositAmount || 0
//     );

//     return {
//       requiresDeposit: true,
//       depositAmount: Math.round(depositAmount),
//       depositPercentage: policy.depositPercentage,
//       reason: `${policy.depositPercentage}% deposit required by business policy`
//     };
//   }

//   /**
//    * Calculate refund based on cancellation policy
//    */
//   async calculateRefund(
//     businessId: string,
//     appointmentDate: Date,
//     paidAmount: number,
//     depositAmount: number = 0
//   ): Promise<RefundCalculation> {
//     const policy = await this.getBusinessPolicy(businessId);
    
//     if (!policy) {
//       throw new NotFoundException('No policy found for business');
//     }

//     const hoursUntilAppointment = 
//       (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60);

//     // Find applicable rule based on hours notice
//     const applicableRule = policy.rules
//       ?.sort((a: any, b: any) => b.hoursBeforeAppointment - a.hoursBeforeAppointment)
//       .find((rule: any) => hoursUntilAppointment >= rule.hoursBeforeAppointment);

//     if (!applicableRule) {
//       // No rule applies - check same-day cancellation policy
//       if (!policy.allowSameDayCancellation) {
//         return {
//           canCancel: false,
//           refundAmount: 0,
//           penaltyAmount: paidAmount,
//           refundPercentage: 0,
//           reason: 'Same-day cancellations not allowed',
//           hoursNotice: hoursUntilAppointment
//         };
//       }

//       const refundAmount = (paidAmount * policy.sameDayRefundPercentage) / 100;
//       return {
//         canCancel: true,
//         refundAmount: Math.round(refundAmount),
//         penaltyAmount: Math.round(paidAmount - refundAmount),
//         refundPercentage: policy.sameDayRefundPercentage,
//         reason: 'Same-day cancellation - reduced refund',
//         hoursNotice: hoursUntilAppointment
//       };
//     }

//     const refundAmount = (paidAmount * applicableRule.refundPercentage) / 100;
//     const penaltyAmount = (paidAmount * applicableRule.penaltyPercentage) / 100;

//     return {
//       canCancel: true,
//       refundAmount: Math.round(refundAmount),
//       penaltyAmount: Math.round(penaltyAmount),
//       refundPercentage: applicableRule.refundPercentage,
//       reason: applicableRule.description || 
//         `Cancelled ${hoursUntilAppointment.toFixed(1)} hours before appointment`,
//       hoursNotice: hoursUntilAppointment
//     };
//   }

//   /**
//    * Create default cancellation policy
//    */
//   private async createDefaultPolicy(businessId: string): Promise<any> {
//     const defaultPolicy = await this.policyModel.create({
//       businessId: new Types.ObjectId(businessId),
//       policyName: 'Default Cancellation Policy',
//       requiresDeposit: true,
//       depositPercentage: 20,
//       minimumDepositAmount: 1000,
//       cancellationWindowHours: 24,
//       rules: [
//         {
//           hoursBeforeAppointment: 48,
//           refundPercentage: 100,
//           penaltyPercentage: 0,
//           description: 'Full refund for cancellations 48+ hours before'
//         },
//         {
//           hoursBeforeAppointment: 24,
//           refundPercentage: 50,
//           penaltyPercentage: 50,
//           description: '50% refund for 24-48 hours notice'
//         }
//       ],
//       allowSameDayCancellation: true,
//       sameDayRefundPercentage: 0,
//       sendReminders: true,
//       reminderHours: [24, 4, 1],
//       maxNoShowsBeforeDeposit: 2,
//       isActive: true,
//       applicableServices: [],
//       description: 'Standard cancellation policy'
//     });

//     this.logger.log(`Created default policy for business ${businessId}`);
//     return JSON.parse(JSON.stringify(defaultPolicy));
//   }
// }


// ==================== cancellation-policy.service.ts ====================
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { CancellationPolicyDocument } from '../schemas/cancellation-policy.schema';

export interface DepositCalculation {
  requiresDeposit: boolean;
  depositAmount: number;
  depositPercentage: number;
  reason: string;
}

export interface RefundCalculation {
  canCancel: boolean;
  refundAmount: number;
  penaltyAmount: number;
  refundPercentage: number;
  reason: string;
  hoursNotice: number;
}

@Injectable()
export class CancellationPolicyService {
  private readonly logger = new Logger(CancellationPolicyService.name);

  constructor(
    @InjectModel('CancellationPolicy')
    private policyModel: Model<CancellationPolicyDocument>
  ) {}

  async getBusinessPolicy(
    businessId: string,
    serviceId?: string
  ): Promise<any> {
    const query: any = {
      businessId: new Types.ObjectId(businessId),
      isActive: true
    };

    if (serviceId) {
      query.applicableServices = new Types.ObjectId(serviceId);
    }

    const policy = await this.policyModel.findOne(query).lean().exec();

    if (policy) {
      return policy;
    }

    const defaultPolicy = await this.policyModel.findOne({
      businessId: new Types.ObjectId(businessId),
      isActive: true,
      applicableServices: { $size: 0 }
    }).lean().exec();

    if (defaultPolicy) {
      return defaultPolicy;
    }

    return this.createDefaultPolicy(businessId);
  }

  async createOrUpdatePolicy(
    businessId: string,
    policyDto: any
  ): Promise<any> {
    const existingPolicy = await this.policyModel.findOne({
      businessId: new Types.ObjectId(businessId),
      isActive: true
    }).exec();

    if (existingPolicy) {
      Object.assign(existingPolicy, policyDto);
      const saved = await existingPolicy.save();
      
      this.logger.log(`Updated policy ${saved._id} for business ${businessId}`);
      return saved.toObject();
    }

    const newPolicy = await this.policyModel.create({
      ...policyDto,
      businessId: new Types.ObjectId(businessId),
      isActive: true
    });

    this.logger.log(`Created new policy ${newPolicy._id} for business ${businessId}`);
    return newPolicy.toObject();
  }

  async updatePolicy(
    businessId: string,
    updateDto: any
  ): Promise<any> {
    const policy = await this.policyModel.findOne({
      businessId: new Types.ObjectId(businessId),
      isActive: true
    }).exec();

    if (!policy) {
      throw new NotFoundException('No active policy found for this business');
    }

    Object.assign(policy, updateDto);
    const saved = await policy.save();

    this.logger.log(`Updated policy ${saved._id} for business ${businessId}`);
    return saved.toObject();
  }

  async getPolicyById(policyId: string): Promise<any> {
    const policy = await this.policyModel.findById(policyId).lean().exec();
    
    if (!policy) {
      throw new NotFoundException('Policy not found');
    }

    return policy;
  }

  async deactivatePolicy(businessId: string, policyId: string): Promise<any> {
    const policy = await this.policyModel.findOne({
      _id: policyId,
      businessId: new Types.ObjectId(businessId)
    }).exec();

    if (!policy) {
      throw new NotFoundException('Policy not found');
    }

    policy.isActive = false;
    const saved = await policy.save();

    this.logger.log(`Deactivated policy ${policyId} for business ${businessId}`);
    return saved.toObject();
  }

  async calculateDepositAmount(
    businessId: string,
    totalAmount: number,
    serviceIds?: string[]
  ): Promise<DepositCalculation> {
    const policy = await this.getBusinessPolicy(businessId, serviceIds?.[0]);

    if (!policy || !policy.requiresDeposit) {
      return {
        requiresDeposit: false,
        depositAmount: 0,
        depositPercentage: 0,
        reason: 'Business does not require deposits'
      };
    }

    const depositAmount = Math.max(
      (totalAmount * policy.depositPercentage) / 100,
      policy.minimumDepositAmount || 0
    );

    return {
      requiresDeposit: true,
      depositAmount: Math.round(depositAmount),
      depositPercentage: policy.depositPercentage,
      reason: `${policy.depositPercentage}% deposit required by business policy`
    };
  }

  async calculateRefund(
    businessId: string,
    appointmentDate: Date,
    paidAmount: number,
    depositAmount: number = 0
  ): Promise<RefundCalculation> {
    const policy = await this.getBusinessPolicy(businessId);
    
    if (!policy) {
      throw new NotFoundException('No policy found for business');
    }

    const hoursUntilAppointment = 
      (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60);

    const applicableRule = policy.rules
      ?.sort((a: any, b: any) => b.hoursBeforeAppointment - a.hoursBeforeAppointment)
      .find((rule: any) => hoursUntilAppointment >= rule.hoursBeforeAppointment);

    if (!applicableRule) {
      if (!policy.allowSameDayCancellation) {
        return {
          canCancel: false,
          refundAmount: 0,
          penaltyAmount: paidAmount,
          refundPercentage: 0,
          reason: 'Same-day cancellations not allowed',
          hoursNotice: hoursUntilAppointment
        };
      }

      const refundAmount = (paidAmount * policy.sameDayRefundPercentage) / 100;
      return {
        canCancel: true,
        refundAmount: Math.round(refundAmount),
        penaltyAmount: Math.round(paidAmount - refundAmount),
        refundPercentage: policy.sameDayRefundPercentage,
        reason: 'Same-day cancellation - reduced refund',
        hoursNotice: hoursUntilAppointment
      };
    }

    const refundAmount = (paidAmount * applicableRule.refundPercentage) / 100;
    const penaltyAmount = (paidAmount * applicableRule.penaltyPercentage) / 100;

    return {
      canCancel: true,
      refundAmount: Math.round(refundAmount),
      penaltyAmount: Math.round(penaltyAmount),
      refundPercentage: applicableRule.refundPercentage,
      reason: applicableRule.description || 
        `Cancelled ${hoursUntilAppointment.toFixed(1)} hours before appointment`,
      hoursNotice: hoursUntilAppointment
    };
  }

  private async createDefaultPolicy(businessId: string): Promise<any> {
    const defaultPolicy = await this.policyModel.create({
      businessId: new Types.ObjectId(businessId),
      policyName: 'Default Cancellation Policy',
      requiresDeposit: true,
      depositPercentage: 20,
      minimumDepositAmount: 1000,
      cancellationWindowHours: 24,
      rules: [
        {
          hoursBeforeAppointment: 48,
          refundPercentage: 100,
          penaltyPercentage: 0,
          description: 'Full refund for cancellations 48+ hours before'
        },
        {
          hoursBeforeAppointment: 24,
          refundPercentage: 50,
          penaltyPercentage: 50,
          description: '50% refund for 24-48 hours notice'
        }
      ],
      allowSameDayCancellation: true,
      sameDayRefundPercentage: 0,
      sendReminders: true,
      reminderHours: [24, 4, 1],
      maxNoShowsBeforeDeposit: 2,
      isActive: true,
      applicableServices: [],
      description: 'Standard cancellation policy'
    });

    this.logger.log(`Created default policy for business ${businessId}`);
    return defaultPolicy.toObject();
  }
}