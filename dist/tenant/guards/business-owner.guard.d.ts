import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class BusinessOwnerGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
