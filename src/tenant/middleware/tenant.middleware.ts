// src/modules/tenant/middleware/tenant.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { TenantService } from '../tenant.service'

declare global {
  namespace Express {
    interface Request {
      tenant?: {
        businessId: string
        subdomain: string
        business: any
        config: any
        limits?: any
      }
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name)

  constructor(private tenantService: TenantService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract subdomain from various sources
      const subdomain = this.extractSubdomain(req)
      
      if (!subdomain) {
        // No subdomain found, continue without tenant context
        return next()
      }

      this.logger.debug(`Processing request for subdomain: ${subdomain}`)

      // Get business by subdomain with caching
      const business = await this.tenantService.getBusinessBySubdomain(subdomain)
      
      if (!business) {
        return res.status(404).json({
          success: false,
          error: 'Business not found',
          code: 'BUSINESS_NOT_FOUND'
        })
      }

      if (business.status === 'suspended') {
        return res.status(403).json({
          success: false,
          error: 'Business account is suspended',
          code: 'BUSINESS_SUSPENDED'
        })
      }

      // Get tenant configuration
      const config = await this.tenantService.getTenantConfig(business._id.toString())

      // Attach tenant info to request
      req.tenant = {
        businessId: business._id.toString(),
        subdomain: business.subdomain,
        business,
        config
      }

      // Set tenant-specific response headers
      this.setTenantHeaders(res, business, config)

      this.logger.debug(`Tenant context set for business: ${business.businessName}`)

      next()
    } catch (error) {
      this.logger.error(`Tenant middleware error: ${error.message}`)
      
      return res.status(500).json({
        success: false,
        error: 'Tenant resolution failed',
        code: 'TENANT_RESOLUTION_ERROR'
      })
    }
  }

  private extractSubdomain(req: Request): string | null {
    // Method 1: From host header (subdomain.domain.com)
    const host = req.get('host') || ''
    const hostSubdomain = this.extractSubdomainFromHost(host)
    
    if (hostSubdomain) {
      return hostSubdomain
    }

    // Method 2: From custom header (for development/testing)
    const headerSubdomain = req.get('X-Tenant-Subdomain')
    if (headerSubdomain) {
      return headerSubdomain
    }

    // Method 3: From query parameter (fallback for development)
    const querySubdomain = req.query.tenant as string
    if (querySubdomain) {
      return querySubdomain
    }

    // Method 4: From request body (for API calls)
    if (req.body && req.body.subdomain) {
      return req.body.subdomain
    }

    return null
  }

  private extractSubdomainFromHost(host: string): string | null {
    if (!host) return null

    // Remove port if present
    const hostWithoutPort = host.split(':')[0]
    
    // Split by dots
    const parts = hostWithoutPort.split('.')
    
    // For development (localhost): check for patterns like 'tenant.localhost'
    if (hostWithoutPort.includes('localhost')) {
      if (parts.length >= 2) {
        const potentialSubdomain = parts[0]
        // Ignore common subdomains
        if (!['www', 'api', 'admin'].includes(potentialSubdomain)) {
          return potentialSubdomain
        }
      }
      return null
    }

    // For production: expecting pattern like 'subdomain.yourdomain.com'
    if (parts.length >= 3) {
      const subdomain = parts[0]
      
      // Ignore common subdomains
      if (['www', 'api', 'admin', 'mail', 'ftp'].includes(subdomain)) {
        return null
      }
      
      return subdomain
    }
    
    return null
  }

  private setTenantHeaders(res: Response, business: any, config: any): void {
    // Set CORS headers based on tenant config
    res.setHeader('Access-Control-Allow-Origin', '*') // Configure based on tenant settings
    
    // Set tenant-specific headers
    res.setHeader('X-Business-Name', business.businessName)
    res.setHeader('X-Business-Type', business.businessType)
    
    // Set custom branding headers if available
    if (config.brandColors) {
      res.setHeader('X-Brand-Primary-Color', config.brandColors.primary)
    }
    
    // Set subscription plan info
    if (business.activeSubscription) {
      res.setHeader('X-Subscription-Plan', business.activeSubscription.planType)
    }
  }
}