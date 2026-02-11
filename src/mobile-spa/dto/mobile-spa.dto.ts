import {
    IsString, IsNotEmpty, IsArray, IsOptional, IsNumber,
    Min, ValidateNested, IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MobileSpaServiceDto {
    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    @IsString()
    @IsNotEmpty()
    serviceId: string;

    @ApiPropertyOptional({ example: 2 })
    @IsNumber()
    @IsOptional()
    @Min(1)
    quantity?: number;
}

export class MobileSpaLocationDto {
    @ApiProperty({ example: '123 Main St, Lagos' })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ example: 6.5244 })
    @IsNumber()
    lat: number;

    @ApiProperty({ example: 3.3792 })
    @IsNumber()
    lng: number;

    @ApiPropertyOptional({ example: 'ChIJxx2J0...' })
    @IsString()
    @IsOptional()
    placeId?: string;

    @ApiPropertyOptional({ example: 'Use the side gate' })
    @IsString()
    @IsOptional()
    additionalDirections?: string;
}

export class CreateMobileSpaDto {
    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    @IsString()
    @IsNotEmpty()
    businessId: string;

    @ApiProperty({ type: [MobileSpaServiceDto] })
    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => MobileSpaServiceDto)
    services: MobileSpaServiceDto[];

    @ApiProperty({ example: 3 })
    @IsNumber()
    @Min(1)
    numberOfPeople: number;

    @ApiProperty({ type: MobileSpaLocationDto })
    @ValidateNested()
    @Type(() => MobileSpaLocationDto)
    location: MobileSpaLocationDto;

    @ApiProperty({ example: '2025-03-15' })
    @IsDateString()
    requestedDate: string;

    @ApiPropertyOptional({ example: '14:00' })
    @IsString()
    @IsOptional()
    requestedTime?: string;

    @ApiPropertyOptional({ example: 'Please bring extra towels' })
    @IsString()
    @IsOptional()
    clientNotes?: string;
}

export class AcceptMobileSpaDto {
    @ApiPropertyOptional({ example: 'https://pay.example.com/link123' })
    @IsString()
    @IsOptional()
    paymentLink?: string;

    @ApiPropertyOptional({ example: 'We will arrive 15 minutes early' })
    @IsString()
    @IsOptional()
    businessNotes?: string;
}

export class SuggestTimeMobileSpaDto {
    @ApiProperty({ example: '2025-03-16' })
    @IsDateString()
    suggestedDate: string;

    @ApiProperty({ example: '10:00' })
    @IsString()
    @IsNotEmpty()
    suggestedTime: string;

    @ApiPropertyOptional({ example: 'The original time is unavailable, how about this?' })
    @IsString()
    @IsOptional()
    businessNotes?: string;
}

export class RejectMobileSpaDto {
    @ApiPropertyOptional({ example: 'We cannot service this area' })
    @IsString()
    @IsOptional()
    reason?: string;
}
