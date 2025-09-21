import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from "class-validator"
import { UserRole } from "../schemas/user.schema"

export class RegisterDto {
  @ApiProperty({ description: "User first name" })
  @IsString()
  firstName: string

  @ApiProperty({ description: "User last name" })
  @IsString()
  lastName: string

  @ApiProperty({ description: "User email address" })
  @IsEmail()
  email: string

  @ApiProperty({ description: "User phone number", required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ description: "User password", minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ description: "User role", enum: UserRole, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}
