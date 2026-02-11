import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MobileSpaRequest, MobileSpaRequestDocument } from './schemas/mobile-spa-request.schema';
import {
    CreateMobileSpaDto,
    AcceptMobileSpaDto,
    SuggestTimeMobileSpaDto,
    RejectMobileSpaDto,
} from './dto/mobile-spa.dto';
import { EmailService } from '../notification/email.service';
import { EmailTemplatesService } from '../notification/templates/email-templates.service';

@Injectable()
export class MobileSpaService {
    private readonly logger = new Logger(MobileSpaService.name);

    constructor(
        @InjectModel(MobileSpaRequest.name) private mobileSpaModel: Model<MobileSpaRequestDocument>,
        private readonly emailService: EmailService,
        private readonly emailTemplatesService: EmailTemplatesService,
    ) { }

    async createRequest(
        clientId: string,
        clientName: string,
        clientEmail: string,
        clientPhone: string,
        dto: CreateMobileSpaDto,
    ): Promise<MobileSpaRequest> {
        const requestNumber = `MSR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        // Calculate total amount (services would be looked up in a real scenario)
        const services = dto.services.map(s => ({
            serviceId: new Types.ObjectId(s.serviceId),
            serviceName: '', // Will be populated via service lookup
            price: 0,
            quantity: s.quantity || 1,
        }));

        const request = new this.mobileSpaModel({
            clientId: new Types.ObjectId(clientId),
            clientName,
            clientEmail,
            clientPhone,
            businessId: new Types.ObjectId(dto.businessId),
            services,
            numberOfPeople: dto.numberOfPeople,
            location: dto.location,
            requestedDate: new Date(dto.requestedDate),
            requestedTime: dto.requestedTime,
            clientNotes: dto.clientNotes,
            totalAmount: 0, // Will be calculated after service lookup
            requestNumber,
            status: 'pending',
        });

        const saved = await request.save();

        // Notify business about the new request
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
        } catch (err) {
            this.logger.error(`Failed to send mobile SPA request email: ${err.message}`);
        }

        return saved;
    }

    async acceptRequest(requestId: string, dto: AcceptMobileSpaDto): Promise<MobileSpaRequest> {
        const request = await this.mobileSpaModel.findById(requestId);
        if (!request) throw new NotFoundException('Mobile SPA request not found');
        if (request.status !== 'pending' && request.status !== 'time_suggested') {
            throw new BadRequestException('This request cannot be accepted in its current state');
        }

        request.status = 'accepted';
        request.paymentLink = dto.paymentLink || '';
        request.businessNotes = dto.businessNotes || request.businessNotes;
        const updated = await request.save();

        // Notify client about acceptance with payment link
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
        } catch (err) {
            this.logger.error(`Failed to send acceptance email: ${err.message}`);
        }

        return updated;
    }

    async suggestNewTime(requestId: string, dto: SuggestTimeMobileSpaDto): Promise<MobileSpaRequest> {
        const request = await this.mobileSpaModel.findById(requestId);
        if (!request) throw new NotFoundException('Mobile SPA request not found');

        request.status = 'time_suggested';
        request.suggestedDate = new Date(dto.suggestedDate);
        request.suggestedTime = dto.suggestedTime;
        request.businessNotes = dto.businessNotes || request.businessNotes;
        const updated = await request.save();

        // Notify client about the time suggestion
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
        } catch (err) {
            this.logger.error(`Failed to send time suggestion email: ${err.message}`);
        }

        return updated;
    }

    async rejectRequest(requestId: string, dto: RejectMobileSpaDto): Promise<MobileSpaRequest> {
        const request = await this.mobileSpaModel.findById(requestId);
        if (!request) throw new NotFoundException('Mobile SPA request not found');

        request.status = 'rejected';
        request.businessNotes = dto.reason || 'Request declined';
        const updated = await request.save();

        return updated;
    }

    async getRequestsByBusiness(
        businessId: string,
        status?: string,
        page = 1,
        limit = 20,
    ): Promise<{ requests: MobileSpaRequest[]; total: number }> {
        const filter: any = { businessId: new Types.ObjectId(businessId) };
        if (status) filter.status = status;
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

    async getRequestsByClient(clientId: string): Promise<MobileSpaRequest[]> {
        return this.mobileSpaModel.find({
            clientId: new Types.ObjectId(clientId),
        }).sort({ createdAt: -1 }).lean();
    }

    async getRequestById(requestId: string): Promise<MobileSpaRequest> {
        const request = await this.mobileSpaModel.findById(requestId);
        if (!request) throw new NotFoundException('Mobile SPA request not found');
        return request;
    }

    async markAsPaid(requestId: string): Promise<MobileSpaRequest> {
        const request = await this.mobileSpaModel.findByIdAndUpdate(
            requestId,
            { paymentStatus: 'paid', status: 'paid' },
            { new: true },
        );
        if (!request) throw new NotFoundException('Mobile SPA request not found');
        return request;
    }

    async markAsCompleted(requestId: string): Promise<MobileSpaRequest> {
        const request = await this.mobileSpaModel.findByIdAndUpdate(
            requestId,
            { status: 'completed' },
            { new: true },
        );
        if (!request) throw new NotFoundException('Mobile SPA request not found');
        return request;
    }
}
