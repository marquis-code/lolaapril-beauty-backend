import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject, IsArray, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CampaignAudienceDto {
    @ApiProperty({ enum: ['all', 'active_clients', 'specific_emails', 'query'] })
    @IsEnum(['all', 'active_clients', 'specific_emails', 'query'])
    type: 'all' | 'active_clients' | 'specific_emails' | 'query';

    @ApiPropertyOptional()
    @IsOptional()
    @IsObject()
    query?: any;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    specificEmails?: string[];
}

class CampaignScheduleDto {
    @ApiProperty({ enum: ['now', 'scheduled', 'recurring'] })
    @IsEnum(['now', 'scheduled', 'recurring'])
    type: 'now' | 'scheduled' | 'recurring';

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    scheduledAt?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    cronExpression?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    timezone?: string;
}

export class CreateCampaignDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    subject: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    previewText?: string;

    @ApiProperty()
    @ValidateNested()
    @Type(() => CampaignAudienceDto)
    audience: CampaignAudienceDto;

    @ApiProperty()
    @ValidateNested()
    @Type(() => CampaignScheduleDto)
    schedule: CampaignScheduleDto;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    bannerUrl?: string;
}

export class UpdateCampaignDto extends CreateCampaignDto { }
