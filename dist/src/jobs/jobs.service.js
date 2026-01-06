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
var JobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const schedule_1 = require("@nestjs/schedule");
let JobsService = JobsService_1 = class JobsService {
    constructor(payoutsQueue, reportsQueue, notificationsQueue, analyticsQueue) {
        this.payoutsQueue = payoutsQueue;
        this.reportsQueue = reportsQueue;
        this.notificationsQueue = notificationsQueue;
        this.analyticsQueue = analyticsQueue;
        this.logger = new common_1.Logger(JobsService_1.name);
    }
    async schedulePayout(tenantId, amount, period, delay) {
        try {
            const job = await this.payoutsQueue.add('process-payout', {
                tenantId,
                amount,
                period,
            }, {
                delay: delay || 0,
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 60000,
                },
                priority: 1,
            });
            this.logger.log(`Payout scheduled for tenant ${tenantId}: Job ${job.id}`);
            return job;
        }
        catch (error) {
            this.logger.error(`Failed to schedule payout: ${error.message}`, error.stack);
            throw error;
        }
    }
    async scheduleMonthlyReport(tenantId, month, year, sendEmail = true) {
        try {
            const job = await this.reportsQueue.add('generate-monthly-report', {
                tenantId,
                month,
                year,
                sendEmail,
            }, {
                attempts: 2,
                backoff: {
                    type: 'fixed',
                    delay: 300000,
                },
            });
            this.logger.log(`Monthly report scheduled for tenant ${tenantId}: Job ${job.id}`);
            return job;
        }
        catch (error) {
            this.logger.error(`Failed to schedule report: ${error.message}`, error.stack);
            throw error;
        }
    }
    async scheduleAnalytics(tenantId, dateRange, metrics) {
        try {
            const job = await this.analyticsQueue.add('generate-analytics', {
                tenantId,
                dateRange,
                metrics,
            }, {
                attempts: 2,
            });
            this.logger.log(`Analytics scheduled for tenant ${tenantId}: Job ${job.id}`);
            return job;
        }
        catch (error) {
            this.logger.error(`Failed to schedule analytics: ${error.message}`, error.stack);
            throw error;
        }
    }
    async scheduleBulkNotifications(notifications) {
        try {
            const jobs = await Promise.all(notifications.map(notification => this.notificationsQueue.add('send-notification', notification, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000,
                },
            })));
            this.logger.log(`Scheduled ${jobs.length} notifications`);
            return jobs;
        }
        catch (error) {
            this.logger.error(`Failed to schedule notifications: ${error.message}`, error.stack);
            throw error;
        }
    }
    async scheduleWeeklyPayouts() {
        try {
            this.logger.log('Starting weekly payout scheduling');
            await this.payoutsQueue.add('schedule-payouts', { period: 'weekly' }, {
                attempts: 1,
            });
            this.logger.log('Weekly payout scheduling completed');
        }
        catch (error) {
            this.logger.error('Failed to schedule weekly payouts', error.stack);
        }
    }
    async generateMonthlyReports() {
        try {
            this.logger.log('Starting monthly report generation');
            const now = new Date();
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const tenants = await this.getActiveTenants();
            for (const tenant of tenants) {
                await this.scheduleMonthlyReport(tenant.id, lastMonth.getMonth() + 1, lastMonth.getFullYear(), true);
            }
            this.logger.log(`Monthly reports scheduled for ${tenants.length} tenants`);
        }
        catch (error) {
            this.logger.error('Failed to generate monthly reports', error.stack);
        }
    }
    async cleanupOldJobs() {
        try {
            this.logger.log('Starting job cleanup');
            const queues = [
                this.payoutsQueue,
                this.reportsQueue,
                this.notificationsQueue,
                this.analyticsQueue,
            ];
            for (const queue of queues) {
                await queue.clean(7 * 24 * 60 * 60 * 1000, 'completed');
                await queue.clean(30 * 24 * 60 * 60 * 1000, 'failed');
            }
            this.logger.log('Job cleanup completed');
        }
        catch (error) {
            this.logger.error('Failed to cleanup jobs', error.stack);
        }
    }
    async getJobStatus(queueName, jobId) {
        try {
            const queue = this.getQueue(queueName);
            const job = await queue.getJob(jobId);
            if (!job) {
                return { status: 'not_found' };
            }
            const state = await job.getState();
            return {
                id: job.id,
                name: job.name,
                data: job.data,
                state,
                progress: job.progress(),
                attempts: job.attemptsMade,
                failedReason: job.failedReason,
                finishedOn: job.finishedOn,
                processedOn: job.processedOn,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get job status: ${error.message}`, error.stack);
            throw error;
        }
    }
    async cancelJob(queueName, jobId) {
        try {
            const queue = this.getQueue(queueName);
            const job = await queue.getJob(jobId);
            if (job) {
                await job.remove();
                this.logger.log(`Job ${jobId} cancelled from queue ${queueName}`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to cancel job: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getQueueStats(queueName) {
        try {
            const queue = this.getQueue(queueName);
            const [waiting, active, completed, failed, delayed] = await Promise.all([
                queue.getWaitingCount(),
                queue.getActiveCount(),
                queue.getCompletedCount(),
                queue.getFailedCount(),
                queue.getDelayedCount(),
            ]);
            return {
                queueName,
                waiting,
                active,
                completed,
                failed,
                delayed,
                total: waiting + active + completed + failed + delayed,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get queue stats: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getAllQueueStats() {
        const queueNames = ['payouts', 'reports', 'notifications', 'analytics'];
        return Promise.all(queueNames.map(name => this.getQueueStats(name)));
    }
    async pauseQueue(queueName) {
        try {
            const queue = this.getQueue(queueName);
            await queue.pause();
            this.logger.log(`Queue ${queueName} paused`);
        }
        catch (error) {
            this.logger.error(`Failed to pause queue: ${error.message}`, error.stack);
            throw error;
        }
    }
    async resumeQueue(queueName) {
        try {
            const queue = this.getQueue(queueName);
            await queue.resume();
            this.logger.log(`Queue ${queueName} resumed`);
        }
        catch (error) {
            this.logger.error(`Failed to resume queue: ${error.message}`, error.stack);
            throw error;
        }
    }
    async retryFailedJobs(queueName) {
        try {
            const queue = this.getQueue(queueName);
            const failedJobs = await queue.getFailed();
            let retriedCount = 0;
            for (const job of failedJobs) {
                await job.retry();
                retriedCount++;
            }
            this.logger.log(`Retried ${retriedCount} failed jobs in queue ${queueName}`);
            return retriedCount;
        }
        catch (error) {
            this.logger.error(`Failed to retry jobs: ${error.message}`, error.stack);
            throw error;
        }
    }
    getQueue(queueName) {
        const queues = {
            payouts: this.payoutsQueue,
            reports: this.reportsQueue,
            notifications: this.notificationsQueue,
            analytics: this.analyticsQueue,
        };
        const queue = queues[queueName];
        if (!queue) {
            throw new Error(`Queue ${queueName} not found`);
        }
        return queue;
    }
    async getActiveTenants() {
        return [
            { id: 'tenant1', name: 'Tenant 1' },
            { id: 'tenant2', name: 'Tenant 2' },
        ];
    }
};
__decorate([
    (0, schedule_1.Cron)('0 2 * * 1'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "scheduleWeeklyPayouts", null);
__decorate([
    (0, schedule_1.Cron)('0 3 1 * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "generateMonthlyReports", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "cleanupOldJobs", null);
JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('payouts')),
    __param(1, (0, bull_1.InjectQueue)('reports')),
    __param(2, (0, bull_1.InjectQueue)('notifications')),
    __param(3, (0, bull_1.InjectQueue)('analytics')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], JobsService);
exports.JobsService = JobsService;
//# sourceMappingURL=jobs.service.js.map