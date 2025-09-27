import { IsNotEmpty, IsString, IsEmail, IsDateString, IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class CompleteAssignmentDto {
  @IsOptional()
  @IsString()
  actualStartTime?: Date

  @IsOptional()
  @IsString()
  actualEndTime?: Date

  @IsOptional()
  @IsString()
  completionNotes?: string

  @IsOptional()
  rating?: number

  @IsOptional()
  @IsString()
  clientFeedback?: string

  @IsOptional()
  @IsString()
  staffFeedback?: string

  @IsOptional()
  @IsString()
  qualityCheckNotes?: string

  @IsOptional()
  qualityCheckCompleted?: boolean

  @IsOptional()
  @IsString()
  qualityCheckedBy?: string
}
