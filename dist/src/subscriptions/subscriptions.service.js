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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const subscription_schema_1 = require("./schemas/subscription.schema");
const mongoose_2 = require("@nestjs/mongoose");
let SubscriptionsService = class SubscriptionsService {
    constructor(subscriptionModel) {
        this.subscriptionModel = subscriptionModel;
    }
    async create(createSubscriptionDto) {
        const existingSubscription = await this.subscriptionModel.findOne({
            email: createSubscriptionDto.email,
            isDeleted: false,
        });
        if (existingSubscription) {
            throw new common_1.ConflictException("Email already subscribed");
        }
        const subscription = new this.subscriptionModel(createSubscriptionDto);
        return subscription.save();
    }
    async findAll() {
        return this.subscriptionModel.find({ isDeleted: false }).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const subscription = await this.subscriptionModel.findOne({ _id: id, isDeleted: false }).exec();
        if (!subscription) {
            throw new common_1.NotFoundException("Subscription not found");
        }
        return subscription;
    }
    async unsubscribe(email) {
        const result = await this.subscriptionModel.updateOne({ email, isDeleted: false }, { isActive: false });
        if (result.matchedCount === 0) {
            throw new common_1.NotFoundException("Subscription not found");
        }
    }
    async softDelete(id, deletedBy) {
        const result = await this.subscriptionModel.updateOne({ _id: id, isDeleted: false }, { isDeleted: true, deletedAt: new Date(), deletedBy });
        if (result.matchedCount === 0) {
            throw new common_1.NotFoundException("Subscription not found");
        }
    }
    async hardDelete(id) {
        const result = await this.subscriptionModel.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException("Subscription not found");
        }
    }
};
SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(subscription_schema_1.Subscription.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], SubscriptionsService);
exports.SubscriptionsService = SubscriptionsService;
//# sourceMappingURL=subscriptions.service.js.map