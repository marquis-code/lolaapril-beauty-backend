import { IsString, IsNotEmpty, IsMongoId } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SwitchBusinessDto {
  @ApiProperty({ 
    description: 'Business ID to switch to',
    example: '507f1f77bcf86cd799439011'
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  businessId: string
}