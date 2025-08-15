import { PartialType } from "@nestjs/mapped-types"
import { CreateBlogDto } from "./create-blog.dto"
import { IsOptional, IsString } from "class-validator"

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @IsOptional()
  @IsString()
  slug?: string
}

// import { PartialType } from "@nestjs/mapped-types"
// import { CreateBlogDto } from "./create-blog.dto"

// export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
