"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasBusinessContext = void 0;
function hasBusinessContext(user) {
    return !!(user.businessId && user.subdomain);
}
exports.hasBusinessContext = hasBusinessContext;
//# sourceMappingURL=request-with-user.interface.js.map