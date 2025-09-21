import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, IsNumber, Min, IsEnum } from "class-validator"
import { Type } from "class-transformer"
import { TeamRole, TeamStatus } from "../schemas/team-member.schema"

export class TeamMemberQueryDto {
  @ApiProperty({ description: "Page number", required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1

  @ApiProperty({ description: "Items per page", required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10

  @ApiProperty({ description: "Search term", required: false })
  @IsOptional()
  @IsString()
  search?: string

  @ApiProperty({ description: "Filter by role", enum: TeamRole, required: false })
  @IsOptional()
  @IsEnum(TeamRole)
  role?: TeamRole

  @ApiProperty({ description: "Filter by status", enum: TeamStatus, required: false })
  @IsOptional()
  @IsEnum(TeamStatus)
  status?: TeamStatus

  @ApiProperty({ description: "Filter by department", required: false })
  @IsOptional()
  @IsString()
  department?: string

  @ApiProperty({ description: "Sort by field", required: false, default: "createdAt" })
  @IsOptional()
  @IsString()
  sortBy?: string = "createdAt"

  @ApiProperty({ description: "Sort order", enum: ["asc", "desc"], required: false, default: "desc" })
  @IsOptional()
  @IsEnum(["asc", "desc"])
  sortOrder?: "asc" | "desc" = "desc"
}
