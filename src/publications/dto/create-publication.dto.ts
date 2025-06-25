import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUrl } from "class-validator"

export class CreatePublicationDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  authors: string

  @IsNotEmpty()
  @IsNumber()
  year: number

  @IsNotEmpty()
  @IsString()
  journal: string

  @IsNotEmpty()
  @IsString()
  category: string

  @IsOptional()
  @IsUrl()
  link?: string

  @IsOptional()
  @IsString()
  abstract?: string

  @IsOptional()
  @IsString()
  doi?: string

  @IsOptional()
  @IsUrl()
  pubLink?: string

  @IsOptional()
  @IsUrl()
  doiLink?: string
}
