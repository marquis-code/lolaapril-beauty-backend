import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    @IsString()
    @IsNotEmpty()
    businessId: string;

    @ApiPropertyOptional({ example: '507f1f77bcf86cd799439012' })
    @IsString()
    @IsOptional()
    appointmentId?: string;

    @ApiPropertyOptional({ example: '507f1f77bcf86cd799439013' })
    @IsString()
    @IsOptional()
    serviceId?: string;

    @ApiPropertyOptional({ example: 'Facial Treatment' })
    @IsString()
    @IsOptional()
    serviceName?: string;

    @ApiProperty({ example: 5, description: 'Rating from 1 to 5' })
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiPropertyOptional({ example: 'Amazing service! Felt so refreshed.' })
    @IsString()
    @IsOptional()
    @MaxLength(1000)
    comment?: string;
}

export class BusinessRespondDto {
    @ApiProperty({ example: 'Thank you for your kind words!' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    response: string;
}
