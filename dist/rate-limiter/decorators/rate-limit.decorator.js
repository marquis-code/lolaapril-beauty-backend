"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimit = void 0;
const common_1 = require("@nestjs/common");
const RateLimit = (limit, ttl = 60) => {
    return (target, propertyKey, descriptor) => {
        (0, common_1.SetMetadata)('rateLimit', limit)(target, propertyKey, descriptor);
        (0, common_1.SetMetadata)('rateLimitTTL', ttl)(target, propertyKey, descriptor);
        return descriptor;
    };
};
exports.RateLimit = RateLimit;
//# sourceMappingURL=rate-limit.decorator.js.map