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

  async uploadImage(file: Express.Multer.File, folder = "salon-booking"): Promise<{ url: string; publicId: string }> {
    if (!file) {
      throw new BadRequestException("No file provided")
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException("Invalid file type. Only images are allowed.")
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
            folder,
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
      throw new BadRequestException("Failed to upload image")
    }
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder = "salon-booking",
  ): Promise<{ url: string; publicId: string }[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, folder))
    return Promise.all(uploadPromises)
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      throw new BadRequestException("Failed to delete image")
    }
  }

  async uploadDocument(
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
            folder,
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
}
