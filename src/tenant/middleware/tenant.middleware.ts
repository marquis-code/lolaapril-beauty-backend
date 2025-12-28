
// src/modules/tenant/middleware/tenant.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { TenantService } from '../tenant.service'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Booking } from '../../booking/schemas/booking.schema'

export interface TenantRequest extends Request {
  tenant?: {
    businessId: string
    business: any
    limits?: any
  }
  user?: {
    sub: string
    id: string
    email: string
    role: string
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name)

  constructor(
    private tenantService: TenantService,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>
  ) {}

  async use(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      this.logger.log(`Processing request: ${req.method} ${req.path}`)
      
      // Extract businessId from multiple possible sources
      let businessId: string | undefined

      // 1. From route params (highest priority)
      businessId = req.params?.businessId
      this.logger.debug(`BusinessId from params: ${businessId}`)

      // 2. From query params
      if (!businessId) {
        businessId = req.query?.businessId as string
        this.logger.debug(`BusinessId from query: ${businessId}`)
      }

      // 3. From request body
      if (!businessId && req.body?.businessId) {
        businessId = req.body.businessId
        this.logger.debug(`BusinessId from body: ${businessId}`)
      }

      // 3.5. From custom header (X-Business-Id)
      if (!businessId) {
        businessId = req.headers['x-business-id'] as string
        this.logger.debug(`BusinessId from header: ${businessId}`)
      }

      // 4. ✅ NEW: From bookingId in route params - fetch booking and extract businessId
      if (!businessId && req.params?.bookingId) {
        try {
          const booking = await this.bookingModel
            .findById(req.params.bookingId)
            .select('businessId')
            .lean()
            .exec()
          
          if (booking) {
            businessId = booking.businessId.toString()
            this.logger.log(`BusinessId from booking: ${businessId}`)
          }
        } catch (error) {
          this.logger.warn(`Failed to get businessId from booking: ${error.message}`)
        }
      }

      // 5. ✅ NEW: From appointmentId in route params - fetch appointment and extract businessId
      if (!businessId && req.params?.appointmentId) {
        try {
          // You'll need to inject the Appointment model too
          // For now, we'll skip this but you can add it similarly
          this.logger.debug(`AppointmentId found but Appointment model not injected yet`)
        } catch (error) {
          this.logger.warn(`Failed to get businessId from appointment: ${error.message}`)
        }
      }

      // 6. From subdomain in hostname
      if (!businessId) {
        const host = req.headers.host || req.hostname
        const subdomain = host.split('.')[0]
        this.logger.debug(`Extracted subdomain: ${subdomain}`)
        
        // Only try to fetch by subdomain if it's not 'www', 'api', or localhost
        if (subdomain && !['www', 'api', 'localhost'].includes(subdomain)) {
          try {
            const business = await this.tenantService.getBusinessBySubdomain(subdomain)
            businessId = business._id.toString()
            this.logger.log(`BusinessId from subdomain: ${businessId}`)
          } catch (error) {
            this.logger.warn(`Failed to get business by subdomain: ${error.message}`)
          }
        }
      }

      // 7. From user's associated business (for staff/admin)
      if (!businessId && req.user) {
        const userId = req.user.sub || req.user.id
        this.logger.debug(`Looking up businesses for user: ${userId}`)
        
        const businesses = await this.tenantService.getBusinessesByUser(userId)
        
        if (businesses && businesses.length > 0) {
          businessId = businesses[0]._id.toString()
          this.logger.log(`BusinessId from user: ${businessId}`)
        }
      }

      // If we found a businessId, fetch and attach the business
      if (businessId) {
        const business = await this.tenantService.getBusinessById(businessId)
        
        req.tenant = {
          businessId: businessId,
          business: business
        }
        
        this.logger.log(`✅ Tenant context set for business: ${businessId}`)
      } else {
        this.logger.warn('⚠️ No businessId found from any source')
      }

      next()
    } catch (error) {
      this.logger.error(`Tenant middleware error: ${error.message}`, error.stack)
      // Don't throw error here - let the guard handle it
      next()
    }
  }
}