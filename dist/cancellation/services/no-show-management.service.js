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
var NoShowManagementService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoShowManagementService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_2 = require("mongoose");
const no_show_record_schema_1 = require("../schemas/no-show-record.schema");
const client_reliability_schema_1 = require("../schemas/client-reliability.schema");
let NoShowManagementService = NoShowManagementService_1 = class NoShowManagementService {
    constructor(noShowModel, reliabilityModel, eventEmitter) {
        this.noShowModel = noShowModel;
        this.reliabilityModel = reliabilityModel;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(NoShowManagementService_1.name);
    }
    async recordNoShow(input) {
        const record = await this.noShowModel.create({
            clientId: new mongoose_2.Types.ObjectId(input.clientId),
            businessId: new mongoose_2.Types.ObjectId(input.businessId),
            appointmentId: new mongoose_2.Types.ObjectId(input.appointmentId),
            bookingId: new mongoose_2.Types.ObjectId(input.bookingId),
            appointmentDate: input.appointmentDate,
            scheduledTime: input.scheduledTime,
            bookedAmount: input.bookedAmount,
            depositAmount: input.depositAmount || 0,
            wasDeposited: input.wasDeposited || false,
            depositForfeited: input.wasDeposited || false,
            type: 'no_show',
            recordedAt: new Date()
        });
        await this.updateReliabilityScore(input.clientId, input.businessId, 'no_show');
        this.eventEmitter.emit('no-show.recorded', {
            clientId: input.clientId,
            businessId: input.businessId,
            appointmentId: input.appointmentId
        });
        this.logger.warn(`No-show recorded for client ${input.clientId}`);
        return record;
    }
    async recordLateCancellation(input) {
        const type = input.hoursNotice < 24
            ? 'same_day_cancellation'
            : 'late_cancellation';
        const record = await this.noShowModel.create({
            clientId: new mongoose_2.Types.ObjectId(input.clientId),
            businessId: new mongoose_2.Types.ObjectId(input.businessId),
            appointmentId: new mongoose_2.Types.ObjectId(input.appointmentId),
            bookingId: new mongoose_2.Types.ObjectId(input.bookingId),
            appointmentDate: input.appointmentDate,
            scheduledTime: input.scheduledTime,
            bookedAmount: input.bookedAmount,
            penaltyCharged: input.penaltyCharged,
            type,
            recordedAt: new Date()
        });
        await this.updateReliabilityScore(input.clientId, input.businessId, type);
        this.logger.log(`Late cancellation recorded for client ${input.clientId}`);
        return record;
    }
    async getClientReliability(clientId, businessId) {
        return this.reliabilityModel.findOne({
            clientId: new mongoose_2.Types.ObjectId(clientId),
            businessId: new mongoose_2.Types.ObjectId(businessId)
        }).exec();
    }
    async shouldRequireDeposit(clientId, businessId) {
        const reliability = await this.getClientReliability(clientId, businessId);
        if (!reliability) {
            return {
                requiresDeposit: false,
                reason: 'New client - no history',
                score: 100,
                riskLevel: 'low'
            };
        }
        if (reliability.isBlacklisted) {
            return {
                requiresDeposit: true,
                reason: `Client is blacklisted: ${reliability.blacklistReason}`,
                score: reliability.reliabilityScore,
                riskLevel: 'high'
            };
        }
        if (reliability.requiresDeposit) {
            return {
                requiresDeposit: true,
                reason: `Poor reliability history: ${reliability.noShowCount} no-shows, score: ${reliability.reliabilityScore}`,
                score: reliability.reliabilityScore,
                riskLevel: reliability.riskLevel || 'medium'
            };
        }
        return {
            requiresDeposit: false,
            reason: 'Good reliability history',
            score: reliability.reliabilityScore,
            riskLevel: reliability.riskLevel || 'low'
        };
    }
    async getNoShowStats(businessId, startDate, endDate) {
        const matchQuery = {
            businessId: new mongoose_2.Types.ObjectId(businessId)
        };
        if (startDate || endDate) {
            matchQuery.recordedAt = {};
            if (startDate)
                matchQuery.recordedAt.$gte = startDate;
            if (endDate)
                matchQuery.recordedAt.$lte = endDate;
        }
        const stats = await this.noShowModel.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    totalRevenueLost: { $sum: '$bookedAmount' },
                    totalPenaltiesCharged: { $sum: '$penaltyCharged' },
                    totalDepositsForfeited: {
                        $sum: { $cond: ['$depositForfeited', '$depositAmount', 0] }
                    }
                }
            }
        ]).exec();
        const summary = {
            noShows: 0,
            lateCancellations: 0,
            sameDayCancellations: 0,
            totalIncidents: 0,
            revenueLost: 0,
            penaltiesCollected: 0,
            depositsForfeited: 0
        };
        stats.forEach(item => {
            summary.totalIncidents += item.count;
            summary.revenueLost += item.totalRevenueLost;
            summary.penaltiesCollected += item.totalPenaltiesCharged;
            summary.depositsForfeited += item.totalDepositsForfeited;
            if (item._id === 'no_show') {
                summary.noShows = item.count;
            }
            else if (item._id === 'late_cancellation') {
                summary.lateCancellations = item.count;
            }
            else if (item._id === 'same_day_cancellation') {
                summary.sameDayCancellations = item.count;
            }
        });
        return summary;
    }
    async updateReliabilityScore(clientId, businessId, incidentType) {
        const scoreChanges = {
            no_show: -15,
            late_cancellation: -10,
            same_day_cancellation: -5,
            completed: 2
        };
        const reliability = await this.reliabilityModel.findOne({
            clientId: new mongoose_2.Types.ObjectId(clientId),
            businessId: new mongoose_2.Types.ObjectId(businessId)
        });
        const scoreChange = scoreChanges[incidentType] || 0;
        if (reliability) {
            reliability.reliabilityScore = Math.max(0, Math.min(100, reliability.reliabilityScore + scoreChange));
            if (incidentType === 'no_show') {
                reliability.noShowCount += 1;
                reliability.lastNoShowDate = new Date();
            }
            else if (incidentType === 'late_cancellation' || incidentType === 'same_day_cancellation') {
                reliability.lateCancellations += 1;
                reliability.lastCancellationDate = new Date();
            }
            else if (incidentType === 'completed') {
                reliability.completedBookings += 1;
                reliability.lastCompletedDate = new Date();
            }
            reliability.totalBookings += 1;
            reliability.requiresDeposit =
                reliability.noShowCount >= 2 ||
                    reliability.reliabilityScore < 60;
            if (reliability.reliabilityScore >= 80) {
                reliability.riskLevel = 'low';
            }
            else if (reliability.reliabilityScore >= 50) {
                reliability.riskLevel = 'medium';
            }
            else {
                reliability.riskLevel = 'high';
            }
            await reliability.save();
        }
        else {
            const newReliability = new this.reliabilityModel({
                clientId: new mongoose_2.Types.ObjectId(clientId),
                businessId: new mongoose_2.Types.ObjectId(businessId),
                reliabilityScore: 100 + scoreChange,
                totalBookings: 1,
                completedBookings: incidentType === 'completed' ? 1 : 0,
                noShowCount: incidentType === 'no_show' ? 1 : 0,
                lateCancellations: incidentType === 'late_cancellation' || incidentType === 'same_day_cancellation' ? 1 : 0,
                lastNoShowDate: incidentType === 'no_show' ? new Date() : undefined,
                lastCancellationDate: incidentType === 'late_cancellation' || incidentType === 'same_day_cancellation'
                    ? new Date()
                    : undefined,
                lastCompletedDate: incidentType === 'completed' ? new Date() : undefined,
                requiresDeposit: incidentType === 'no_show',
                riskLevel: incidentType === 'no_show' ? 'medium' : 'low'
            });
            await newReliability.save();
        }
        this.logger.log(`Updated reliability score for client ${clientId}: ${incidentType}`);
    }
    async getClientHistory(clientId, businessId, limit = 20) {
        const records = await this.noShowModel
            .find({
            clientId: new mongoose_2.Types.ObjectId(clientId),
            businessId: new mongoose_2.Types.ObjectId(businessId)
        })
            .sort({ recordedAt: -1 })
            .limit(limit)
            .exec();
        return {
            total: records.length,
            records: records.map(r => ({
                id: r._id,
                type: r.type,
                appointmentDate: r.appointmentDate,
                scheduledTime: r.scheduledTime,
                bookedAmount: r.bookedAmount,
                penaltyCharged: r.penaltyCharged || 0,
                depositForfeited: r.depositForfeited || false,
                recordedAt: r.recordedAt
            }))
        };
    }
    async getReliabilityMetrics(businessId) {
        const metrics = await this.reliabilityModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(businessId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalClients: { $sum: 1 },
                    avgReliabilityScore: { $avg: '$reliabilityScore' },
                    clientsRequiringDeposit: {
                        $sum: { $cond: ['$requiresDeposit', 1, 0] }
                    },
                    blacklistedClients: {
                        $sum: { $cond: ['$isBlacklisted', 1, 0] }
                    },
                    highRiskClients: {
                        $sum: {
                            $cond: [
                                { $eq: ['$riskLevel', 'high'] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]).exec();
        return metrics[0] || {
            totalClients: 0,
            avgReliabilityScore: 100,
            clientsRequiringDeposit: 0,
            blacklistedClients: 0,
            highRiskClients: 0
        };
    }
    async getCancellationTrends(businessId, startDate, endDate, groupBy = 'day') {
        const groupFormat = {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$recordedAt' } },
            week: { $dateToString: { format: '%Y-W%V', date: '$recordedAt' } },
            month: { $dateToString: { format: '%Y-%m', date: '$recordedAt' } }
        };
        const trends = await this.noShowModel.aggregate([
            {
                $match: {
                    businessId: new mongoose_2.Types.ObjectId(businessId),
                    recordedAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        period: groupFormat[groupBy],
                        type: '$type'
                    },
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$bookedAmount' },
                    totalPenalties: { $sum: '$penaltyCharged' }
                }
            },
            {
                $sort: { '_id.period': 1 }
            }
        ]).exec();
        const formattedTrends = {};
        trends.forEach(item => {
            const period = item._id.period;
            if (!formattedTrends[period]) {
                formattedTrends[period] = {
                    period,
                    noShows: 0,
                    lateCancellations: 0,
                    sameDayCancellations: 0,
                    totalIncidents: 0,
                    revenueLost: 0,
                    penaltiesCollected: 0
                };
            }
            const data = formattedTrends[period];
            data.totalIncidents += item.count;
            data.revenueLost += item.totalAmount;
            data.penaltiesCollected += item.totalPenalties;
            if (item._id.type === 'no_show') {
                data.noShows += item.count;
            }
            else if (item._id.type === 'late_cancellation') {
                data.lateCancellations += item.count;
            }
            else if (item._id.type === 'same_day_cancellation') {
                data.sameDayCancellations += item.count;
            }
        });
        return {
            groupBy,
            startDate,
            endDate,
            trends: Object.values(formattedTrends)
        };
    }
    async recordCompletedAppointment(clientId, businessId, appointmentId) {
        await this.updateReliabilityScore(clientId, businessId, 'completed');
        this.logger.log(`Completed appointment recorded for client ${clientId}`);
    }
    async blacklistClient(clientId, businessId, reason, adminId) {
        await this.reliabilityModel.updateOne({
            clientId: new mongoose_2.Types.ObjectId(clientId),
            businessId: new mongoose_2.Types.ObjectId(businessId)
        }, {
            $set: {
                isBlacklisted: true,
                blacklistReason: reason,
                blacklistedAt: new Date(),
                requiresDeposit: true,
                riskLevel: 'high'
            }
        }, { upsert: true }).exec();
        this.eventEmitter.emit('client.blacklisted', {
            clientId,
            businessId,
            reason,
            adminId
        });
        this.logger.warn(`Client ${clientId} blacklisted by admin ${adminId}: ${reason}`);
    }
    async unblacklistClient(clientId, businessId, adminId) {
        await this.reliabilityModel.updateOne({
            clientId: new mongoose_2.Types.ObjectId(clientId),
            businessId: new mongoose_2.Types.ObjectId(businessId)
        }, {
            $set: {
                isBlacklisted: false,
                blacklistReason: null,
                blacklistedAt: null
            }
        }).exec();
        this.eventEmitter.emit('client.unblacklisted', {
            clientId,
            businessId,
            adminId
        });
        this.logger.log(`Client ${clientId} removed from blacklist by admin ${adminId}`);
    }
};
NoShowManagementService = NoShowManagementService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(no_show_record_schema_1.NoShowRecord.name)),
    __param(1, (0, mongoose_1.InjectModel)(client_reliability_schema_1.ClientReliability.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        event_emitter_1.EventEmitter2])
], NoShowManagementService);
exports.NoShowManagementService = NoShowManagementService;
//# sourceMappingURL=no-show-management.service.js.map