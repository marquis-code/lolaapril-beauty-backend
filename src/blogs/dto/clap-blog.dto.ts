import { IsNumber, IsOptional, Min, Max } from "class-validator"

export class ClapBlogDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  count?: number = 1
}
