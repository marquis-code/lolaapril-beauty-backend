// src/modules/tenant/guards/business-owner.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'

@Injectable()
export class BusinessOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    
    if (!request.user || !request.tenant) {
      throw new ForbiddenException('Authentication required')
    }

    const userId = request.user.id
    const business = request.tenant.business

    // Check if user is business owner or admin
    const isOwner = business.ownerId.toString() === userId
    const isAdmin = business.adminIds.some(adminId => adminId.toString() === userId)

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Access denied. Business owner or admin rights required.')
    }

    return true
  }
}