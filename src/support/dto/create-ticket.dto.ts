// dto/create-ticket.dto.ts
import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  clientId: string;

  @IsString()
  @IsOptional()
  tenantId?: string;

  @IsString()
  @IsOptional()
  bookingId?: string;

  @IsString()
  subject: string;

  @IsString()
  description: string;

  @IsString()
  priority: string;

  @IsString()
  channel: string;

  @IsString()
  category: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsObject()
  @IsOptional()
  metadata?: any;
}