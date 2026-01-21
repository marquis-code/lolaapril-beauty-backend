/// <reference types="multer" />
export declare class UploadService {
    constructor();
    uploadImage(file: Express.Multer.File, folder?: string): Promise<{
        url: string;
        publicId: string;
    }>;
    uploadMultipleImages(files: Express.Multer.File[], folder?: string): Promise<{
        url: string;
        publicId: string;
    }[]>;
    deleteImage(publicId: string): Promise<void>;
    uploadDocument(file: Express.Multer.File, folder?: string): Promise<{
        url: string;
        publicId: string;
    }>;
    uploadKYCDocument(file: Express.Multer.File, businessId: string, documentType: 'businessRegistration' | 'taxIdentification' | 'governmentId' | 'bankStatement' | 'proofOfAddress'): Promise<{
        url: string;
        publicId: string;
        documentType: string;
    }>;
}
