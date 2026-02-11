import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../schemas/user.schema';
export declare class BusinessAuthGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
export declare const BUSINESS_ROLES_KEY = "businessRoles";
export declare const RequireBusinessRoles: (...roles: UserRole[]) => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
export declare class BusinessRolesGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
