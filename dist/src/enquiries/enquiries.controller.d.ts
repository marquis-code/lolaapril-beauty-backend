import { EnquiriesService } from "./enquiries.service";
import { CreateEnquiryDto } from "./dto/create-enquiry.dto";
export declare class EnquiriesController {
    private readonly enquiriesService;
    constructor(enquiriesService: EnquiriesService);
    create(createEnquiryDto: CreateEnquiryDto): Promise<import("./schemas/enquiry.schema").Enquiry>;
    findAll(): Promise<import("./schemas/enquiry.schema").Enquiry[]>;
    findOne(id: string): Promise<import("./schemas/enquiry.schema").Enquiry>;
    softDelete(id: string, user: any): Promise<void>;
    hardDelete(id: string): Promise<void>;
}
