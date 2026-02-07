// src/branding/preview.controller.ts
import { 
  Controller, 
  Get, 
  Param,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
} from '@nestjs/swagger';
import { BrandingService } from './branding.service';
import { Public } from '../auth';

/**
 * Public Preview Controller
 * Handles public (unauthenticated) preview endpoints
 */
@ApiTags('Public Preview')
@Controller('preview')
export class PublicPreviewController {
  constructor(private readonly brandingService: BrandingService) {}

  @Public()
  @Get('theme/:previewId')
  @ApiOperation({ 
    summary: 'Get preview theme data by preview ID (Public)',
    description: 'Fetches the temporary preview theme data. No authentication required. Preview sessions expire after 1 hour.'
  })
  @ApiParam({ name: 'previewId', description: 'The preview session ID (e.g., a1b2c3d4e5f6)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Preview data retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          businessId: '6974aeec5dfb28e3ab6101d1',
          theme: {
            colors: {
              primary: '#3B82F6',
              secondary: '#10B981',
              accent: '#F59E0B',
              background: '#FFFFFF',
              text: '#1F2937',
              error: '#EF4444',
              success: '#10B981'
            },
            typography: {
              fontFamily: 'Inter, sans-serif',
              headingFont: 'Inter, sans-serif',
              bodyFont: 'Inter, sans-serif'
            },
            logo: {
              url: 'https://example.com/logo.png',
              width: 200,
              height: 80,
              alt: 'Logo'
            },
            favicon: {
              url: 'https://example.com/favicon.png'
            }
          },
          createdAt: '2026-02-06T21:00:00.000Z'
        },
        message: 'Preview theme retrieved successfully'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Preview session expired or not found' })
  async getPreviewTheme(@Param('previewId') previewId: string) {
    const previewData = await this.brandingService.getPreviewSession(previewId);
    return {
      success: true,
      data: previewData,
      message: 'Preview theme retrieved successfully'
    };
  }
}
