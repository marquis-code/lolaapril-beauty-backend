import { IsOptional, IsArray, IsString } from "class-validator"

export class BookmarkBlogDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  collections?: string[]

  @IsOptional()
  @IsString()
  note?: string
}
