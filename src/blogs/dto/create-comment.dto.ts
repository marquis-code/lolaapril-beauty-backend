// import { IsNotEmpty, IsString, IsOptional, IsObject } from "class-validator"

// export class CreateCommentDto {
//   @IsNotEmpty()
//   @IsString()
//   content: string

//   @IsOptional()
//   @IsString()
//   parentId?: string

//   @IsOptional()
//   @IsString()
//   highlightedText?: string

//   @IsOptional()
//   @IsObject()
//   highlightedRange?: {
//     start: number
//     end: number
//   }
// }

import { IsString, IsOptional, IsBoolean, ValidateNested, IsNumber, IsArray } from "class-validator"
import { Type } from "class-transformer"

export class HighlightedRangeDto {
  @IsNumber()
  start: number

  @IsNumber()
  end: number

  @IsOptional()
  @IsString()
  text?: string
}

export class CreateCommentDto {
  @IsString()
  content: string

  @IsOptional()
  @IsString()
  parentId?: string

  @IsOptional()
  @IsBoolean()
  isHighlighted?: boolean

  @IsOptional()
  @ValidateNested()
  @Type(() => HighlightedRangeDto)
  highlightedRange?: HighlightedRangeDto

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mentions?: string[]
}

export class UpdateCommentDto {
  @IsString()
  content: string
}

export class CommentReactionDto {
  @IsString()
  type: 'like' | 'dislike' | 'love' | 'laugh' | 'angry'
}