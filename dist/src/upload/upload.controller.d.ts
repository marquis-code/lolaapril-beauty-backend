import type { UploadService } from "./upload.service";
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
}
