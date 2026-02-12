import { Model } from 'mongoose';
import { MobileSpaRequest, MobileSpaRequestDocument } from './schemas/mobile-spa-request.schema';
import { CreateMobileSpaDto, AcceptMobileSpaDto, SuggestTimeMobileSpaDto, RejectMobileSpaDto } from './dto/mobile-spa.dto';
import { EmailService } from '../notification/email.service';
import { EmailTemplatesService } from '../notification/templates/email-templates.service';
import { ServiceService } from '../service/service.service';
import { ConfigService } from '@nestjs/config';
export declare class MobileSpaService {
    private mobileSpaModel;
    private readonly emailService;
    private readonly emailTemplatesService;
    private readonly serviceService;
    private readonly configService;
    private readonly logger;
    constructor(mobileSpaModel: Model<MobileSpaRequestDocument>, emailService: EmailService, emailTemplatesService: EmailTemplatesService, serviceService: ServiceService, configService: ConfigService);
    createRequest(clientId: string, clientName: string, clientEmail: string, clientPhone: string, dto: CreateMobileSpaDto): Promise<MobileSpaRequest>;
    acceptRequest(requestId: string, dto: AcceptMobileSpaDto): Promise<MobileSpaRequest>;
    suggestNewTime(requestId: string, dto: SuggestTimeMobileSpaDto): Promise<MobileSpaRequest>;
    rejectRequest(requestId: string, dto: RejectMobileSpaDto): Promise<MobileSpaRequest>;
    getRequestsByBusiness(businessId: string, status?: string, page?: number, limit?: number): Promise<{
        requests: MobileSpaRequest[];
        total: number;
    }>;
    getRequestsByClient(clientId: string): Promise<MobileSpaRequest[]>;
    getRequestById(requestId: string): Promise<MobileSpaRequest>;
    markAsPaid(requestId: string): Promise<MobileSpaRequest>;
    markAsCompleted(requestId: string): Promise<MobileSpaRequest>;
}
