// jobs/processors/reminder.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Processor('reminders')
@Injectable()
export class ReminderProcessor {
  constructor(
    @InjectModel('Booking') private bookingModel: Model<any>,
    @InjectModel('Notification') private notificationModel: Model<any>,
  ) {}

  @Process('send-booking-reminder')
  async handleBookingReminder(job: Job) {
    const { bookingId, reminderType } = job.data;

    console.log(`Processing ${reminderType} reminder for booking ${bookingId}`);

    const booking = await this.bookingModel
      .findById(bookingId)
      .populate('clientId')
      .populate('businessId');

    if (!booking) {
      console.error(`Booking ${bookingId} not found`);
      return;
    }

    // Send notification
    await this.notificationModel.create({
      recipientId: booking.clientId._id,
      type: 'booking_reminder',
      channel: 'email',
      subject: `Reminder: Upcoming appointment`,
      message: `Your appointment is scheduled for ${booking.bookingDate}`,
      status: 'pending',
    });

    console.log(`Reminder sent for booking ${bookingId}`);
  }

  @Process('schedule-reminders')
  async scheduleReminders(job: Job) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const upcomingBookings = await this.bookingModel.find({
      bookingDate: {
        $gte: tomorrow,
        $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
      },
      status: 'confirmed',
    });

    console.log(`Found ${upcomingBookings.length} bookings for tomorrow`);

    // Add jobs to queue for each booking
    for (const booking of upcomingBookings) {
      await job.queue.add('send-booking-reminder', {
        bookingId: booking._id.toString(),
        reminderType: '24_hour',
      });
    }
  }
}