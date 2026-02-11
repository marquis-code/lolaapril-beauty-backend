import { MobileSpaService } from './mobile-spa.service';
import { CreateMobileSpaDto, AcceptMobileSpaDto, SuggestTimeMobileSpaDto, RejectMobileSpaDto } from './dto/mobile-spa.dto';
export declare class MobileSpaController {
    private readonly mobileSpaService;
    constructor(mobileSpaService: MobileSpaService);
    createRequest(user: any, dto: CreateMobileSpaDto): Promise<{
        success: boolean;
        data: import("./schemas/mobile-spa-request.schema").MobileSpaRequest;
        message: string;
    }>;
    getBusinessRequests(businessId: string, status?: string, page?: number, limit?: number): Promise<{
        success: boolean;
        data: {
            requests: import("./schemas/mobile-spa-request.schema").MobileSpaRequest[];
            total: number;
        };
    }>;
    getMyRequests(user: any): Promise<{
        success: boolean;
        data: import("./schemas/mobile-spa-request.schema").MobileSpaRequest[];
    }>;
    getRequest(id: string): Promise<{
        success: boolean;
        data: import("./schemas/mobile-spa-request.schema").MobileSpaRequest;
    }>;
    acceptRequest(id: string, dto: AcceptMobileSpaDto): Promise<{
        success: boolean;
        data: import("./schemas/mobile-spa-request.schema").MobileSpaRequest;
        message: string;
    }>;
    suggestTime(id: string, dto: SuggestTimeMobileSpaDto): Promise<{
        success: boolean;
        data: import("./schemas/mobile-spa-request.schema").MobileSpaRequest;
        message: string;
    }>;
    rejectRequest(id: string, dto: RejectMobileSpaDto): Promise<{
        success: boolean;
        data: import("./schemas/mobile-spa-request.schema").MobileSpaRequest;
        message: string;
    }>;
    markPaid(id: string): Promise<{
        success: boolean;
        data: import("./schemas/mobile-spa-request.schema").MobileSpaRequest;
        message: string;
    }>;
    markCompleted(id: string): Promise<{
        success: boolean;
        data: import("./schemas/mobile-spa-request.schema").MobileSpaRequest;
        message: string;
    }>;
}
