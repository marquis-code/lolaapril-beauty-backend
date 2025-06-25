import { Model } from "mongoose";
import { Publication, PublicationDocument } from "./schemas/publication.schema";
import { CreatePublicationDto } from "./dto/create-publication.dto";
import { UpdatePublicationDto } from "./dto/update-publication.dto";
import { PublicationStatus } from "../common/enums";
export declare class PublicationsService {
    private publicationModel;
    constructor(publicationModel: Model<PublicationDocument>);
    create(createPublicationDto: CreatePublicationDto): Promise<Publication>;
    findAll(status?: PublicationStatus): Promise<Publication[]>;
    findPublished(): Promise<Publication[]>;
    findOne(id: string): Promise<Publication>;
    update(id: string, updatePublicationDto: UpdatePublicationDto): Promise<Publication>;
    submitForReview(id: string): Promise<Publication>;
    approve(id: string, reviewedBy: string): Promise<Publication>;
    reject(id: string, reviewedBy: string, rejectionReason: string): Promise<Publication>;
    publish(id: string): Promise<Publication>;
    softDelete(id: string, deletedBy: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    restore(id: string): Promise<Publication>;
}
