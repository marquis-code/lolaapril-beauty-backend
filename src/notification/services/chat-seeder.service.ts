import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { FAQ, FAQDocument, AutoResponse, AutoResponseDocument } from '../schemas/chat.schema'

@Injectable()
export class ChatSeederService {
  private readonly logger = new Logger(ChatSeederService.name)

  constructor(
    @InjectModel(FAQ.name) private faqModel: Model<FAQDocument>,
    @InjectModel(AutoResponse.name) private autoResponseModel: Model<AutoResponseDocument>,
  ) {}

  /**
   * Seed default FAQs for a business
   */
  async seedDefaultFAQs(businessId: string): Promise<void> {
    const defaultFAQs = [
      {
        businessId,
        question: 'What are your business hours?',
        answer: 'We are open Monday-Friday from 9:00 AM to 6:00 PM, and Saturday from 10:00 AM to 4:00 PM. We are closed on Sundays.',
        keywords: ['hours', 'open', 'time', 'schedule', 'when'],
        alternativeQuestions: [
          'When are you open?',
          'What time do you close?',
          'Are you open today?',
          'Business hours?',
        ],
        category: 'general',
        confidenceThreshold: 70,
        priority: 10,
      },
      {
        businessId,
        question: 'How do I book an appointment?',
        answer: 'You can book an appointment through our website, mobile app, or by calling us directly. Online booking is available 24/7!',
        keywords: ['book', 'appointment', 'schedule', 'reserve', 'booking'],
        alternativeQuestions: [
          'How to book?',
          'Can I make an appointment?',
          'Schedule appointment',
          'Book service',
        ],
        category: 'booking',
        confidenceThreshold: 75,
        priority: 10,
      },
      {
        businessId,
        question: 'What is your cancellation policy?',
        answer: 'We require at least 24 hours notice for cancellations. Cancellations made less than 24 hours before the appointment may incur a cancellation fee.',
        keywords: ['cancel', 'cancellation', 'policy', 'refund', 'reschedule'],
        alternativeQuestions: [
          'Can I cancel?',
          'Cancellation policy?',
          'How to cancel appointment?',
          'Reschedule appointment',
        ],
        category: 'booking',
        confidenceThreshold: 70,
        priority: 8,
      },
      {
        businessId,
        question: 'What payment methods do you accept?',
        answer: 'We accept cash, credit/debit cards (Visa, MasterCard), bank transfers, and mobile payments. Payment is due at the time of service.',
        keywords: ['payment', 'pay', 'card', 'cash', 'methods', 'accept'],
        alternativeQuestions: [
          'How can I pay?',
          'Payment options?',
          'Do you accept cards?',
          'Cash only?',
        ],
        category: 'payment',
        confidenceThreshold: 70,
        priority: 7,
      },
      {
        businessId,
        question: 'Where are you located?',
        answer: 'We are located at [Your Business Address]. Parking is available nearby. Need directions? Feel free to ask!',
        keywords: ['location', 'address', 'where', 'directions', 'parking'],
        alternativeQuestions: [
          'Where are you?',
          'Your address?',
          'How do I get there?',
          'Directions?',
        ],
        category: 'general',
        confidenceThreshold: 75,
        priority: 6,
      },
      {
        businessId,
        question: 'Do you offer gift certificates?',
        answer: 'Yes! We offer gift certificates in various amounts. They make perfect gifts and never expire. You can purchase them online or in-store.',
        keywords: ['gift', 'certificate', 'voucher', 'card', 'present'],
        alternativeQuestions: [
          'Gift cards?',
          'Can I buy a gift certificate?',
          'Vouchers available?',
        ],
        category: 'services',
        confidenceThreshold: 70,
        priority: 5,
      },
      {
        businessId,
        question: 'Do you have a loyalty program?',
        answer: 'Yes! Our loyalty program rewards you with points for every visit. Points can be redeemed for discounts on future services. Ask us how to join!',
        keywords: ['loyalty', 'rewards', 'points', 'program', 'membership'],
        alternativeQuestions: [
          'Rewards program?',
          'Do you have points?',
          'Loyalty card?',
          'Membership benefits?',
        ],
        category: 'services',
        confidenceThreshold: 70,
        priority: 5,
      },
      {
        businessId,
        question: 'What services do you offer?',
        answer: 'We offer a wide range of services including haircuts, styling, coloring, treatments, manicures, pedicures, and more. Check our services page for the complete list!',
        keywords: ['services', 'offer', 'what', 'treatments', 'menu'],
        alternativeQuestions: [
          'What do you do?',
          'Service menu?',
          'List of services?',
          'Available treatments?',
        ],
        category: 'services',
        confidenceThreshold: 70,
        priority: 9,
      },
      {
        businessId,
        question: 'Do I need to bring anything to my appointment?',
        answer: 'Just bring yourself! However, if you have specific products you prefer or inspiration photos, feel free to bring those along.',
        keywords: ['bring', 'need', 'appointment', 'requirements', 'preparation'],
        alternativeQuestions: [
          'What to bring?',
          'Should I prepare?',
          'Appointment requirements?',
        ],
        category: 'booking',
        confidenceThreshold: 65,
        priority: 4,
      },
      {
        businessId,
        question: 'Can I request a specific staff member?',
        answer: 'Absolutely! You can request your preferred stylist or therapist when booking. We\'ll do our best to accommodate your preference based on availability.',
        keywords: ['staff', 'stylist', 'therapist', 'request', 'specific', 'prefer'],
        alternativeQuestions: [
          'Can I choose my stylist?',
          'Request specific person?',
          'Preferred staff member?',
        ],
        category: 'booking',
        confidenceThreshold: 70,
        priority: 6,
      },
    ]

    for (const faq of defaultFAQs) {
      await this.faqModel.findOneAndUpdate(
        { businessId, question: faq.question },
        faq,
        { upsert: true, new: true }
      )
    }

    this.logger.log(`✅ Seeded ${defaultFAQs.length} default FAQs for business ${businessId}`)
  }

