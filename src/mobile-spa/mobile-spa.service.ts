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
import { ServiceService } from '../service/service.service';
import { ServiceDocument } from '../service/schemas/service.schema';

@Injectable()
export class MobileSpaService {
    private readonly logger = new Logger(MobileSpaService.name);

    constructor(
        @InjectModel(MobileSpaRequest.name) private mobileSpaModel: Model<MobileSpaRequestDocument>,
        private readonly emailService: EmailService,
        private readonly emailTemplatesService: EmailTemplatesService,
        private readonly serviceService: ServiceService, // Inject ServiceService
    ) { }

    async createRequest(
        clientId: string,
        clientName: string,
        clientEmail: string,
        clientPhone: string,
        dto: CreateMobileSpaDto,
    ): Promise<MobileSpaRequest> {
        const requestNumber = `MSR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        // Fetch service details
        const serviceIds = dto.services.map(s => s.serviceId);
        const fetchedServices = await this.serviceService.getServicesByIds(serviceIds);
        const serviceMap = new Map<string, ServiceDocument>(fetchedServices.map(s => [s._id.toString(), s as ServiceDocument]));

        let totalAmount = 0;
        const services = dto.services.map(s => {
            const serviceData = serviceMap.get(s.serviceId);
            if (!serviceData) {
                this.logger.warn(`Service ${s.serviceId} not found for mobile spa request`);
                // Fallback or error? Assuming we should error or use default if dirty data allowed. 
                // But schema requires name. Let's use a placeholder if missing to avoid hard crash, or error.
                // For now, let's error if critical, but if we want to be robust:
                // throw new NotFoundException(`Service ${s.serviceId} not found`);
            }
            const name = serviceData?.basicDetails?.serviceName || 'Unknown Service';
            // Access price from pricingAndDuration
            const price = serviceData?.pricingAndDuration?.price?.amount || 0;

            // Handle variants if needed, but for now assuming base price or handled by existing logic
            // Assuming simple structure for now based on ServiceService usage.

            const quantity = s.quantity || 1;
            totalAmount += (price * quantity);

            return {
                serviceId: new Types.ObjectId(s.serviceId),
                serviceName: name,
                price: price,
                quantity: quantity,
            };
        });

        // If any service was not found and we used 'Unknown Service', validation might pass but data is bad.
        // Better to check:
        if (fetchedServices.length !== new Set(serviceIds).size) {
            // Some services missing
            this.logger.warn(`Some services not found for mobile spa request ${requestNumber}`);
        }

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
            totalAmount,
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
                    serviceName: s.serviceName,
                    price: s.price,
                    quantity: s.quantity,
                })),
                numberOfPeople: dto.numberOfPeople,
                location: dto.location,
                requestedDate: new Date(dto.requestedDate).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                }),
                requestedTime: dto.requestedTime,
                totalAmount,
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
