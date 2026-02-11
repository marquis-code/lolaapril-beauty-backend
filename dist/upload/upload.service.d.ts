/// <reference types="multer" />
export declare class UploadService {
    constructor();
    uploadImage(businessId: string, file: Express.Multer.File, folder?: string): Promise<{
        url: string;
        publicId: string;
    }>;
    uploadMultipleImages(businessId: string, files: Express.Multer.File[], folder?: string): Promise<{
        url: string;
        publicId: string;
    }[]>;
    deleteImage(businessId: string, publicId: string): Promise<void>;
    uploadDocument(businessId: string, file: Express.Multer.File, folder?: string): Promise<{
        url: string;
        publicId: string;
    }>;
    uploadKYCDocument(file: Express.Multer.File, businessId: string, documentType: 'businessRegistration' | 'taxIdentification' | 'governmentId' | 'bankStatement' | 'proofOfAddress'): Promise<{
        url: string;
        publicId: string;
        documentType: string;
    }>;
}
