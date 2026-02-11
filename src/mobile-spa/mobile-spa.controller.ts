import {
    Controller,
    Post,
    Get,
    Patch,
    Body,
    Param,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MobileSpaService } from './mobile-spa.service';
import {
    CreateMobileSpaDto,
    AcceptMobileSpaDto,
    SuggestTimeMobileSpaDto,
    RejectMobileSpaDto,
} from './dto/mobile-spa.dto';
import { CurrentUser, BusinessId } from '../auth';

@ApiTags('Mobile SPA')
@Controller('mobile-spa')
export class MobileSpaController {
    constructor(private readonly mobileSpaService: MobileSpaService) { }

    @Post()
    @ApiOperation({ summary: 'Create a mobile SPA request' })
    @ApiResponse({ status: 201, description: 'Mobile SPA request created' })
    async createRequest(
        @CurrentUser() user: any,
        @Body(ValidationPipe) dto: CreateMobileSpaDto,
    ) {
        const request = await this.mobileSpaService.createRequest(
            user?.sub || user?._id || user?.id,
            user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Customer',
            user?.email || '',
            user?.phone || '',
            dto,
        );

        return {
            success: true,
            data: request,
            message: 'Mobile SPA request submitted! The business will review and respond shortly.',
        };
    }

    @Get('business')
    @ApiOperation({ summary: 'Get all mobile SPA requests for a business' })
    async getBusinessRequests(
        @BusinessId() businessId: string,
        @Query('status') status?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        const result = await this.mobileSpaService.getRequestsByBusiness(
            businessId,
            status,
            page || 1,
            limit || 20,
        );

        return {
            success: true,
            data: result,
        };
    }

    @Get('my-requests')
    @ApiOperation({ summary: 'Get my mobile SPA requests' })
    async getMyRequests(@CurrentUser() user: any) {
        const requests = await this.mobileSpaService.getRequestsByClient(
            user?.sub || user?._id || user?.id,
        );

        return {
            success: true,
            data: requests,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a mobile SPA request by ID' })
    async getRequest(@Param('id') id: string) {
        const request = await this.mobileSpaService.getRequestById(id);
        return {
            success: true,
            data: request,
        };
    }

    @Patch(':id/accept')
    @ApiOperation({ summary: 'Business accepts a mobile SPA request' })
    async acceptRequest(
        @Param('id') id: string,
        @Body(ValidationPipe) dto: AcceptMobileSpaDto,
    ) {
        const request = await this.mobileSpaService.acceptRequest(id, dto);
        return {
            success: true,
            data: request,
            message: 'Request accepted. Payment link sent to customer.',
        };
    }

    @Patch(':id/suggest-time')
    @ApiOperation({ summary: 'Business suggests alternative time' })
    async suggestTime(
        @Param('id') id: string,
        @Body(ValidationPipe) dto: SuggestTimeMobileSpaDto,
    ) {
        const request = await this.mobileSpaService.suggestNewTime(id, dto);
        return {
            success: true,
            data: request,
            message: 'Alternative time suggested to customer.',
        };
    }

    @Patch(':id/reject')
    @ApiOperation({ summary: 'Business rejects a mobile SPA request' })
    async rejectRequest(
        @Param('id') id: string,
        @Body(ValidationPipe) dto: RejectMobileSpaDto,
    ) {
        const request = await this.mobileSpaService.rejectRequest(id, dto);
        return {
            success: true,
            data: request,
            message: 'Request declined.',
        };
    }

    @Patch(':id/mark-paid')
    @ApiOperation({ summary: 'Mark a mobile SPA request as paid' })
    async markPaid(@Param('id') id: string) {
        const request = await this.mobileSpaService.markAsPaid(id);
        return {
            success: true,
            data: request,
            message: 'Payment confirmed.',
        };
    }

    @Patch(':id/complete')
    @ApiOperation({ summary: 'Mark a mobile SPA request as completed' })
    async markCompleted(@Param('id') id: string) {
        const request = await this.mobileSpaService.markAsCompleted(id);
        return {
            success: true,
            data: request,
            message: 'Mobile SPA service completed.',
        };
    }
}
