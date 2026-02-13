
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from '../schemas/user.schema'
import { Business, BusinessDocument } from '../../business/schemas/business.schema'
import { RequestWithUser } from '../types/request-with-user.interface'
import { VALIDATE_BUSINESS_KEY } from '../decorators/validate-business.decorator'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

// Type for lean business query result
type LeanBusiness = {
  _id: any
  businessName: string
  subdomain: string
  status: string
}

// Type for lean user query result
type LeanUser = {
  _id: any
  ownedBusinesses?: any[]
  adminBusinesses?: any[]
  staffBusinessId?: any
}

/**
 * Smart Business Validation Guard
 * 
 * Only activates when @ValidateBusiness() decorator is present
 * Validates business access against database in real-time
 * 
 * This guard:
 * 1. Skips if route is marked @Public()
 * 2. Only validates if @ValidateBusiness() is present
 * 3. Checks business exists and is active
 * 4. Verifies user still has access to the business
 */
@Injectable()
export class ValidateBusinessAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ===== STEP 1: Skip if route is public =====
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    // ===== STEP 2: Only validate if @ValidateBusiness() decorator is present =====
    const shouldValidate = this.reflector.getAllAndOverride<boolean>(
      VALIDATE_BUSINESS_KEY,
      [context.getHandler(), context.getClass()]
    )

    if (!shouldValidate) {
      // No @ValidateBusiness() decorator - skip validation (allow through)
      return true
    }

    // ===== STEP 3: Proceed with business validation =====
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const user = request.user

    if (!user) {
      throw new UnauthorizedException('Authentication required')
    }

    if (!user.businessId) {
      throw new UnauthorizedException(
        'Business context required. Please login through business portal or switch to a business.'
      )
    }

    // ===== STEP 4: Validate business exists and is active =====
    // AGGRESSIVE FIX: Store query in variable first, then execute
    const businessQuery = this.businessModel
      .findById(user.businessId)
      .select('_id businessName subdomain status')
      .lean<LeanBusiness>()

    const business = await businessQuery.exec()

    if (!business) {
      throw new UnauthorizedException(
        'Business not found. Your session may be outdated. Please login again.'
      )
    }

    if (business.status === 'suspended') {
      throw new ForbiddenException(
        'Business account is suspended. Please contact support for assistance.'
      )
    }

    if (business.status === 'expired') {
      throw new ForbiddenException(
        'Business subscription has expired. Please renew your subscription to continue.'
      )
    }

    // ===== STEP 5: Validate user still has access to this business =====
    // SUPER_ADMIN skip business access validation
    if (user.role === 'super_admin') {
      console.log(`👑 Super Admin access granted for business: ${business.businessName}`)
        // Attach validated business to request for controllers
        ; (request as any).validatedBusiness = business
      return true
    }

    // AGGRESSIVE FIX: Store query in variable first, then execute
    const userQuery = this.userModel
      .findById(user.sub)
      .select('_id ownedBusinesses adminBusinesses staffBusinessId')
      .lean<LeanUser>()

    const dbUser = await userQuery.exec()

    if (!dbUser) {
      throw new UnauthorizedException('User not found')
    }

    // Check if user has access (owner, admin, or staff)
    const hasAccess =
      dbUser.ownedBusinesses?.some(id => id.toString() === user.businessId.toString()) ||
      dbUser.adminBusinesses?.some(id => id.toString() === user.businessId.toString()) ||
      dbUser.staffBusinessId?.toString() === user.businessId.toString()

    if (!hasAccess) {
      console.error(`❌ Access Denied details:
        User ID: ${user.sub}
        Target Business ID: ${user.businessId}
        Owned Businesses: ${dbUser.ownedBusinesses?.map(id => id.toString()).join(', ') || 'None'}
        Admin Businesses: ${dbUser.adminBusinesses?.map(id => id.toString()).join(', ') || 'None'}
        Staff Business ID: ${dbUser.staffBusinessId?.toString() || 'None'}
      `)

      throw new ForbiddenException(
        'Access to this business has been revoked. Please refresh your session or contact your administrator.'
      )
    }

    // ===== STEP 6: Attach validated business to request for controllers =====
    (request as any).validatedBusiness = business

    console.log(`✅ Business validated: ${business.businessName} (${business.subdomain})`)

    return true
  }
}