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
exports.MembershipService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongoose_3 = require("mongoose");
const membership_schema_1 = require("./schemas/membership.schema");
const client_membership_schema_1 = require("./schemas/client-membership.schema");
let MembershipService = class MembershipService {
    constructor(membershipModel, clientMembershipModel) {
        this.membershipModel = membershipModel;
        this.clientMembershipModel = clientMembershipModel;
    }
    async createMembership(createMembershipDto) {
        const membership = new this.membershipModel(createMembershipDto);
        return membership.save();
    }
    async findAllMemberships(query) {
        const { page = 1, limit = 10, membershipType, isActive, search, sortBy = "createdAt", sortOrder = "desc" } = query;
        const filter = {};
        if (membershipType)
            filter.membershipType = membershipType;
        if (isActive !== undefined)
            filter.isActive = isActive;
        if (search) {
            filter.$or = [
                { membershipName: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (page - 1) * limit;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
        const memberships = await this.membershipModel
            .find(filter)
            .populate("createdBy", "firstName lastName email")
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await this.membershipModel.countDocuments(filter);
        return {
            memberships,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findMembershipById(id) {
        const membership = await this.membershipModel.findById(id).populate("createdBy", "firstName lastName email").exec();
        if (!membership) {
            throw new common_1.NotFoundException("Membership not found");
        }
        return membership;
    }
    async updateMembership(id, updateMembershipDto) {
        const membership = await this.membershipModel
            .findByIdAndUpdate(id, Object.assign(Object.assign({}, updateMembershipDto), { updatedAt: new Date() }), { new: true })
            .populate("createdBy", "firstName lastName email")
            .exec();
        if (!membership) {
            throw new common_1.NotFoundException("Membership not found");
        }
        return membership;
    }
    async removeMembership(id) {
        const result = await this.membershipModel.findByIdAndDelete(id);
        if (!result) {
            throw new common_1.NotFoundException("Membership not found");
        }
    }
    async enrollClient(createClientMembershipDto) {
        const existingMembership = await this.clientMembershipModel.findOne({
            clientId: createClientMembershipDto.clientId,
            membershipId: createClientMembershipDto.membershipId,
            status: "active",
        });
        if (existingMembership) {
            throw new common_1.BadRequestException("Client already has an active membership of this type");
        }
        const clientMembership = new this.clientMembershipModel(createClientMembershipDto);
        return clientMembership.save();
    }
    async findClientMemberships(clientId) {
        return this.clientMembershipModel
            .find({ clientId })
            .populate("membershipId")
            .populate("clientId", "firstName lastName email")
            .sort({ joinDate: -1 })
            .exec();
    }
    async findClientMembershipById(id) {
        const clientMembership = await this.clientMembershipModel
            .findById(id)
            .populate("membershipId")
            .populate("clientId", "firstName lastName email")
            .exec();
        if (!clientMembership) {
            throw new common_1.NotFoundException("Client membership not found");
        }
        return clientMembership;
    }
    async addPoints(clientMembershipId, points, description, saleId, appointmentId) {
        const clientMembership = await this.clientMembershipModel.findById(clientMembershipId);
        if (!clientMembership) {
            throw new common_1.NotFoundException("Client membership not found");
        }
        const pointsTransaction = {
            transactionType: "earned",
            points,
            description,
            transactionDate: new Date(),
        };
        if (saleId) {
            pointsTransaction.saleId = new mongoose_3.Types.ObjectId(saleId);
        }
        if (appointmentId) {
            pointsTransaction.appointmentId = new mongoose_3.Types.ObjectId(appointmentId);
        }
        clientMembership.totalPoints += points;
        clientMembership.pointsHistory.push(pointsTransaction);
        clientMembership.lastActivity = new Date();
        clientMembership.updatedAt = new Date();
        await this.checkTierUpgrade(clientMembership);
        return clientMembership.save();
    }
    async redeemPoints(clientMembershipId, points, description, appointmentId) {
        const clientMembership = await this.clientMembershipModel.findById(clientMembershipId);
        if (!clientMembership) {
            throw new common_1.NotFoundException("Client membership not found");
        }
        if (clientMembership.totalPoints < points) {
            throw new common_1.BadRequestException("Insufficient points");
        }
        const pointsTransaction = {
            transactionType: "redeemed",
            points: -points,
            description,
            transactionDate: new Date(),
        };
        if (appointmentId) {
            pointsTransaction.appointmentId = new mongoose_3.Types.ObjectId(appointmentId);
        }
        clientMembership.totalPoints -= points;
        clientMembership.pointsHistory.push(pointsTransaction);
        clientMembership.lastActivity = new Date();
        clientMembership.updatedAt = new Date();
        return clientMembership.save();
    }
    async updateSpending(clientMembershipId, amount) {
        const clientMembership = await this.clientMembershipModel.findById(clientMembershipId);
        if (!clientMembership) {
            throw new common_1.NotFoundException("Client membership not found");
        }
        clientMembership.totalSpent += amount;
        clientMembership.lastActivity = new Date();
        clientMembership.updatedAt = new Date();
        await this.checkTierUpgrade(clientMembership);
        return clientMembership.save();
    }
    async checkTierUpgrade(clientMembership) {
        const membership = await this.membershipModel.findById(clientMembership.membershipId);
        if (!membership || membership.membershipType !== "tier_based") {
            return;
        }
        const qualifyingTiers = membership.tiers
            .filter((tier) => clientMembership.totalSpent >= tier.minimumSpend)
            .sort((a, b) => b.tierLevel - a.tierLevel);
        if (qualifyingTiers.length > 0) {
            const newTier = qualifyingTiers[0];
            if (newTier.tierName !== clientMembership.currentTier) {
                clientMembership.currentTier = newTier.tierName;
                const nextTier = membership.tiers.find((tier) => tier.tierLevel > newTier.tierLevel);
                if (nextTier) {
                    const progressAmount = clientMembership.totalSpent - newTier.minimumSpend;
                    const tierRange = nextTier.minimumSpend - newTier.minimumSpend;
                    clientMembership.tierProgress = Math.min(100, (progressAmount / tierRange) * 100);
                }
                else {
                    clientMembership.tierProgress = 100;
                }
            }
        }
    }
    async getMembershipStats() {
        const [membershipStats, clientMembershipStats] = await Promise.all([
            this.membershipModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: { $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] } },
                        byType: {
                            $push: {
                                type: "$membershipType",
                                count: 1,
                            },
                        },
                    },
                },
            ]),
            this.clientMembershipModel.aggregate([
                {
                    $group: {
                        _id: null,
                        totalMembers: { $sum: 1 },
                        activeMembers: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
                        totalPointsIssued: { $sum: "$totalPoints" },
                        totalSpending: { $sum: "$totalSpent" },
                    },
                },
            ]),
        ]);
        const tierDistribution = await this.clientMembershipModel.aggregate([
            { $match: { status: "active" } },
            {
                $group: {
                    _id: "$currentTier",
                    count: { $sum: 1 },
                },
            },
        ]);
        return {
            programs: membershipStats[0] || { total: 0, active: 0, byType: [] },
            members: clientMembershipStats[0] || {
                totalMembers: 0,
                activeMembers: 0,
                totalPointsIssued: 0,
                totalSpending: 0,
            },
            tierDistribution,
        };
    }
    async getClientMembershipBenefits(clientId) {
        const clientMemberships = await this.clientMembershipModel
            .find({ clientId, status: "active" })
            .populate("membershipId")
            .exec();
        const benefits = [];
        for (const clientMembership of clientMemberships) {
            const membership = clientMembership.membershipId;
            benefits.push(...membership.generalBenefits);
            if (clientMembership.currentTier) {
                const currentTier = membership.tiers.find((tier) => tier.tierName === clientMembership.currentTier);
                if (currentTier) {
                    benefits.push(...currentTier.benefits);
                }
            }
        }
        return benefits;
    }
};
MembershipService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(membership_schema_1.Membership.name)),
    __param(1, (0, mongoose_1.InjectModel)(client_membership_schema_1.ClientMembership.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], MembershipService);
exports.MembershipService = MembershipService;
//# sourceMappingURL=membership.service.js.map