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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TenantMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("../tenant.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("../../booking/schemas/booking.schema");
let TenantMiddleware = TenantMiddleware_1 = class TenantMiddleware {
    constructor(tenantService, bookingModel) {
        this.tenantService = tenantService;
        this.bookingModel = bookingModel;
        this.logger = new common_1.Logger(TenantMiddleware_1.name);
    }
    async use(req, res, next) {
        var _a, _b, _c, _d, _e;
        try {
            this.logger.log(`Processing request: ${req.method} ${req.path}`);
            let businessId;
            businessId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.businessId;
            this.logger.debug(`BusinessId from params: ${businessId}`);
            if (!businessId) {
                businessId = (_b = req.query) === null || _b === void 0 ? void 0 : _b.businessId;
                this.logger.debug(`BusinessId from query: ${businessId}`);
            }
            if (!businessId && ((_c = req.body) === null || _c === void 0 ? void 0 : _c.businessId)) {
                businessId = req.body.businessId;
                this.logger.debug(`BusinessId from body: ${businessId}`);
            }
            if (!businessId) {
                businessId = req.headers['x-business-id'];
                this.logger.debug(`BusinessId from header: ${businessId}`);
            }
            if (!businessId && ((_d = req.params) === null || _d === void 0 ? void 0 : _d.bookingId)) {
                try {
                    const booking = await this.bookingModel
                        .findById(req.params.bookingId)
                        .select('businessId')
                        .lean()
                        .exec();
                    if (booking) {
                        businessId = booking.businessId.toString();
                        this.logger.log(`BusinessId from booking: ${businessId}`);
                    }
                }
                catch (error) {
                    this.logger.warn(`Failed to get businessId from booking: ${error.message}`);
                }
            }
            if (!businessId && ((_e = req.params) === null || _e === void 0 ? void 0 : _e.appointmentId)) {
                try {
                    this.logger.debug(`AppointmentId found but Appointment model not injected yet`);
                }
                catch (error) {
                    this.logger.warn(`Failed to get businessId from appointment: ${error.message}`);
                }
            }
            if (!businessId) {
                const host = req.headers.host || req.hostname;
                const subdomain = host.split('.')[0];
                this.logger.debug(`Extracted subdomain: ${subdomain}`);
                if (subdomain && !['www', 'api', 'localhost'].includes(subdomain)) {
                    try {
                        const business = await this.tenantService.getBusinessBySubdomain(subdomain);
                        businessId = business._id.toString();
                        this.logger.log(`BusinessId from subdomain: ${businessId}`);
                    }
                    catch (error) {
                        this.logger.warn(`Failed to get business by subdomain: ${error.message}`);
                    }
                }
            }
            if (!businessId && req.user) {
                const userId = req.user.sub || req.user.id;
                this.logger.debug(`Looking up businesses for user: ${userId}`);
                const businesses = await this.tenantService.getBusinessesByUser(userId);
                if (businesses && businesses.length > 0) {
                    businessId = businesses[0]._id.toString();
                    this.logger.log(`BusinessId from user: ${businessId}`);
                }
            }
            if (businessId) {
                const business = await this.tenantService.getBusinessById(businessId);
                req.tenant = {
                    businessId: businessId,
                    business: business
                };
                this.logger.log(`✅ Tenant context set for business: ${businessId}`);
            }
            else {
                this.logger.warn('⚠️ No businessId found from any source');
            }
            next();
        }
        catch (error) {
            this.logger.error(`Tenant middleware error: ${error.message}`, error.stack);
            next();
        }
    }
};
TenantMiddleware = TenantMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [tenant_service_1.TenantService,
        mongoose_2.Model])
], TenantMiddleware);
exports.TenantMiddleware = TenantMiddleware;
//# sourceMappingURL=tenant.middleware.js.map