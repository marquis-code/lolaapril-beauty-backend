// rate-limiter/decorators/rate-limit.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const RateLimit = (limit: number, ttl = 60) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata('rateLimit', limit)(target, propertyKey, descriptor);
    SetMetadata('rateLimitTTL', ttl)(target, propertyKey, descriptor);
    return descriptor;
  };
};
