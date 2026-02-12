import { IsString, IsNumber, IsBoolean, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class TimeSlotDto {
    @IsString()
    @IsNotEmpty()
    startTime: string;

    @IsString()
    @IsNotEmpty()
    endTime: string;
}

class DayScheduleDto {
    @IsNumber()
    @Min(0)
    @Max(6)
    dayOfWeek: number;

    @IsBoolean()
    @IsOptional()
    isOpen?: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TimeSlotDto)
    timeSlots: TimeSlotDto[];
}

export class CreateConsultationPackageDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    price: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    duration: number;
}

export class UpdateConsultationPackageDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    price?: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    duration?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class UpdateConsultationAvailabilityDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DayScheduleDto)
    weeklySchedule: DayScheduleDto[];
}

export class BookConsultationDto {
    @IsString()
    @IsNotEmpty()
    packageId: string;

    @IsDateString()
    @IsNotEmpty()
    startTime: string;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class GetAvailableSlotsDto {
    @IsDateString()
    @IsNotEmpty()
    date: string;
}
