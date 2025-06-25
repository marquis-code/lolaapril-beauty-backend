import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateEnquiryDto {
  @IsNotEmpty()
  @IsString()
  firstName: string

  @IsNotEmpty()
  @IsString()
  lastName: string

  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  phoneNumber: string

  @IsNotEmpty()
  @IsString()
  message: string
}
