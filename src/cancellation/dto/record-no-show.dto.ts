import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, Max, IsBoolean, IsArray, IsEnum, Min, ValidateNested, } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from 'class-transformer';


export class RecordNoShowDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  appointmentId: string

  @ApiPropertyOptional({ example: 'Called client 3 times, no response' })
  @IsOptional()
  @IsString()
  notes?: string

  @ApiProperty({ example: 3 })
  @IsOptional()
  contactAttempts?: number
}
