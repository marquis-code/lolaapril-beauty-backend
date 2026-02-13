
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
  ownerId?: any
  adminIds?: any[]
  staffIds?: any[]
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
 * 4. Verifies user still has access to the business (dual check: User doc + Business doc)
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
    // DUAL CHECK: Select owner and admin fields from business to verify access even if User doc is out of sync
    const businessQuery = this.businessModel
      .findById(user.businessId)
      .select('_id businessName subdomain status ownerId adminIds staffIds')
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

    // Double check against User document
    const userQuery = this.userModel
      .findById(user.sub)
      .select('_id ownedBusinesses adminBusinesses staffBusinessId')
      .lean<LeanUser>()

    const dbUser = await userQuery.exec()

    if (!dbUser) {
      throw new UnauthorizedException('User not found')
    }

    // Check if user has access (EITHER listed in User doc OR listed in Business doc)
    const userIdStr = user.sub.toString()
    const targetBusinessIdStr = user.businessId.toString()

    const hasAccessInUserDoc =
      dbUser.ownedBusinesses?.some(id => id.toString() === targetBusinessIdStr) ||
      dbUser.adminBusinesses?.some(id => id.toString() === targetBusinessIdStr) ||
      dbUser.staffBusinessId?.toString() === targetBusinessIdStr

    const hasAccessInBusinessDoc =
      business.ownerId?.toString() === userIdStr ||
      business.adminIds?.some(id => id.toString() === userIdStr) ||
      business.staffIds?.some(id => id.toString() === userIdStr)

    if (!hasAccessInUserDoc && !hasAccessInBusinessDoc) {
      console.error(`❌ Access Denied details:
        User ID: ${user.sub}
        Target Business ID: ${user.businessId}
        --- User Doc Check ---
        Owned Businesses: ${dbUser.ownedBusinesses?.map(id => id.toString()).join(', ') || 'None'}
        Admin Businesses: ${dbUser.adminBusinesses?.map(id => id.toString()).join(', ') || 'None'}
        Staff Business ID: ${dbUser.staffBusinessId?.toString() || 'None'}
        --- Business Doc Check ---
        Owner ID: ${business.ownerId?.toString() || 'None'}
        Admin IDs: ${business.adminIds?.map(id => id.toString()).join(', ') || 'None'}
        Staff IDs: ${business.staffIds?.map(id => id.toString()).join(', ') || 'None'}
      `)

      throw new ForbiddenException(
        'Access to this business has been revoked. Please refresh your session or contact your administrator.'
      )
    }

    // ===== STEP 6: Attach validated business to request for controllers =====
    (request as any).validatedBusiness = business

    console.log(`✅ Business validated (Dual-Check): ${business.businessName} (${business.subdomain})`)

    return true
  }
}