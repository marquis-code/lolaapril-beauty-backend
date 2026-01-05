import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'

/**
 * Mark endpoint as public (skip authentication)
 * 
 * Usage:
 * @Public()
 * @Get('health')
 * async healthCheck() { }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)