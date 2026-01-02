// // jobs/jobs.service.ts
// import { Injectable } from '@nestjs/common';
// import { InjectQueue } from '@nestjs/bull';
// import { Queue } from 'bull';

// @Injectable()
// export class JobsService {
//   constructor(
//     @InjectQueue('reminders') private reminderQueue: Queue,
//     @InjectQueue('payouts') private payoutQueue: Queue,
//     @InjectQueue('reports') private reportQueue: Queue,
//     @InjectQueue('notifications') private notificationQueue: Queue,
//   ) {}

//   // Schedule a booking reminder
//   async scheduleBookingReminder(bookingId: string, sendAt: Date) {
//     return this.reminderQueue.add(
//       'send-booking-reminder',
//       { bookingId, reminderType: 'scheduled' },
//       {
//         delay: sendAt.getTime() - Date.now(),
//       },
//     );
//   }

//   // Schedule daily reminder check (run every day at 8 AM)
//   async scheduleDailyReminderCheck() {
//     return this.reminderQueue.add(
//       'schedule-reminders',
//       {},
//       {
//         repeat: {
//           cron: '0 8 * * *', // 8 AM every day
//         },
//       },
//     );
//   }

//   // Schedule payout
//   async schedulePayout(tenantId: string, amount: number, period: string) {
//     return this.payoutQueue.add('process-payout', {
//       tenantId,
//       amount,
//       period,
//     });
//   }

//   // Schedule weekly payouts (run every Monday at 10 AM)
//   async scheduleWeeklyPayouts() {
//     return this.payoutQueue.add(
//       'schedule-payouts',
//       {},
//       {
//         repeat: {
//           cron: '0 10 * * 1', // 10 AM every Monday
//         },
//       },
//     );
//   }

//   // Generate monthly report
//   async generateMonthlyReport(tenantId: string, month: number, year: number) {
//     return this.reportQueue.add('generate-monthly-report', {
//       tenantId,
//       month,
//       year,
//     });
//   }

//   // Send notification
//   async sendNotification(notificationData: any) {
//     return this.notificationQueue.add('send-notification', notificationData);
//   }

//   // Get job status
//   async getJobStatus(jobId: string, queueName: string) {
//     let queue: Queue;
    
//     switch (queueName) {
//       case 'reminders':
//         queue = this.reminderQueue;
//         break;
//       case 'payouts':
//         queue = this.payoutQueue;
//         break;
//       case 'reports':
//         queue = this.reportQueue;
//         break;
//       default:
//         throw new Error('Invalid queue name');
//     }

//     const job = await queue.getJob(jobId);
    
//     if (!job) {
//       return null;
//     }

//     return {
//       id: job.id,
//       name: job.name,
//       data: job.data,
//       progress: await job.progress(),
//       state: await job.getState(),
//       result: job.returnvalue,
//     };
//   }
// }

