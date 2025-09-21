import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsBoolean, Min, MaxLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { ServiceCategory } from "../../schemas/service.schema"

export class CreateServiceDto {
  @ApiProperty({ example: "Haircut & Styling" })
  @IsString()
  @MaxLength(100)
  name: string

  @ApiProperty({ example: "Professional haircut with styling and blow-dry" })
  @IsString()
  @MaxLength(500)
  description: string

  @ApiProperty({ example: 45.99 })
  @IsNumber()
  @Min(0)
  price: number

  @ApiProperty({ example: 60, description: "Duration in minutes" })
  @IsNumber()
  @Min(1)
  duration: number

  @ApiProperty({ example: ServiceCategory.HAIRCUT, enum: ServiceCategory })
  @IsEnum(ServiceCategory)
  category: ServiceCategory

  @ApiProperty({ required: false, example: "https://example.com/image.jpg" })
  @IsOptional()
  @IsString()
  image?: string

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @ApiProperty({ required: false, example: ["haircut", "styling", "blowdry"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @ApiProperty({ required: false, example: 10, description: "Preparation time in minutes" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  preparationTime?: number

  @ApiProperty({ required: false, example: 5, description: "Cleanup time in minutes" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cleanupTime?: number

  @ApiProperty({ required: false, example: "Please arrive with clean hair" })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  requirements?: string

  @ApiProperty({ required: false, example: "Avoid washing hair for 24 hours" })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  aftercareInstructions?: string
}
