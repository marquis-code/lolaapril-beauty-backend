
import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    from?: string
  ): Promise<{ messageId: string; success: boolean; error?: string }> {
    try {
      const info = await this.transporter.sendMail({
        from: from || process.env.FROM_EMAIL || 'noreply@salon.com',
        to,
        subject,
        html,
      })

      return {
        messageId: info.messageId,
        success: true,
      }
    } catch (error) {
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