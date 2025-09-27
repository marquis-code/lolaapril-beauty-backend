// src/modules/tenant/middleware/subdomain-redirect.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class SubdomainRedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const host = req.get('host') || ''
    
    // If accessing main domain without subdomain, redirect to landing page
    if (this.isMainDomain(host) && !this.isApiRoute(req.path)) {
      return res.redirect('https://www.yourdomain.com')
    }
    
    next()
  }

  private isMainDomain(host: string): boolean {
    const hostWithoutPort = host.split(':')[0]
    
    // Configure your main domain patterns
    const mainDomainPatterns = [
      'yourdomain.com',
      'localhost'
    ]
    
    return mainDomainPatterns.some(pattern => 
      hostWithoutPort === pattern || hostWithoutPort.endsWith(`.${pattern}`)
    ) && !hostWithoutPort.includes('.')
  }

  private isApiRoute(path: string): boolean {
    return path.startsWith('/api') || path.startsWith('/health') || path.startsWith('/docs')
  }
}