// jobs/jobs.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectQueue('payouts') private payoutsQueue: Queue,
    @InjectQueue('reports') private reportsQueue: Queue,
    @InjectQueue('notifications') private notificationsQueue: Queue,
    @InjectQueue('analytics') private analyticsQueue: Queue,
  ) {}

  /**
   * Schedule a payout for a specific tenant
   */
  async schedulePayout(
    tenantId: string,
    amount: number,
    period: 'daily' | 'weekly' | 'monthly',
    delay?: number
  ): Promise<any> {
    try {
      const job = await this.payoutsQueue.add(
        'process-payout',
        {
          tenantId,
          amount,
          period,
        },
        {
          delay: delay || 0,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 60000,
          },
          priority: 1, // High priority
        }
      );

      this.logger.log(`Payout scheduled for tenant ${tenantId}: Job ${job.id}`);
      return job;
    } catch (error) {
      this.logger.error(`Failed to schedule payout: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Schedule monthly report generation
   */
  async scheduleMonthlyReport(
    tenantId: string,
    month: number,
    year: number,
    sendEmail: boolean = true
  ): Promise<any> {
    try {
      const job = await this.reportsQueue.add(
        'generate-monthly-report',
        {
          tenantId,
          month,
          year,
          sendEmail,
        },
        {
          attempts: 2,
          backoff: {
            type: 'fixed',
            delay: 300000, // 5 minutes
          },
        }
      );

      this.logger.log(`Monthly report scheduled for tenant ${tenantId}: Job ${job.id}`);
      return job;
    } catch (error) {
      this.logger.error(`Failed to schedule report: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Schedule analytics generation
   */
  async scheduleAnalytics(
    tenantId: string,
    dateRange: { startDate: Date; endDate: Date },
    metrics?: string[]
  ): Promise<any> {
    try {
      const job = await this.analyticsQueue.add(
        'generate-analytics',
        {
          tenantId,
          dateRange,
          metrics,
        },
        {
          attempts: 2,
        }
      );

      this.logger.log(`Analytics scheduled for tenant ${tenantId}: Job ${job.id}`);
      return job;
    } catch (error) {
      this.logger.error(`Failed to schedule analytics: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Schedule bulk notification sending
   */
  async scheduleBulkNotifications(
    notifications: Array<{
      recipientId: string;
      type: string;
      data: any;
    }>
  ): Promise<any[]> {
    try {
      const jobs = await Promise.all(
        notifications.map(notification =>
          this.notificationsQueue.add(
            'send-notification',
            notification,
            {
              attempts: 3,
              backoff: {
                type: 'exponential',
                delay: 5000,
              },
            }
          )
        )
      );

      this.logger.log(`Scheduled ${jobs.length} notifications`);
      return jobs;
    } catch (error) {
      this.logger.error(`Failed to schedule notifications: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Cron job: Schedule weekly payouts every Monday at 2 AM
   */
  @Cron('0 2 * * 1') // Every Monday at 2:00 AM
  async scheduleWeeklyPayouts(): Promise<void> {
    try {
      this.logger.log('Starting weekly payout scheduling');

      await this.payoutsQueue.add(
        'schedule-payouts',
        { period: 'weekly' },
        {
          attempts: 1,
        }
      );

      this.logger.log('Weekly payout scheduling completed');
    } catch (error) {
      this.logger.error('Failed to schedule weekly payouts', error.stack);
    }
  }

  /**
   * Cron job: Generate monthly reports on the 1st of each month at 3 AM
   */
  @Cron('0 3 1 * *') // 1st of every month at 3:00 AM
  async generateMonthlyReports(): Promise<void> {
    try {
      this.logger.log('Starting monthly report generation');

      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      // In production, you'd fetch all active tenants from database
      // For now, this is a placeholder
      const tenants = await this.getActiveTenants();

      for (const tenant of tenants) {
        await this.scheduleMonthlyReport(
          tenant.id,
          lastMonth.getMonth() + 1,
          lastMonth.getFullYear(),
          true
        );
      }

      this.logger.log(`Monthly reports scheduled for ${tenants.length} tenants`);
    } catch (error) {
      this.logger.error('Failed to generate monthly reports', error.stack);
    }
  }

  /**
   * Cron job: Clean up old completed jobs every day at midnight
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldJobs(): Promise<void> {
    try {
      this.logger.log('Starting job cleanup');

      const queues = [
        this.payoutsQueue,
        this.reportsQueue,
        this.notificationsQueue,
        this.analyticsQueue,
      ];

      for (const queue of queues) {
        // Clean completed jobs older than 7 days
        await queue.clean(7 * 24 * 60 * 60 * 1000, 'completed');
        
        // Clean failed jobs older than 30 days
        await queue.clean(30 * 24 * 60 * 60 * 1000, 'failed');
      }

      this.logger.log('Job cleanup completed');
    } catch (error) {
      this.logger.error('Failed to cleanup jobs', error.stack);
    }
  }

  /**
   * Get job status
   */
  async getJobStatus(queueName: string, jobId: string): Promise<any> {
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
    } catch (error) {
      this.logger.error(`Failed to get job status: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Cancel a job
   */
  async cancelJob(queueName: string, jobId: string): Promise<void> {
    try {
      const queue = this.getQueue(queueName);
      const job = await queue.getJob(jobId);

      if (job) {
        await job.remove();
        this.logger.log(`Job ${jobId} cancelled from queue ${queueName}`);
      }
    } catch (error) {
      this.logger.error(`Failed to cancel job: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(queueName: string): Promise<any> {
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
    } catch (error) {
      this.logger.error(`Failed to get queue stats: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get all queue statistics
   */
  async getAllQueueStats(): Promise<any[]> {
    const queueNames = ['payouts', 'reports', 'notifications', 'analytics'];
    
    return Promise.all(
      queueNames.map(name => this.getQueueStats(name))
    );
  }

  /**
   * Pause a queue
   */
  async pauseQueue(queueName: string): Promise<void> {
    try {
      const queue = this.getQueue(queueName);
      await queue.pause();
      this.logger.log(`Queue ${queueName} paused`);
    } catch (error) {
      this.logger.error(`Failed to pause queue: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Resume a queue
   */
  async resumeQueue(queueName: string): Promise<void> {
    try {
      const queue = this.getQueue(queueName);
      await queue.resume();
      this.logger.log(`Queue ${queueName} resumed`);
    } catch (error) {
      this.logger.error(`Failed to resume queue: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retry failed jobs in a queue
   */
  async retryFailedJobs(queueName: string): Promise<number> {
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
    } catch (error) {
      this.logger.error(`Failed to retry jobs: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Helper methods
  private getQueue(queueName: string): Queue {
    const queues: Record<string, Queue> = {
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

  private async getActiveTenants(): Promise<Array<{ id: string; name: string }>> {
    // In production, fetch from database
    // This is a placeholder
    return [
      { id: 'tenant1', name: 'Tenant 1' },
      { id: 'tenant2', name: 'Tenant 2' },
    ];
  }
}