import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';

export class BulkCreateServicesDto {
  @ApiProperty({
    description: 'Array of services to create',
    type: [CreateServiceDto],
    example: [
      {
        basicDetails: {
          serviceName: "Men's Haircut",
          serviceType: 'Hair Styling',
          category: '64a1b2c3d4e5f6789012345a',
          description: 'Professional haircut for men',
        },
        teamMembers: {
          allTeamMembers: true,
          selectedMembers: [],
        },
        resources: {
          isRequired: false,
          resources: [],
        },
        pricing: {
          basePrice: 5000,
          currency: 'NGN',
        },
        duration: {
          value: 30,
          unit: 'min',
        },
        booking: {
          bookableOnline: true,
        },
        visibility: {
          displayOnline: true,
        },
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceDto)
  services: CreateServiceDto[];
}
