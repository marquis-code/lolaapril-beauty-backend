import type * as Express from "express";
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
}
