import { Injectable, BadRequestException } from "@nestjs/common"
import { v2 as cloudinary } from "cloudinary"
import { Readable } from "stream"

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }

  async uploadImage(businessId: string, file: Express.Multer.File, folder = "salon-booking"): Promise<{ url: string; publicId: string }> {
    if (!file) {
      throw new BadRequestException("No file provided")
    }

    // Check if buffer exists (Multer memory storage required)
    if (!file.buffer) {
      throw new BadRequestException("File buffer is empty. Ensure Multer is configured with memory storage.")
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, WEBP, GIF are allowed.`)
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException("File size too large. Maximum 5MB allowed.")
    }

    try {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `${folder}/${businessId}`,
            resource_type: "image",
            transformation: [{ width: 1000, height: 1000, crop: "limit" }, { quality: "auto" }, { format: "auto" }],
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          },
        )

        const stream = Readable.from(file.buffer)
        stream.pipe(uploadStream)
      })

      return {
        url: (result as any).secure_url,
        publicId: (result as any).public_id,
      }
    } catch (error) {
      throw new BadRequestException(`Failed to upload image: ${error.message || 'Unknown error'}`)
    }
  }

  async uploadMultipleImages(
    businessId: string,
    files: Express.Multer.File[],
    folder = "salon-booking",
  ): Promise<{ url: string; publicId: string }[]> {
    const uploadPromises = files.map((file) => this.uploadImage(businessId, file, folder))
    return Promise.all(uploadPromises)
  }

  async deleteImage(businessId: string, publicId: string): Promise<void> {
    // Optionally, you could validate that the publicId belongs to the businessId's folder
    try {
      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      throw new BadRequestException("Failed to delete image")
    }
  }

  async uploadDocument(
    businessId: string,
    file: Express.Multer.File,
    folder = "salon-booking/documents",
  ): Promise<{ url: string; publicId: string }> {
    if (!file) {
      throw new BadRequestException("No file provided")
    }

    // Validate file type for documents
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException("Invalid file type. Only documents are allowed.")
    }

    // Validate file size (10MB max for documents)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException("File size too large. Maximum 10MB allowed.")
    }

    try {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `${folder}/${businessId}`,
            resource_type: "raw",
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          },
        )

        const stream = Readable.from(file.buffer)
        stream.pipe(uploadStream)
      })

      return {
        url: (result as any).secure_url,
        publicId: (result as any).public_id,
      }
    } catch (error) {
      throw new BadRequestException("Failed to upload document")
    }
  }

  /**
   * Upload KYC documents (supports both images and PDFs)
   */
  async uploadKYCDocument(
    file: Express.Multer.File,
    businessId: string,
    documentType: 'businessRegistration' | 'taxIdentification' | 'governmentId' | 'bankStatement' | 'proofOfAddress',
  ): Promise<{ url: string; publicId: string; documentType: string }> {
    if (!file) {
      throw new BadRequestException("No file provided")
    }

    // Validate file type (images + PDF)
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ]
    
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        "Invalid file type. Only PDF, JPEG, JPG, PNG, and WEBP are allowed for KYC documents."
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException("File size too large. Maximum 5MB allowed.")
    }

    try {
      const folder = `lolaapril/kyc/${businessId}`;
      const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
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
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          },
        )

        const stream = Readable.from(file.buffer)
        stream.pipe(uploadStream)
      })

      return {
        url: (result as any).secure_url,
        publicId: (result as any).public_id,
        documentType,
      }
    } catch (error) {
      throw new BadRequestException(`Failed to upload KYC document: ${error.message}`)
    }
  }
}
