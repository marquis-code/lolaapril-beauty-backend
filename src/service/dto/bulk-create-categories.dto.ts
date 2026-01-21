import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateServiceCategoryDto } from './create-service-category.dto';

export class BulkCreateServiceCategoriesDto {
  @ApiProperty({
    description: 'Array of service categories to create',
    type: [CreateServiceCategoryDto],
    example: [
      {
        categoryName: 'Hair Services',
        appointmentColor: 'Blue',
        description: 'Professional hair styling, cutting, and treatment services',
      },
      {
        categoryName: 'Nail Services',
        appointmentColor: 'Pink',
        description: 'Manicure, pedicure, and nail art services',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceCategoryDto)
  categories: CreateServiceCategoryDto[];
}
