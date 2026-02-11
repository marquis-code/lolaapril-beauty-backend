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
var MobileSpaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileSpaService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mobile_spa_request_schema_1 = require("./schemas/mobile-spa-request.schema");
const email_service_1 = require("../notification/email.service");
const email_templates_service_1 = require("../notification/templates/email-templates.service");
let MobileSpaService = MobileSpaService_1 = class MobileSpaService {
    constructor(mobileSpaModel, emailService, emailTemplatesService) {
        this.mobileSpaModel = mobileSpaModel;
        this.emailService = emailService;
        this.emailTemplatesService = emailTemplatesService;
        this.logger = new common_1.Logger(MobileSpaService_1.name);
    }
    async createRequest(clientId, clientName, clientEmail, clientPhone, dto) {
        const requestNumber = `MSR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const services = dto.services.map(s => ({
            serviceId: new mongoose_2.Types.ObjectId(s.serviceId),
            serviceName: '',
            price: 0,
            quantity: s.quantity || 1,
        }));
        const request = new this.mobileSpaModel({
            clientId: new mongoose_2.Types.ObjectId(clientId),
            clientName,
            clientEmail,
            clientPhone,
            businessId: new mongoose_2.Types.ObjectId(dto.businessId),
            services,
            numberOfPeople: dto.numberOfPeople,
            location: dto.location,
            requestedDate: new Date(dto.requestedDate),
            requestedTime: dto.requestedTime,
            clientNotes: dto.clientNotes,
            totalAmount: 0,
            requestNumber,
            status: 'pending',
        });
        const saved = await request.save();
        try {
            const emailData = this.emailTemplatesService.mobileSpaRequestToBusiness({
                clientName,
                clientEmail,
                clientPhone,
                services: services.map(s => ({
                    serviceName: s.serviceName || 'Service',
                    price: s.price,
                    quantity: s.quantity,
                })),
                numberOfPeople: dto.numberOfPeople,
                location: dto.location,
                requestedDate: new Date(dto.requestedDate).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                }),
                requestedTime: dto.requestedTime,
                totalAmount: 0,
                requestId: saved._id.toString(),
            });
            const businessEmail = process.env.STAFF_NOTIFICATION_EMAIL || 'admin@lolaapril.com';
            await this.emailService.sendEmail(businessEmail, emailData.subject, emailData.html);
            this.logger.log(`✅ Mobile SPA request notification sent to business for ${requestNumber}`);
        }
        catch (err) {
            this.logger.error(`Failed to send mobile SPA request email: ${err.message}`);
        }
        return saved;
    }
    async acceptRequest(requestId, dto) {
        const request = await this.mobileSpaModel.findById(requestId);
        if (!request)
            throw new common_1.NotFoundException('Mobile SPA request not found');
        if (request.status !== 'pending' && request.status !== 'time_suggested') {
            throw new common_1.BadRequestException('This request cannot be accepted in its current state');
        }
        request.status = 'accepted';
        request.paymentLink = dto.paymentLink || '';
        request.businessNotes = dto.businessNotes || request.businessNotes;
        const updated = await request.save();
        try {
            const emailData = this.emailTemplatesService.mobileSpaAccepted({
                clientName: request.clientName,
                businessName: request.businessName || 'Lola April',
                services: request.services.map(s => ({
                    serviceName: s.serviceName,
                    price: s.price,
                    quantity: s.quantity || 1,
                })),
                confirmedDate: new Date(request.requestedDate).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                }),
                confirmedTime: request.requestedTime || 'TBD',
                totalAmount: request.totalAmount,
                paymentLink: dto.paymentLink || `${process.env.FRONTEND_URL}/pay/${requestId}`,
            });
            await this.emailService.sendEmail(request.clientEmail, emailData.subject, emailData.html);
            this.logger.log(`✅ Mobile SPA acceptance email sent to ${request.clientEmail}`);
        }
        catch (err) {
            this.logger.error(`Failed to send acceptance email: ${err.message}`);
        }
        return updated;
    }
    async suggestNewTime(requestId, dto) {
        const request = await this.mobileSpaModel.findById(requestId);
        if (!request)
            throw new common_1.NotFoundException('Mobile SPA request not found');
        request.status = 'time_suggested';
        request.suggestedDate = new Date(dto.suggestedDate);
        request.suggestedTime = dto.suggestedTime;
        request.businessNotes = dto.businessNotes || request.businessNotes;
        const updated = await request.save();
        try {
            const emailData = this.emailTemplatesService.mobileSpaTimeSuggestion({
                clientName: request.clientName,
                businessName: request.businessName || 'Lola April',
                originalDate: new Date(request.requestedDate).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                }),
                originalTime: request.requestedTime || 'Not specified',
                suggestedDate: new Date(dto.suggestedDate).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                }),
                suggestedTime: dto.suggestedTime,
                businessNotes: dto.businessNotes,
                requestId: requestId,
            });
            await this.emailService.sendEmail(request.clientEmail, emailData.subject, emailData.html);
            this.logger.log(`✅ Time suggestion email sent to ${request.clientEmail}`);
        }
        catch (err) {
            this.logger.error(`Failed to send time suggestion email: ${err.message}`);
        }
        return updated;
    }
    async rejectRequest(requestId, dto) {
        const request = await this.mobileSpaModel.findById(requestId);
        if (!request)
            throw new common_1.NotFoundException('Mobile SPA request not found');
        request.status = 'rejected';
        request.businessNotes = dto.reason || 'Request declined';
        const updated = await request.save();
        return updated;
    }
    async getRequestsByBusiness(businessId, status, page = 1, limit = 20) {
        const filter = { businessId: new mongoose_2.Types.ObjectId(businessId) };
        if (status)
            filter.status = status;
        const skip = (page - 1) * limit;
        const [requests, total] = await Promise.all([
            this.mobileSpaModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.mobileSpaModel.countDocuments(filter),
        ]);
        return { requests, total };
    }
    async getRequestsByClient(clientId) {
        return this.mobileSpaModel.find({
            clientId: new mongoose_2.Types.ObjectId(clientId),
        }).sort({ createdAt: -1 }).lean();
    }
    async getRequestById(requestId) {
        const request = await this.mobileSpaModel.findById(requestId);
        if (!request)
            throw new common_1.NotFoundException('Mobile SPA request not found');
        return request;
    }
    async markAsPaid(requestId) {
        const request = await this.mobileSpaModel.findByIdAndUpdate(requestId, { paymentStatus: 'paid', status: 'paid' }, { new: true });
        if (!request)
            throw new common_1.NotFoundException('Mobile SPA request not found');
        return request;
    }
    async markAsCompleted(requestId) {
        const request = await this.mobileSpaModel.findByIdAndUpdate(requestId, { status: 'completed' }, { new: true });
        if (!request)
            throw new common_1.NotFoundException('Mobile SPA request not found');
        return request;
    }
};
MobileSpaService = MobileSpaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(mobile_spa_request_schema_1.MobileSpaRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        email_service_1.EmailService,
        email_templates_service_1.EmailTemplatesService])
], MobileSpaService);
exports.MobileSpaService = MobileSpaService;
//# sourceMappingURL=mobile-spa.service.js.map