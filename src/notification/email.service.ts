
import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'

@Injectable()
export class EmailService {
  private resend: Resend

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('⚠️  RESEND_API_KEY not found in environment variables')
    }
    this.resend = new Resend(apiKey || 'demo_key')
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    from?: string
  ): Promise<{ messageId: string; success: boolean; error?: string }> {
    try {
      const fromEmail = from || process.env.FROM_EMAIL || 'onboarding@resend.dev'
      
      const { data, error } = await this.resend.emails.send({
        from: fromEmail,
        to: [to],
        subject,
        html,
      })

      if (error) {
        console.error('❌ Resend email error:', error)
        return {
          messageId: '',
          success: false,
          error: error.message || JSON.stringify(error),
        }
      }

      return {
        messageId: data?.id || '',
        success: true,
      }
    } catch (error) {
      console.error('❌ Email sending failed:', error)
      return {
        messageId: '',
        success: false,
        error: error.message,
      }
    }
  }

  async sendBulkEmail(
    recipients: string[],
    subject: string,
    html: string,
    from?: string
  ): Promise<{ sent: number; failed: number; errors: any[] }> {
    const results = await Promise.allSettled(
      recipients.map(email => this.sendEmail(email, subject, html, from))
    )

    const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.length - sent
    const errors = results
      .filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
      .map(r => r.status === 'rejected' ? r.reason : (r as any).value.error)

    return { sent, failed, errors }
  }
}