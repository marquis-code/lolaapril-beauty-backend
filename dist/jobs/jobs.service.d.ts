import { Queue } from 'bull';
export declare class JobsService {
    private payoutsQueue;
    private reportsQueue;
    private notificationsQueue;
    private analyticsQueue;
    private readonly logger;
    constructor(payoutsQueue: Queue, reportsQueue: Queue, notificationsQueue: Queue, analyticsQueue: Queue);
    schedulePayout(tenantId: string, amount: number, period: 'daily' | 'weekly' | 'monthly', delay?: number): Promise<any>;
    scheduleMonthlyReport(tenantId: string, month: number, year: number, sendEmail?: boolean): Promise<any>;
    scheduleAnalytics(tenantId: string, dateRange: {
        startDate: Date;
        endDate: Date;
    }, metrics?: string[]): Promise<any>;
    scheduleBulkNotifications(notifications: Array<{
        recipientId: string;
        type: string;
        data: any;
    }>): Promise<any[]>;
    scheduleWeeklyPayouts(): Promise<void>;
    generateMonthlyReports(): Promise<void>;
    cleanupOldJobs(): Promise<void>;
    getJobStatus(queueName: string, jobId: string): Promise<any>;
    cancelJob(queueName: string, jobId: string): Promise<void>;
    getQueueStats(queueName: string): Promise<any>;
    getAllQueueStats(): Promise<any[]>;
    pauseQueue(queueName: string): Promise<void>;
    resumeQueue(queueName: string): Promise<void>;
    retryFailedJobs(queueName: string): Promise<number>;
    private getQueue;
    private getActiveTenants;
}
