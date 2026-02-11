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
var AvailabilitySchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilitySchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const availability_service_1 = require("./availability.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const business_hours_schema_1 = require("./schemas/business-hours.schema");
let AvailabilitySchedulerService = AvailabilitySchedulerService_1 = class AvailabilitySchedulerService {
    constructor(availabilityService, businessHoursModel) {
        this.availabilityService = availabilityService;
        this.businessHoursModel = businessHoursModel;
        this.logger = new common_1.Logger(AvailabilitySchedulerService_1.name);
    }
    async extendDailyAvailability() {
        this.logger.log('🔄 Starting daily availability extension...');
        try {
            const businesses = await this.businessHoursModel
                .find({ operates24x7: true })
                .select('businessId')
                .exec();
            this.logger.log(`Found ${businesses.length} 24/7 businesses to process`);
            let successCount = 0;
            let errorCount = 0;
            for (const business of businesses) {
                try {
                    await this.availabilityService.ensureAllStaffAvailability(business.businessId.toString(), 90);
                    successCount++;
                    this.logger.log(`✅ Extended availability for business: ${business.businessId}`);
                }
                catch (error) {
                    errorCount++;
                    this.logger.error(`❌ Failed to extend availability for business ${business.businessId}:`, error.message);
                }
            }
            this.logger.log(`✅ Daily availability extension completed. Success: ${successCount}, Errors: ${errorCount}`);
        }
        catch (error) {
            this.logger.error('❌ Critical error in daily availability extension:', error);
        }
    }
    async cleanupOldAvailability() {
        this.logger.log('🧹 Starting weekly cleanup of old availability records...');
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const result = await this.availabilityService.deleteOldAvailability(thirtyDaysAgo);
            this.logger.log(`✅ Cleanup completed. Deleted ${result.deletedCount} old records`);
        }
        catch (error) {
            this.logger.error('❌ Error during cleanup:', error);
        }
    }
    async checkLowAvailability() {
        this.logger.log('🔍 Checking for businesses with low availability...');
        try {
            const businesses = await this.businessHoursModel
                .find({ operates24x7: true })
                .select('businessId')
                .exec();
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
            for (const business of businesses) {
                const hasLowAvailability = await this.availabilityService.checkAvailabilityGap(business.businessId.toString(), sevenDaysFromNow);
                if (hasLowAvailability) {
                    this.logger.warn(`⚠️ Business ${business.businessId} has availability gaps. Extending now...`);
                    await this.availabilityService.ensureAllStaffAvailability(business.businessId.toString(), 90);
                }
            }
            this.logger.log('✅ Low availability check completed');
        }
        catch (error) {
            this.logger.error('❌ Error during low availability check:', error);
        }
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AvailabilitySchedulerService.prototype, "extendDailyAvailability", null);
__decorate([
    (0, schedule_1.Cron)('0 3 * * 0'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AvailabilitySchedulerService.prototype, "cleanupOldAvailability", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AvailabilitySchedulerService.prototype, "checkLowAvailability", null);
AvailabilitySchedulerService = AvailabilitySchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(business_hours_schema_1.BusinessHours.name)),
    __metadata("design:paramtypes", [availability_service_1.AvailabilityService,
        mongoose_2.Model])
], AvailabilitySchedulerService);
exports.AvailabilitySchedulerService = AvailabilitySchedulerService;
//# sourceMappingURL=availability-scheduler.service.js.map