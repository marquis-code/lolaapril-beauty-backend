/// <reference types="multer" />
import { UploadService } from "./upload.service";
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadImage(file: Express.Multer.File): Promise<{
        url: string;
        publicId: string;
    }>;
    uploadImages(files: Express.Multer.File[]): Promise<{
        url: string;
        publicId: string;
    }[]>;
    uploadDocument(file: Express.Multer.File): Promise<{
        url: string;
        publicId: string;
    }>;
    deleteImage(publicId: string): Promise<{
        message: string;
    }>;
    uploadKYCDocument(file: Express.Multer.File, businessId: string, documentType: 'businessRegistration' | 'taxIdentification' | 'governmentId' | 'bankStatement' | 'proofOfAddress', user: any): Promise<{
        success: boolean;
        data: {
            uploadedAt: Date;
            url: string;
            publicId: string;
            documentType: string;
        };
        message: string;
    }>;
}
