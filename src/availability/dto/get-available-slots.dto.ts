
// // // src/modules/availability/dto/get-available-slots.dto.ts
// // import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, Min, IsDateString } from 'class-validator'
// // import { Type, Transform } from 'class-transformer'

// // export class GetAvailableSlotsDto {
// //   @IsOptional()
// //   @IsString()
// //   businessId?: string

// //   @IsOptional()
// //   @IsString()
// //   subdomain?: string

// //   @IsDateString()
// //   @IsNotEmpty()
// //   date: string

// //   @IsNotEmpty({ message: 'At least one service must be selected' })
// //   @IsArray()
// //   @IsString({ each: true })
// //   @Transform(({ value }) => {
// //     if (typeof value === 'string') return [value]
// //     return Array.isArray(value) ? value : []
// //   })
// //   serviceIds: string[]

// //   @IsOptional()
// //   @IsNumber()
// //   @Min(1)
// //   @Type(() => Number)
// //   @Transform(({ value }) => value ? parseInt(value, 10) : undefined)
// //   durationOverride?: number

// //   @IsOptional()
// //   @IsNumber()
// //   @Min(0)
// //   @Type(() => Number)
// //   @Transform(({ value }) => value ? parseInt(value, 10) : 0)
// //   bufferTime?: number = 0

// //   @IsOptional()
// //   @IsString()
// //   @Transform(({ value }) => value || 'sequential')
// //   bookingType?: 'sequential' | 'parallel' = 'sequential'
// // }

// // src/modules/availability/dto/get-available-slots.dto.ts
// import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, Min, IsDateString } from 'class-validator'
// import { Type, Transform } from 'class-transformer'

// export class GetAvailableSlotsDto {
//   @IsOptional()
//   @IsString()
//   businessId?: string

//   @IsOptional()
//   @IsString()
//   subdomain?: string

//   @IsDateString()
//   @IsNotEmpty()
//   date: string

//   @IsNotEmpty({ message: 'At least one service must be selected' })
//   @IsArray({ message: 'serviceIds must be an array' })
//   @IsString({ each: true, message: 'each value in serviceIds must be a string' })
//   @Transform(({ value }) => {
//     // Handle undefined/null
//     if (!value) return []
    
//     // Already an array
//     if (Array.isArray(value)) return value
    
//     // Single string value
//     if (typeof value === 'string') return [value]
    
//     // Object with array notation (e.g., { '0': 'id1', '1': 'id2' })
//     if (typeof value === 'object') {
//       const values = Object.values(value)
//       return values.filter(v => typeof v === 'string')
//     }
    
//     return []
//   })
//   serviceIds: string[]

//   @IsOptional()
//   @IsNumber()
//   @Min(1)
//   @Type(() => Number)
//   @Transform(({ value }) => value ? parseInt(value, 10) : undefined)
//   durationOverride?: number

//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   @Type(() => Number)
//   @Transform(({ value }) => value ? parseInt(value, 10) : 0)
//   bufferTime?: number = 0

//   @IsOptional()
//   @IsString()
//   @Transform(({ value }) => value || 'sequential')
//   bookingType?: 'sequential' | 'parallel' = 'sequential'
// }

// src/modules/availability/dto/get-available-slots.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, Min, IsDateString } from 'class-validator'
import { Type, Transform } from 'class-transformer'

export class GetAvailableSlotsDto {
  @IsOptional()
  @IsString()
  businessId?: string

  @IsOptional()
  @IsString()
  subdomain?: string

  @IsDateString()
  @IsNotEmpty()
  date: string

  @IsNotEmpty({ message: 'At least one service must be selected' })
  @IsArray({ message: 'serviceIds must be an array' })
  @IsString({ each: true, message: 'each value in serviceIds must be a string' })
  @Transform(({ value }) => {
    if (!value) return []
    if (Array.isArray(value)) return value
    if (typeof value === 'string') return [value]
    if (typeof value === 'object') {
      const values = Object.values(value)
      return values.filter(v => typeof v === 'string')
    }
    return []
  })
  serviceIds: string[]

  @IsOptional()
  @IsString()
  staffId?: string  // ← ADD THIS FIELD

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => value ? parseInt(value, 10) : undefined)
  durationOverride?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @Transform(({ value }) => value ? parseInt(value, 10) : 0)
  bufferTime?: number = 0

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || 'sequential')
  bookingType?: 'sequential' | 'parallel' = 'sequential'
}