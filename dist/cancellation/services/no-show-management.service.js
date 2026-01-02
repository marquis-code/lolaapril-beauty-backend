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
const mongoose_2 = require("mongoose");
const no_show_record_schema_1 = require("../schemas/no-show-record.schema");
const client_reliability_schema_1 = require("../schemas/client-reliability.schema");
const event_emitter_1 = require("@nestjs/event-emitter");
let NoShowManagementService = NoShowManagementService_1 = class NoShowManagementService {
    constructor(noShowModel, reliabilityModel, eventEmitter) {
        this.noShowModel = noShowModel;
        this.reliabilityModel = reliabilityModel;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(NoShowManagementService_1.name);
    }
    async recordNoShow(data) {
        const noShowRecord = await this.noShowModel.create({
            clientId: new mongoose_2.Types.ObjectId(data.clientId),
            businessId: new mongoose_2.Types.ObjectId(data.businessId),
            appointmentId: new mongoose_2.Types.ObjectId(data.appointmentId),
            bookingId: data.bookingId ? new mongoose_2.Types.ObjectId(data.bookingId) : undefined,
            appointmentDate: data.appointmentDate,
            scheduledTime: data.scheduledTime,
            bookedAmount: data.bookedAmount,
            depositAmount: data.depositAmount || 0,
            wasDeposited: data.wasDeposited,
            depositForfeited: data.wasDeposited,
            type: 'no_show',
            recordedAt: new Date()
        });
        await this.updateReliabilityScore(data.clientId, data.businessId, 'no_show');
        this.eventEmitter.emit('no_show.recorded', {
            noShowRecord,
            clientId: data.clientId,
            businessId: data.businessId
        });
        this.logger.log(`No-show recorded for client ${data.clientId} on appointment ${data.appointmentId}`);
    }
    async recordLateCancellation(data) {
        const type = data.hoursNotice < 24 ? 'late_cancellation' : 'same_day_cancellation';
        await this.noShowModel.create({
            clientId: new mongoose_2.Types.ObjectId(data.clientId),
            businessId: new mongoose_2.Types.ObjectId(data.businessId),
            appointmentId: new mongoose_2.Types.ObjectId(data.appointmentId),
            bookingId: data.bookingId ? new mongoose_2.Types.ObjectId(data.bookingId) : undefined,
            appointmentDate: data.appointmentDate,
            scheduledTime: data.scheduledTime,
            bookedAmount: data.bookedAmount,
            penaltyCharged: data.penaltyCharged,
            type,
            recordedAt: new Date()
        });
        await this.updateReliabilityScore(data.clientId, data.businessId, type);
        this.logger.log(`Late cancellation recorded for client ${data.clientId}: ${type}`);
    }
    async updateReliabilityScore(clientId, businessId, incidentType) {
        const updateData = {};
        switch (incidentType) {
            case 'no_show':
                updateData.$inc = {
                    noShowCount: 1,
                    reliabilityScore: -15,
                    totalBookings: 1
                };
                updateData.$set = {
                    lastNoShowDate: new Date(),
                    requiresDeposit: true,
                    riskLevel: 'high'
                };
                break;
            case 'late_cancellation':
            case 'same_day_cancellation':
                updateData.$inc = {
                    lateCancellations: 1,
                    cancelledBookings: 1,
                    reliabilityScore: -10,
                    totalBookings: 1
                };
                updateData.$set = {
                    lastCancellationDate: new Date()
                };
                break;
            case 'completed':
                updateData.$inc = {
                    completedBookings: 1,
                    onTimeArrivals: 1,
                    reliabilityScore: 2,
                    totalBookings: 1
                };
                updateData.$set = {
                    lastCompletedDate: new Date()
                };
                updateData.$min = { reliabilityScore: 100 };
                break;
        }
        await this.reliabilityModel
            .findOneAndUpdate({
            clientId: new mongoose_2.Types.ObjectId(clientId),
            businessId: new mongoose_2.Types.ObjectId(businessId)
        }, updateData, { upsert: true, new: true })
            .exec();
        const reliability = await this.getClientReliability(clientId, businessId);
        if (reliability.noShowCount >= 3) {
            await this.flagForReview(clientId, businessId, 'Multiple no-shows');
        }
    }
    async getClientReliability(clientId, businessId) {
        const reliabilityDoc = await this.reliabilityModel
            .findOne({
            clientId: new mongoose_2.Types.ObjectId(clientId),
            businessId: new mongoose_2.Types.ObjectId(businessId)
        })
            .exec();
        if (!reliabilityDoc) {
            const created = await this.reliabilityModel.create({
                clientId: new mongoose_2.Types.ObjectId(clientId),
                businessId: new mongoose_2.Types.ObjectId(businessId),
                reliabilityScore: 100,
                riskLevel: 'low'
            });
            return JSON.parse(JSON.stringify(created));
        }
        return JSON.parse(JSON.stringify(reliabilityDoc));
    }
    async shouldRequireDeposit(clientId, businessId) {
        const reliability = await this.getClientReliability(clientId, businessId);
        if (reliability.isBlacklisted) {
            return {
                requiresDeposit: true,
                reason: 'Client is blacklisted',
                score: 0
            };
        }
        if (reliability.noShowCount >= 2 ||
            reliability.lateCancellations >= 3 ||
            reliability.reliabilityScore < 70) {
            return {
                requiresDeposit: true,
                reason: 'History of no-shows or late cancellations',
                score: reliability.reliabilityScore
            };
        }
        return {
            requiresDeposit: false,
            reason: 'Good reliability history',
            score: reliability.reliabilityScore
        };
    }
    async flagForReview(clientId, businessId, reason) {
        await this.reliabilityModel.updateOne({
            clientId: new mongoose_2.Types.ObjectId(clientId),
            businessId: new mongoose_2.Types.ObjectId(businessId)
        }, {
            $set: {
                requiresDeposit: true,
                riskLevel: 'high',
                notes: reason
            }
        }).exec();
        this.eventEmitter.emit('client.flagged', {
            clientId,
            businessId,
            reason
        });
        this.logger.warn(`Client ${clientId} flagged: ${reason}`);
    }
    async getNoShowStats(businessId, startDate, endDate) {
        const matchStage = {
            businessId: new mongoose_2.Types.ObjectId(businessId)
        };
        if (startDate && endDate) {
            matchStage.recordedAt = {
                $gte: startDate,
                $lte: endDate
            };
        }
        const stats = await this.noShowModel.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    totalLost: { $sum: '$bookedAmount' },
                    totalPenalties: { $sum: '$penaltyCharged' }
                }
            }
        ]).exec();
        return {
            stats,
            totalIncidents: stats.reduce((sum, s) => sum + s.count, 0),
            totalRevenueLost: stats.reduce((sum, s) => sum + s.totalLost, 0),
            totalPenaltiesCollected: stats.reduce((sum, s) => sum + s.totalPenalties, 0)
        };
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