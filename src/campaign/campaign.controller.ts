import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { readdir } from 'fs/promises';
import { join } from 'path';

@ApiTags('Business Campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('business/campaigns')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new campaign' })
    async create(@Body() createCampaignDto: CreateCampaignDto, @Request() req) {
        return this.campaignService.create(createCampaignDto, req.user.businessId, req.user.userId);
    }

    @Get()
    @ApiOperation({ summary: 'List all campaigns for the business' })
    async findAll(@Request() req) {
        return this.campaignService.findAll(req.user.businessId);
    }

    @Get('assets/emails')
    @ApiOperation({ summary: 'List available email asset images' })
    async listEmailAssets() {
        try {
            const assetsPath = join(process.cwd(), 'src/assets/emails');
            const files = await readdir(assetsPath);
            const images = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

            return images.map(filename => ({
                filename,
                path: `src/assets/emails/${filename}`
            }));
        } catch (error) {
            return [];
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get campaign details' })
    async findOne(@Param('id') id: string) {
        return this.campaignService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a campaign' })
    async update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
        return this.campaignService.update(id, updateCampaignDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete (cancel) a campaign' })
    async remove(@Param('id') id: string) {
        return this.campaignService.delete(id);
    }

    @Post(':id/duplicate')
    @ApiOperation({ summary: 'Duplicate a campaign' })
    async duplicate(@Param('id') id: string, @Request() req) {
        const campaign = await this.campaignService.findOne(id);
        if (!campaign) throw new BadRequestException('Campaign not found');

        const campaignObj = (campaign as any).toObject();
        const { _id, createdAt, updatedAt, status, stats, ...data } = campaignObj;

        // Need to cast to CreateCampaignDto or similar structure. 
        // data contains businessId, etc. create() expects DTO.
        // We'll construct a DTO-like object.

        const duplicateDto: any = {
            name: `${data.name} (Copy)`,
            subject: data.subject,
            content: data.content,
            previewText: data.previewText,
            audience: data.audience,
            schedule: { type: 'now' }, // Reset schedule
            bannerUrl: data.bannerUrl
        };

        return this.campaignService.create(duplicateDto, req.user.businessId, req.user.userId);
    }
}
