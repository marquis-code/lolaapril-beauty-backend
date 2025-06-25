import { Model } from "mongoose";
import { Enquiry, EnquiryDocument } from "./schemas/enquiry.schema";
import { CreateEnquiryDto } from "./dto/create-enquiry.dto";
export declare class EnquiriesService {
    private enquiryModel;
    constructor(enquiryModel: Model<EnquiryDocument>);
    create(createEnquiryDto: CreateEnquiryDto): Promise<Enquiry>;
    findAll(): Promise<Enquiry[]>;
    findOne(id: string): Promise<Enquiry>;
    softDelete(id: string, deletedBy: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
}
