"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TenantMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("../tenant.service");
let TenantMiddleware = TenantMiddleware_1 = class TenantMiddleware {
    constructor(tenantService) {
        this.tenantService = tenantService;
        this.logger = new common_1.Logger(TenantMiddleware_1.name);
    }
    async use(req, res, next) {
        try {
            const subdomain = this.extractSubdomain(req);
            if (!subdomain) {
                return next();
            }
            this.logger.debug(`Processing request for subdomain: ${subdomain}`);
            const business = await this.tenantService.getBusinessBySubdomain(subdomain);
            if (!business) {
                return res.status(404).json({
                    success: false,
                    error: 'Business not found',
                    code: 'BUSINESS_NOT_FOUND'
                });
            }
            if (business.status === 'suspended') {
                return res.status(403).json({
                    success: false,
                    error: 'Business account is suspended',
                    code: 'BUSINESS_SUSPENDED'
                });
            }
            const config = await this.tenantService.getTenantConfig(business._id.toString());
            req.tenant = {
                businessId: business._id.toString(),
                subdomain: business.subdomain,
                business,
                config
            };
            this.setTenantHeaders(res, business, config);
            this.logger.debug(`Tenant context set for business: ${business.businessName}`);
            next();
        }
        catch (error) {
            this.logger.error(`Tenant middleware error: ${error.message}`);
            return res.status(500).json({
                success: false,
                error: 'Tenant resolution failed',
                code: 'TENANT_RESOLUTION_ERROR'
            });
        }
    }
    extractSubdomain(req) {
        const host = req.get('host') || '';
        const hostSubdomain = this.extractSubdomainFromHost(host);
        if (hostSubdomain) {
            return hostSubdomain;
        }
        const headerSubdomain = req.get('X-Tenant-Subdomain');
        if (headerSubdomain) {
            return headerSubdomain;
        }
        const querySubdomain = req.query.tenant;
        if (querySubdomain) {
            return querySubdomain;
        }
        if (req.body && req.body.subdomain) {
            return req.body.subdomain;
        }
        return null;
    }
    extractSubdomainFromHost(host) {
        if (!host)
            return null;
        const hostWithoutPort = host.split(':')[0];
        const parts = hostWithoutPort.split('.');
        if (hostWithoutPort.includes('localhost')) {
            if (parts.length >= 2) {
                const potentialSubdomain = parts[0];
                if (!['www', 'api', 'admin'].includes(potentialSubdomain)) {
                    return potentialSubdomain;
                }
            }
            return null;
        }
        if (parts.length >= 3) {
            const subdomain = parts[0];
            if (['www', 'api', 'admin', 'mail', 'ftp'].includes(subdomain)) {
                return null;
            }
            return subdomain;
        }
        return null;
    }
    setTenantHeaders(res, business, config) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('X-Business-Name', business.businessName);
        res.setHeader('X-Business-Type', business.businessType);
        if (config.brandColors) {
            res.setHeader('X-Brand-Primary-Color', config.brandColors.primary);
        }
        if (business.activeSubscription) {
            res.setHeader('X-Subscription-Plan', business.activeSubscription.planType);
        }
    }
};
TenantMiddleware = TenantMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService])
], TenantMiddleware);
exports.TenantMiddleware = TenantMiddleware;
//# sourceMappingURL=tenant.middleware.js.map