// dto/create-review.dto.ts
import { IsString, IsNumber, IsOptional, Min, Max, IsObject } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  businessId: string;

  @IsString()
  clientId: string;

  @IsString()
  bookingId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  reviewText?: string;

  @IsObject()
  @IsOptional()
  ratings?: {
    service: number;
    cleanliness: number;
    professionalism: number;
    valueForMoney: number;
  };
}