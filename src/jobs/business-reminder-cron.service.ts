import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from '../appointment/schemas/appointment.schema';
import { EmailService } from '../notification/email.service';
import { EmailTemplatesService } from '../notification/templates/email-templates.service';

@Injectable()
export class BusinessReminderCronService {
    private readonly logger = new Logger(BusinessReminderCronService.name);

    constructor(
        @InjectModel(Appointment.name)
        private appointmentModel: Model<AppointmentDocument>,
        private readonly emailService: EmailService,
        private readonly emailTemplatesService: EmailTemplatesService,
    ) { }

    /**
     * Runs every 2 hours during business hours to remind businesses
     * to mark past appointments as completed.
     * Uncompleted appointments = no sale = no report = no tax record.
     */
    @Cron('0 0 8,10,12,14,16,18 * * *') // Every 2hrs during 8AM–6PM
    async remindBusinessesToCompleteAppointments(): Promise<void> {
        this.logger.log('📋 Checking for uncompleted past appointments...');

        try {
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);

            // Find appointments that are past their date but still confirmed (not completed)
            const uncompletedAppointments = await this.appointmentModel.find({
                status: { $in: ['confirmed', 'in_progress'] },
                selectedDate: { $lt: now },
            }).lean();

            if (uncompletedAppointments.length === 0) {
                this.logger.log('📋 No uncompleted appointments found.');
                return;
            }

            // Group by business
            const businessGroups: Record<string, any[]> = {};
            for (const apt of uncompletedAppointments) {
                const bizId = apt.businessInfo?.businessId || 'unknown';
                if (!businessGroups[bizId]) {
                    businessGroups[bizId] = [];
                }
                businessGroups[bizId].push(apt);
            }

            for (const [businessId, appointments] of Object.entries(businessGroups)) {
                const businessName = appointments[0]?.businessInfo?.businessName || 'Business';

                const pendingList = appointments.map(apt => ({
                    clientName: apt.clientId?.toString() || 'Customer',
                    serviceName: apt.serviceDetails?.serviceName || 'Service',
                    date: apt.selectedDate
                        ? new Date(apt.selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : 'N/A',
                    time: apt.selectedTime || 'N/A',
                    appointmentId: apt._id?.toString(),
                }));

                const emailData = this.emailTemplatesService.businessCompleteReminder({
                    businessName,
                    pendingAppointments: pendingList,
                });

                // Send to business email (using a generic approach — in production you'd look up the business email)
                const businessEmail = process.env.STAFF_NOTIFICATION_EMAIL || 'admin@lolaapril.com';

                await this.emailService.sendEmail(
                    businessEmail,
                    emailData.subject,
                    emailData.html,
                );

                this.logger.log(`✅ Sent completion reminder to ${businessName} for ${appointments.length} appointment(s)`);
            }
        } catch (error) {
            this.logger.error(`❌ Business reminder cron failed: ${error.message}`);
        }
    }
}
