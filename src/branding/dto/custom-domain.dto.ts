import { IsString, Matches, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RequestCustomDomainDto {
  @ApiProperty({ 
    example: 'booking.example.com',
    description: 'Custom domain name (must be a valid domain)'
  })
  @IsString()
  @Matches(
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i,
    { message: 'Invalid domain format' }
  )
  domain: string;
}

export class VerifyDomainDto {
  @ApiPropertyOptional({ 
    description: 'Force verification even if DNS records are not fully propagated',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  forceVerify?: boolean;
}
