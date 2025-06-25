import { IsNotEmpty, IsString } from "class-validator"

export class ReviewPublicationDto {
  @IsNotEmpty()
  @IsString()
  rejectionReason: string
}