  /**
   * Seed default auto-responses for a business
   */
  async seedDefaultAutoResponses(businessId: string): Promise<void> {
    const defaultResponses = [
      {
        businessId,
        name: 'Welcome Message',
        responseType: 'welcome',
        message: 'Hi there! 👋 Welcome to our chat support. I\'m here to help you with any questions about our services, bookings, or anything else. How can I assist you today?',
        trigger: {
          event: 'user-joined',
        },
        isActive: true,
        quickReplies: [
          '📅 Book an Appointment',
          '⏰ Check Business Hours',
          '💇 View Services',
          '📍 Get Directions',
        ],
      },
      {
        businessId,
        name: 'After Hours Response',
        responseType: 'offline',
        message: 'Thank you for reaching out! 🌙 We\'re currently offline, but we\'ll respond as soon as we\'re back online. Our typical hours are Monday-Friday 9AM-6PM, Saturday 10AM-4PM.',
        trigger: {
          event: 'after-hours',
          conditions: {
            dayOfWeek: [0, 6],
            timeRange: { start: '18:00', end: '09:00' },
          },
        },
        isActive: true,
        includeBusinessHours: true,
        quickReplies: [
          '📅 Book for Tomorrow',
          '📞 Leave a Message',
          '❓ View FAQs',
        ],
      },
      {
        businessId,
        name: 'High Traffic Response',
        responseType: 'busy',
        message: 'Thanks for your patience! ⏳ We\'re experiencing high volume right now. A team member will be with you shortly. In the meantime, you can check our FAQs for quick answers.',
        trigger: {
          event: 'high-load',
          conditions: {
            queueSize: 5,
            maxWaitTime: 120,
          },
        },
        isActive: true,
        includeEstimatedWaitTime: true,
        quickReplies: [
          '❓ View FAQs',
          '📱 Call Us Instead',
          '✉️ Send Email',
        ],
      },
      {
        businessId,
        name: 'Holiday Response',
        responseType: 'holiday',
        message: 'Happy Holidays! 🎉 We\'re currently closed for the holidays but will be back on [DATE]. We\'ll respond to your message when we return. Thank you for your patience!',
        trigger: {
          event: 'after-hours',
        },
        isActive: false, // Activate manually during holidays
        quickReplies: [
          '📅 Book Ahead',
          '🎁 Gift Certificates',
          '📞 Emergency Contact',
        ],
      },
      {
        businessId,
        name: 'Away Message',
        responseType: 'away',
        message: 'Thank you for your message! 💼 Our team is currently assisting other customers. We\'ll get back to you within 15-20 minutes. Your patience is appreciated!',
        trigger: {
          event: 'no-staff-available',
        },
        isActive: true,
        includeEstimatedWaitTime: true,
      },
    ]

    for (const response of defaultResponses) {
      await this.autoResponseModel.findOneAndUpdate(
        { businessId, name: response.name },
        response,
        { upsert: true, new: true }
      )
    }

    this.logger.log(`✅ Seeded ${defaultResponses.length} default auto-responses for business ${businessId}`)
  }

  /**
   * Seed everything for a new business
   */
  async seedAllForBusiness(businessId: string): Promise<void> {
    await Promise.all([
      this.seedDefaultFAQs(businessId),
      this.seedDefaultAutoResponses(businessId),
    ])

    this.logger.log(`🎉 Successfully seeded all chat data for business ${businessId}`)
  }
}
