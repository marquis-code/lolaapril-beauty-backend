import { SetMetadata } from '@nestjs/common'

export const VALIDATE_BUSINESS_KEY = 'validateBusiness'

/**
 * Mark endpoint to validate business access against database
 * Use for CREATE, UPDATE, DELETE operations
 * 
 * Usage:
 * @ValidateBusiness()
 * @Post()
 * async create() { }
 */
export const ValidateBusiness = () => SetMetadata(VALIDATE_BUSINESS_KEY, true)