"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
let UploadService = class UploadService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async uploadImage(file, folder = "salon-booking") {
        if (!file) {
            throw new common_1.BadRequestException("No file provided");
        }
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException("Invalid file type. Only images are allowed.");
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException("File size too large. Maximum 5MB allowed.");
        }
        try {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    folder,
                    resource_type: "image",
                    transformation: [{ width: 1000, height: 1000, crop: "limit" }, { quality: "auto" }, { format: "auto" }],
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                const stream = stream_1.Readable.from(file.buffer);
                stream.pipe(uploadStream);
            });
            return {
                url: result.secure_url,
                publicId: result.public_id,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException("Failed to upload image");
        }
    }
    async uploadMultipleImages(files, folder = "salon-booking") {
        const uploadPromises = files.map((file) => this.uploadImage(file, folder));
        return Promise.all(uploadPromises);
    }
    async deleteImage(publicId) {
        try {
            await cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch (error) {
            throw new common_1.BadRequestException("Failed to delete image");
        }
    }
    async uploadDocument(file, folder = "salon-booking/documents") {
        if (!file) {
            throw new common_1.BadRequestException("No file provided");
        }
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException("Invalid file type. Only documents are allowed.");
        }
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException("File size too large. Maximum 10MB allowed.");
        }
        try {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    folder,
                    resource_type: "raw",
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                const stream = stream_1.Readable.from(file.buffer);
                stream.pipe(uploadStream);
            });
            return {
                url: result.secure_url,
                publicId: result.public_id,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException("Failed to upload document");
        }
    }
    async uploadKYCDocument(file, businessId, documentType) {
        if (!file) {
            throw new common_1.BadRequestException("No file provided");
        }
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException("Invalid file type. Only PDF, JPEG, JPG, PNG, and WEBP are allowed for KYC documents.");
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException("File size too large. Maximum 5MB allowed.");
        }
        try {
            const folder = `lolaapril/kyc/${businessId}`;
            const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    folder,
                    resource_type: resourceType,
                    public_id: `${documentType}_${Date.now()}`,
                    ...(resourceType === 'image' && {
                        transformation: [
                            { width: 2000, height: 2000, crop: "limit" },
                            { quality: "auto:good" },
                            { format: "auto" }
                        ],
                    }),
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                const stream = stream_1.Readable.from(file.buffer);
                stream.pipe(uploadStream);
            });
            return {
                url: result.secure_url,
                publicId: result.public_id,
                documentType,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to upload KYC document: ${error.message}`);
        }
    }
};
UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map