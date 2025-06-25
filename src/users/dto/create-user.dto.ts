import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from "class-validator"
import { UserRole } from "../../common/enums"

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  lastName: string

  @IsEmail()
  email: string

  @IsNotEmpty()
  @MinLength(6)
  password: string

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}
