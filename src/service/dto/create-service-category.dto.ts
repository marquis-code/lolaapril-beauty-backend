import { IsString, IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateServiceCategoryDto {
  @ApiProperty({ example: "Hair Services" })
  @IsString()
  @IsNotEmpty()
  categoryName: string

  @ApiProperty({ example: "Blue" })
  @IsString()
  @IsNotEmpty()
  appointmentColor: string

  @ApiProperty({
    example: "Professional hair styling, cutting, and treatment services for all hair types.",
  })
  @IsString()
  @IsNotEmpty()
  description: string
}
