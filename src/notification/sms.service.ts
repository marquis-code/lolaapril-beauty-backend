
import { Injectable } from '@nestjs/common'
import axios from 'axios'

@Injectable()
export class SMSService {
  private readonly baseUrl: string
  private readonly apiKey: string

  constructor() {
    // Using Twilio as example - adjust for your SMS provider
    this.baseUrl = process.env.TWILIO_BASE_URL || 'https://api.twilio.com/2010-04-01'
    this.apiKey = process.env.TWILIO_API_KEY
  }

  async sendSMS(
    to: string,
    message: string,
    from?: string
  ): Promise<{ messageId: string; success: boolean; error?: string }> {
    try {
      // Format phone number
      const formattedPhone = this.formatPhoneNumber(to)
      
      const response = await axios.post(
        `${this.baseUrl}/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          To: formattedPhone,
          From: from || process.env.TWILIO_PHONE_NUMBER,
          Body: message,
        },
        {
          auth: {
            username: process.env.TWILIO_ACCOUNT_SID,
            password: process.env.TWILIO_AUTH_TOKEN,
          },
        }
      )

      return {
        messageId: response.data.sid,
        success: true,
      }
    } catch (error) {
      return {
        messageId: '',
        success: false,
        error: error.response?.data?.message || error.message,
      }
    }
  }

  async sendBulkSMS(
    recipients: string[],
    message: string,
    from?: string
  ): Promise<{ sent: number; failed: number; errors: any[] }> {
    const results = await Promise.allSettled(
      recipients.map(phone => this.sendSMS(phone, message, from))
    )

    const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.length - sent
    const errors = results
      .filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
      .map(r => r.status === 'rejected' ? r.reason : (r as any).value.error)

    return { sent, failed, errors }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')
    
    // Add country code if not present (assuming Nigeria +234)
    if (cleaned.startsWith('0')) {
      return `+234${cleaned.substring(1)}`
    }
    if (!cleaned.startsWith('+')) {
      return `+234${cleaned}`
    }
    return cleaned
  }
}