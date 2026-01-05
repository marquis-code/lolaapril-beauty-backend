import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Delete,
  Param,
} from "@nestjs/common"
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from "@nestjs/swagger"
import { UploadService } from "./upload.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

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
}