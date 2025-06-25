import { PublicationsService } from "./publications.service";
import { CreatePublicationDto } from "./dto/create-publication.dto";
import { UpdatePublicationDto } from "./dto/update-publication.dto";
import { ReviewPublicationDto } from "./dto/review-publication.dto";
import { type PublicationStatus } from "../common/enums";
export declare class PublicationsController {
    private readonly publicationsService;
    constructor(publicationsService: PublicationsService);
    create(createPublicationDto: CreatePublicationDto): Promise<import("./schemas/publication.schema").Publication>;
    findAll(status?: PublicationStatus): Promise<import("./schemas/publication.schema").Publication[]>;
    findPublished(): Promise<import("./schemas/publication.schema").Publication[]>;
    findOne(id: string): Promise<import("./schemas/publication.schema").Publication>;
    update(id: string, updatePublicationDto: UpdatePublicationDto): Promise<import("./schemas/publication.schema").Publication>;
    submitForReview(id: string): Promise<import("./schemas/publication.schema").Publication>;
    approve(id: string, user: any): Promise<import("./schemas/publication.schema").Publication>;
    reject(id: string, reviewDto: ReviewPublicationDto, user: any): Promise<import("./schemas/publication.schema").Publication>;
    publish(id: string): Promise<import("./schemas/publication.schema").Publication>;
    softDelete(id: string, user: any): Promise<void>;
    hardDelete(id: string, user: any): Promise<void>;
}
