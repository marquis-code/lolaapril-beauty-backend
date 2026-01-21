import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Delete,
  Param,
  Body,
  BadRequestException,
} from "@nestjs/common"
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from "@nestjs/swagger"
import { UploadService } from "./upload.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { CurrentUser } from "../auth"

@ApiTags("File Upload")
@Controller("upload")

@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload single image' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadImage(file)
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Upload multiple images' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Images uploaded successfully' })
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    return this.uploadService.uploadMultipleImages(files)
  }

  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload document' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadDocument(file)
  }

  @Delete('image/:publicId')
  @ApiOperation({ summary: 'Delete image' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  async deleteImage(@Param('publicId') publicId: string) {
    await this.uploadService.deleteImage(publicId)
    return { message: 'Image deleted successfully' }
  }

  @Post('kyc-document')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload KYC document (business registration, tax cert, ID, bank statement, etc.)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'KYC document file (PDF, JPEG, PNG, WEBP - max 5MB)'
        },
        businessId: {
          type: 'string',
          description: 'Business ID'
        },
        documentType: {
          type: 'string',
          enum: ['businessRegistration', 'taxIdentification', 'governmentId', 'bankStatement', 'proofOfAddress'],
          description: 'Type of KYC document'
        }
      },
      required: ['file', 'businessId', 'documentType']
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'KYC document uploaded successfully',
    schema: {
      example: {
        success: true,
        data: {
          url: 'https://res.cloudinary.com/your-cloud/image/upload/v123456/lolaapril/kyc/businessId/businessRegistration_123456.pdf',
          publicId: 'lolaapril/kyc/businessId/businessRegistration_123456',
          documentType: 'businessRegistration',
          uploadedAt: '2026-01-21T10:30:00.000Z'
        },
        message: 'KYC document uploaded successfully'
      }
    }
  })
  async uploadKYCDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('businessId') businessId: string,
    @Body('documentType') documentType: 'businessRegistration' | 'taxIdentification' | 'governmentId' | 'bankStatement' | 'proofOfAddress',
    @CurrentUser() user: any
  ) {
    if (!businessId) {
      throw new BadRequestException('businessId is required');
    }

    if (!documentType) {
      throw new BadRequestException('documentType is required');
    }

    const allowedTypes = ['businessRegistration', 'taxIdentification', 'governmentId', 'bankStatement', 'proofOfAddress'];
    if (!allowedTypes.includes(documentType)) {
      throw new BadRequestException(`Invalid documentType. Must be one of: ${allowedTypes.join(', ')}`);
    }

    const result = await this.uploadService.uploadKYCDocument(file, businessId, documentType);
    
    return {
      success: true,
      data: {
        ...result,
        uploadedAt: new Date(),
      },
      message: 'KYC document uploaded successfully'
    };
  }
}