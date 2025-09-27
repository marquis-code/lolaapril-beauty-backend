import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare const RequireFeature: (feature: string) => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
export declare class SubscriptionFeatureGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
