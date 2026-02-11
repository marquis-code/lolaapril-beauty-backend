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
exports.ClientReliabilityService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const client_reliability_schema_1 = require("../schemas/client-reliability.schema");
let ClientReliabilityService = class ClientReliabilityService {
    constructor(reliabilityModel) {
        this.reliabilityModel = reliabilityModel;
    }
    async getClientScore(clientId) {
        const record = await this.reliabilityModel
            .findOne({ clientId: new mongoose_2.Types.ObjectId(clientId) })
            .lean()
            .exec();
        return record?.reliabilityScore || 100;
    }
    async shouldRequireDeposit(clientId) {
        const record = await this.reliabilityModel
            .findOne({ clientId: new mongoose_2.Types.ObjectId(clientId) })
            .lean()
            .exec();
        if (!record)
            return false;
        return (record.noShowCount >= 2 ||
            record.lateCancellations >= 3 ||
            record.reliabilityScore < 70);
    }
    async recordNoShow(clientId) {
        await this.reliabilityModel.findOneAndUpdate({ clientId: new mongoose_2.Types.ObjectId(clientId) }, {
            $inc: {
                noShowCount: 1,
                reliabilityScore: -15
            },
            $set: {
                lastNoShowDate: new Date(),
                requiresDeposit: true
            }
        }, { upsert: true }).exec();
    }
    async recordLateCancellation(clientId) {
        await this.reliabilityModel.findOneAndUpdate({ clientId: new mongoose_2.Types.ObjectId(clientId) }, {
            $inc: {
                lateCancellations: 1,
                cancelledBookings: 1,
                reliabilityScore: -5
            },
            $set: { lastCancellationDate: new Date() }
        }, { upsert: true }).exec();
    }
    async recordCompletion(clientId, wasOnTime) {
        const scoreIncrease = wasOnTime ? 2 : 1;
        await this.reliabilityModel.findOneAndUpdate({ clientId: new mongoose_2.Types.ObjectId(clientId) }, {
            $inc: {
                completedBookings: 1,
                reliabilityScore: scoreIncrease,
                ...(wasOnTime && { onTimeArrivals: 1 })
            },
            $min: { reliabilityScore: 100 }
        }, { upsert: true }).exec();
    }
};
ClientReliabilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(client_reliability_schema_1.ClientReliability.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ClientReliabilityService);
exports.ClientReliabilityService = ClientReliabilityService;
//# sourceMappingURL=client-reliability.service.js.map