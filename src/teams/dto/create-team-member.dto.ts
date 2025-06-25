import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional, ValidateNested } from "class-validator"
import { Type } from "class-transformer"

class ProfileDto {
  @IsNotEmpty()
  @IsString()
  type: string

  @IsNotEmpty()
  @IsString()
  url: string
}

class PublicationDto {
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

  @IsOptional()
  @IsString()
  doi?: string

  @IsOptional()
  @IsString()
  pubLink?: string

  @IsOptional()
  @IsString()
  doiLink?: string
}

export class CreateTeamMemberDto {
  @IsOptional()
  @IsString()
  image?: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  initials: string

  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsNumber()
  position: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfileDto)
  profiles: ProfileDto[]

  @IsNotEmpty()
  @IsString()
  bio: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  methods?: string[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PublicationDto)
  publications?: PublicationDto[]
}
