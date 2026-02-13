import { Controller, Get, Post, Put, Patch, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConsultationService } from './consultation.service';
import { BusinessService } from '../business/business.service';
import {
    CreateConsultationPackageDto, UpdateConsultationPackageDto,
    UpdateConsultationAvailabilityDto, BookConsultationDto, GetAvailableSlotsDto
} from './dto/consultation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessId, CurrentUser } from '../auth/decorators/business-context.decorator';
import { Public } from '../auth';

@ApiTags('Consultation')
@Controller('consultations')
export class ConsultationController {
    constructor(
        private readonly consultationService: ConsultationService,
        private readonly businessService: BusinessService,
    ) { }

    // ================== BUSINESS ENDPOINTS ==================

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('packages')
    @ApiOperation({ summary: 'Create a consultation package (Business)' })
    async createPackage(@BusinessId() businessId: string, @Body() dto: CreateConsultationPackageDto) {
        return this.consultationService.createPackage(businessId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('packages/all')
    @ApiOperation({ summary: 'Get all consultation packages including inactive (Business)' })
    async getAllPackages(@BusinessId() businessId: string) {
        return this.consultationService.getPackages(businessId, false);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch('packages/:id')
    @ApiOperation({ summary: 'Update a consultation package (Business)' })
    async updatePackage(
        @BusinessId() businessId: string,
        @Param('id') id: string,
        @Body() dto: UpdateConsultationPackageDto
    ) {
        return this.consultationService.updatePackage(businessId, id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put('availability')
    @ApiOperation({ summary: 'Update consultation availability (Business)' })
    async updateAvailability(@BusinessId() businessId: string, @Body() dto: UpdateConsultationAvailabilityDto) {
        return this.consultationService.updateAvailability(businessId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('availability')
    @ApiOperation({ summary: 'Get consultation availability (Business)' })
    async getAvailability(@BusinessId() businessId: string) {
        return this.consultationService.getAvailability(businessId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('bookings')
    @ApiOperation({ summary: 'Get all consultation bookings (Business)' })
    async getBookings(@BusinessId() businessId: string) {
        return this.consultationService.getBookings(businessId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('bookings/:id/confirm')
    @ApiOperation({ summary: 'Manually confirm a consultation booking (Business)' })
    async confirmBooking(@BusinessId() businessId: string, @Param('id') id: string) {
        return this.consultationService.confirmBooking(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('bookings/:id/complete')
    @ApiOperation({ summary: 'Manually mark a consultation as completed (Business)' })
    async completeBooking(@BusinessId() businessId: string, @Param('id') id: string) {
        return this.consultationService.completeBooking(businessId, id);
    }

    // ================== CLIENT ENDPOINTS ==================

    @Public()
    @Get('subdomain/:subdomain/packages')
    @ApiOperation({ summary: 'Get active consultation packages for a business (Client)' })
    async getActivePackages(@Param('subdomain') subdomain: string) {
        const business = await this.businessService.getBySubdomain(subdomain);
        return this.consultationService.getPackages(business._id.toString(), true);
    }

    @Public()
    @Get('subdomain/:subdomain/slots')
    @ApiOperation({ summary: 'Get available slots for a package on a date (Client)' })
    async getSlots(
        @Param('subdomain') subdomain: string,
        @Query('date') date: string,
        @Query('packageId') packageId: string
    ) {
        const business = await this.businessService.getBySubdomain(subdomain);
        return this.consultationService.getAvailableSlots(business._id.toString(), date, packageId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('book/subdomain/:subdomain')
    @ApiOperation({ summary: 'Book a consultation (Client)' })
    async book(
        @CurrentUser() user: any,
        @Param('subdomain') subdomain: string,
        @Body() dto: BookConsultationDto
    ) {
        const business = await this.businessService.getBySubdomain(subdomain);
        return this.consultationService.bookConsultation(user.sub, business._id.toString(), dto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('my-bookings')
    @ApiOperation({ summary: 'Get current user\'s consultation bookings (Client)' })
    async getMyBookings(@CurrentUser() user: any) {
        return this.consultationService.getClientBookings(user.sub);
    }

    @Public()
    @Get('verify-payment/:reference')
    @ApiOperation({ summary: 'Verify Paystack payment for a consultation (Client)' })
    async verifyPayment(@Param('reference') reference: string) {
        return this.consultationService.verifyBookingPayment(reference);
    }
}
