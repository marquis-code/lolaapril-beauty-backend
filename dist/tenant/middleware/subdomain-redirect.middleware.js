"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubdomainRedirectMiddleware = void 0;
const common_1 = require("@nestjs/common");
let SubdomainRedirectMiddleware = class SubdomainRedirectMiddleware {
    use(req, res, next) {
        const host = req.get('host') || '';
        if (this.isMainDomain(host) && !this.isApiRoute(req.path)) {
            return res.redirect('https://www.yourdomain.com');
        }
        next();
    }
    isMainDomain(host) {
        const hostWithoutPort = host.split(':')[0];
        const mainDomainPatterns = [
            'yourdomain.com',
            'localhost'
        ];
        return mainDomainPatterns.some(pattern => hostWithoutPort === pattern || hostWithoutPort.endsWith(`.${pattern}`)) && !hostWithoutPort.includes('.');
    }
    isApiRoute(path) {
        return path.startsWith('/api') || path.startsWith('/health') || path.startsWith('/docs');
    }
};
SubdomainRedirectMiddleware = __decorate([
    (0, common_1.Injectable)()
], SubdomainRedirectMiddleware);
exports.SubdomainRedirectMiddleware = SubdomainRedirectMiddleware;
//# sourceMappingURL=subdomain-redirect.middleware.js.map