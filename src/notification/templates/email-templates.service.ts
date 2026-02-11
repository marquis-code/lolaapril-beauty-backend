import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailTemplatesService {

  // Brand color palette — primary teal #005967
  private readonly brandColor = '#005967';
  private readonly brandDark = '#003d47';
  private readonly brandLight = '#e6f2f4';
  private readonly brandAccent = '#007a8a';
  private readonly frontendUrl = process.env.FRONTEND_URL || 'https://lolaapril.com';

  // Default logo URL — can be overridden per template
  private readonly defaultLogoUrl = process.env.BUSINESS_LOGO_URL || '';

  // ================================================================
  // SHARED LAYOUT
  // ================================================================
  private wrapInLayout(title: string, bodyContent: string, logoUrl?: string): string {
    const logo = logoUrl || this.defaultLogoUrl;
    const headerContent = logo
      ? `<img src="${logo}" alt="Lola April" style="max-width:180px;max-height:60px;height:auto;" />`
      : `<h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Lola April</h1>
               <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.80);letter-spacing:1px;text-transform:uppercase;">Beauty &amp; Wellness</p>`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f5f6;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f5f6;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,89,103,0.08);">
          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,${this.brandDark} 0%,${this.brandColor} 100%);padding:32px 40px;text-align:center;">
              ${headerContent}
            </td>
          </tr>
          <!-- BODY -->
          <tr>
            <td style="padding:40px;">
              ${bodyContent}
            </td>
          </tr>
          <!-- FOOTER -->
          <tr>
            <td style="background:${this.brandLight};padding:24px 40px;text-align:center;border-top:1px solid #cce5e9;">
              <p style="margin:0 0 8px;font-size:12px;color:#5a7a80;">You're receiving this email because you're a valued Lola April customer.</p>
              <p style="margin:0;font-size:12px;color:#5a7a80;">© ${new Date().getFullYear()} Lola April Beauty &amp; Wellness. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private ctaButton(text: string, url: string): string {
    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:24px 0;">
            <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,${this.brandColor} 0%,${this.brandDark} 100%);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:50px;font-size:16px;font-weight:600;letter-spacing:0.3px;box-shadow:0 4px 16px rgba(0,89,103,0.3);">${text}</a>
          </td>
        </tr>
      </table>`;
  }

  private serviceTable(services: Array<{ serviceName: string; price: number; quantity?: number; duration?: number }>): string {
    const rows = services.map(s => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #cce5e9;font-size:14px;color:#1a3a40;">${s.serviceName}</td>
        <td style="padding:10px 0;border-bottom:1px solid #cce5e9;font-size:14px;color:#5a7a80;text-align:center;">${s.quantity || 1}</td>
        <td style="padding:10px 0;border-bottom:1px solid #cce5e9;font-size:14px;color:#1a3a40;text-align:right;font-weight:600;">₦${((s.price || 0) * (s.quantity || 1)).toLocaleString()}</td>
      </tr>`).join('');

    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
        <tr>
          <td style="padding:8px 0;border-bottom:2px solid ${this.brandColor};font-size:12px;color:#5a7a80;text-transform:uppercase;letter-spacing:1px;">Service</td>
          <td style="padding:8px 0;border-bottom:2px solid ${this.brandColor};font-size:12px;color:#5a7a80;text-transform:uppercase;letter-spacing:1px;text-align:center;">Qty</td>
          <td style="padding:8px 0;border-bottom:2px solid ${this.brandColor};font-size:12px;color:#5a7a80;text-transform:uppercase;letter-spacing:1px;text-align:right;">Amount</td>
        </tr>
        ${rows}
      </table>`;
  }

  private infoBox(label: string, value: string, icon: string): string {
    return `
      <td style="padding:12px;background:${this.brandLight};border-radius:12px;text-align:center;width:33%;">
        <p style="margin:0 0 4px;font-size:20px;">${icon}</p>
        <p style="margin:0 0 2px;font-size:11px;color:#5a7a80;text-transform:uppercase;letter-spacing:0.5px;">${label}</p>
        <p style="margin:0;font-size:14px;color:${this.brandDark};font-weight:600;">${value}</p>
      </td>`;
  }

  // ================================================================
  // BOOKING CONFIRMATION
  // ================================================================
  bookingConfirmation(data: {
    clientName: string;
    bookingNumber: string;
    services: Array<{ serviceName: string; price: number; quantity?: number; duration?: number }>;
    preferredDate: string;
    preferredStartTime: string;
    estimatedEndTime: string;
    totalAmount: number;
    businessName: string;
    businessPhone?: string;
    specialRequests?: string;
    logoUrl?: string;
  }): { subject: string; html: string } {
    const body = `
      <h2 style="margin:0 0 8px;font-size:24px;color:${this.brandDark};">Booking Confirmed! 🎉</h2>
      <p style="margin:0 0 24px;font-size:15px;color:#3a5a60;line-height:1.6;">
        Hi <strong>${data.clientName}</strong>, your booking has been successfully confirmed. We can't wait to see you!
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="background:linear-gradient(135deg,${this.brandLight} 0%,#d4eef1 100%);padding:16px 20px;border-radius:12px;border-left:4px solid ${this.brandColor};">
            <p style="margin:0 0 4px;font-size:12px;color:#5a7a80;text-transform:uppercase;letter-spacing:1px;">Booking Number</p>
            <p style="margin:0;font-size:20px;color:${this.brandDark};font-weight:700;letter-spacing:1px;">${data.bookingNumber}</p>
          </td>
        </tr>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="8">
        <tr>
          ${this.infoBox('Date', data.preferredDate, '📅')}
          ${this.infoBox('Time', `${data.preferredStartTime} - ${data.estimatedEndTime}`, '🕐')}
          ${this.infoBox('Business', data.businessName, '💆')}
        </tr>
      </table>

      ${this.serviceTable(data.services)}

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
        <tr>
          <td style="padding:12px 0;font-size:18px;color:${this.brandDark};font-weight:700;">Total</td>
          <td style="padding:12px 0;font-size:18px;color:${this.brandColor};font-weight:700;text-align:right;">₦${data.totalAmount.toLocaleString()}</td>
        </tr>
      </table>

      ${data.specialRequests ? `
        <div style="margin-top:16px;padding:12px 16px;background:#fef3cd;border-radius:8px;border-left:4px solid #f59e0b;">
          <p style="margin:0 0 4px;font-size:12px;color:#92400e;text-transform:uppercase;letter-spacing:0.5px;">Special Requests</p>
          <p style="margin:0;font-size:14px;color:#78350f;">${data.specialRequests}</p>
        </div>` : ''}

      ${this.ctaButton('View My Booking', `${this.frontendUrl}/bookings`)}

      <p style="margin:24px 0 0;font-size:13px;color:#5a7a80;text-align:center;">
        Need to make changes? Contact ${data.businessName}${data.businessPhone ? ` at ${data.businessPhone}` : ''}.
      </p>`;

    return {
      subject: `✨ Booking Confirmed — ${data.bookingNumber} | Lola April`,
      html: this.wrapInLayout('Booking Confirmed', body, data.logoUrl),
    };
  }

  // ================================================================
  // BOOKING REMINDER
  // ================================================================
  bookingReminder(data: {
    clientName: string;
    bookingNumber: string;
    services: Array<{ serviceName: string; price: number; quantity?: number }>;
    preferredDate: string;
    preferredStartTime: string;
    businessName: string;
    businessAddress?: string;
    reminderTier: string;
    logoUrl?: string;
  }): { subject: string; html: string } {
    const tierLabels: Record<string, { label: string; emoji: string; urgency: string }> = {
      '7d': { label: '1 Week Away', emoji: '📅', urgency: 'Your appointment is coming up in a week!' },
      '4d': { label: '4 Days Away', emoji: '⏳', urgency: 'Your appointment is just 4 days away!' },
      '2d': { label: '2 Days Away', emoji: '🔔', urgency: 'Your appointment is in 2 days!' },
      '1d': { label: 'Tomorrow!', emoji: '⭐', urgency: 'Your appointment is TOMORROW!' },
      'morning': { label: 'Today!', emoji: '🌟', urgency: 'Your appointment is TODAY! We can\'t wait to see you!' },
      '2h': { label: '2 Hours Away', emoji: '⚡', urgency: 'Your appointment starts in just 2 hours!' },
    };

    const tier = tierLabels[data.reminderTier] || tierLabels['1d'];

    const body = `
      <div style="text-align:center;margin-bottom:24px;">
        <p style="font-size:48px;margin:0;">${tier.emoji}</p>
        <h2 style="margin:8px 0;font-size:24px;color:${this.brandDark};">Appointment ${tier.label}</h2>
        <p style="margin:0;font-size:15px;color:#3a5a60;line-height:1.6;">${tier.urgency}</p>
      </div>

      <p style="font-size:15px;color:#3a5a60;line-height:1.6;">Hi <strong>${data.clientName}</strong>,</p>
      <p style="font-size:15px;color:#3a5a60;line-height:1.6;">Just a friendly reminder about your upcoming appointment.</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="8" style="margin:24px 0;">
        <tr>
          ${this.infoBox('Date', data.preferredDate, '📅')}
          ${this.infoBox('Time', data.preferredStartTime, '🕐')}
          ${this.infoBox('At', data.businessName, '📍')}
        </tr>
      </table>

      ${data.businessAddress ? `
        <div style="padding:12px 16px;background:#f0fdf4;border-radius:8px;border-left:4px solid #22c55e;margin-bottom:16px;">
          <p style="margin:0 0 2px;font-size:12px;color:#166534;text-transform:uppercase;letter-spacing:0.5px;">📍 Location</p>
          <p style="margin:0;font-size:14px;color:#15803d;">${data.businessAddress}</p>
        </div>` : ''}

      ${this.serviceTable(data.services)}
      ${this.ctaButton('View My Booking', `${this.frontendUrl}/bookings`)}

      <p style="margin:24px 0 0;font-size:13px;color:#5a7a80;text-align:center;line-height:1.5;">
        Need to reschedule? Please let us know at least 24 hours in advance.
      </p>`;

    return {
      subject: `${tier.emoji} ${tier.label} — Your Appointment at ${data.businessName}`,
      html: this.wrapInLayout('Appointment Reminder', body, data.logoUrl),
    };
  }

  // ================================================================
  // THANK YOU + REVIEW REQUEST
  // ================================================================
  thankYouAndReview(data: {
    clientName: string;
    serviceName: string;
    businessName: string;
    appointmentId: string;
    businessId: string;
    logoUrl?: string;
  }): { subject: string; html: string } {
    const reviewUrl = `${this.frontendUrl}/review?appointmentId=${data.appointmentId}&businessId=${data.businessId}`;

    const body = `
      <div style="text-align:center;margin-bottom:24px;">
        <p style="font-size:56px;margin:0;">💖</p>
        <h2 style="margin:8px 0;font-size:26px;color:${this.brandDark};">Thank You, ${data.clientName}!</h2>
      </div>

      <p style="font-size:15px;color:#3a5a60;line-height:1.8;text-align:center;">
        We truly appreciate you choosing <strong>${data.businessName}</strong> for your <strong>${data.serviceName}</strong> service.
        Your beauty and wellness journey matters to us, and we hope you feel absolutely radiant! ✨
      </p>

      <div style="margin:32px 0;padding:24px;background:linear-gradient(135deg,${this.brandLight} 0%,#d4eef1 100%);border-radius:16px;text-align:center;">
        <p style="font-size:20px;margin:0 0 4px;">⭐⭐⭐⭐⭐</p>
        <h3 style="margin:0 0 8px;font-size:18px;color:${this.brandDark};">How was your experience?</h3>
        <p style="margin:0 0 16px;font-size:14px;color:#3a5a60;line-height:1.5;">
          Your feedback helps us serve you better and helps others discover amazing services.
        </p>
        ${this.ctaButton('Leave a Review', reviewUrl)}
      </div>

      <p style="font-size:14px;color:#5a7a80;text-align:center;line-height:1.6;">
        We look forward to seeing you again soon. Remember — self-care is not selfish, it's essential! 💆‍♀️
      </p>`;

    return {
      subject: `💖 Thank You for Visiting ${data.businessName}!`,
      html: this.wrapInLayout('Thank You', body, data.logoUrl),
    };
  }

  // ================================================================
  // RE-BOOK REMINDER (2 weeks after completion)
  // ================================================================
  rebookReminder(data: {
    clientName: string;
    serviceName: string;
    businessName: string;
    businessId: string;
    logoUrl?: string;
  }): { subject: string; html: string } {
    const bookUrl = `${this.frontendUrl}/book/${data.businessId}`;

    const body = `
      <div style="text-align:center;margin-bottom:24px;">
        <p style="font-size:48px;margin:0;">🌸</p>
        <h2 style="margin:8px 0;font-size:24px;color:${this.brandDark};">Time for a Little Self-Care?</h2>
      </div>

      <p style="font-size:15px;color:#3a5a60;line-height:1.8;">
        Hi <strong>${data.clientName}</strong>,
      </p>
      <p style="font-size:15px;color:#3a5a60;line-height:1.8;">
        It's been 2 weeks since your last <strong>${data.serviceName}</strong> session at <strong>${data.businessName}</strong>.
        Don't let your self-care routine slip! You deserve to feel pampered and refreshed. 💆‍♀️
      </p>

      <div style="margin:32px 0;padding:24px;background:linear-gradient(135deg,${this.brandLight} 0%,#d4eef1 100%);border-radius:16px;text-align:center;">
        <p style="font-size:18px;color:${this.brandDark};font-weight:600;margin:0 0 8px;">Ready to glow again?</p>
        <p style="font-size:14px;color:#3a5a60;margin:0 0 16px;">Book your next session and keep your beauty routine on track.</p>
        ${this.ctaButton('Book Now', bookUrl)}
      </div>

      <p style="font-size:14px;color:#5a7a80;text-align:center;line-height:1.6;font-style:italic;">
        "Self-care is not selfish. You cannot serve from an empty vessel." 🌟
      </p>`;

    return {
      subject: `🌸 ${data.clientName}, It's Time to Re-Book Your ${data.serviceName}!`,
      html: this.wrapInLayout('Re-Book Reminder', body, data.logoUrl),
    };
  }

  // ================================================================
  // MOBILE SPA REQUEST (to Business)
  // ================================================================
  mobileSpaRequestToBusiness(data: {
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    services: Array<{ serviceName: string; price: number; quantity?: number }>;
    numberOfPeople: number;
    location: { address: string; lat: number; lng: number };
    requestedDate: string;
    requestedTime?: string;
    totalAmount: number;
    requestId: string;
    logoUrl?: string;
  }): { subject: string; html: string } {
    const manageUrl = `${this.frontendUrl}/business/mobile-spa/${data.requestId}`;

    const body = `
      <div style="text-align:center;margin-bottom:24px;">
        <p style="font-size:48px;margin:0;">🚗💆</p>
        <h2 style="margin:8px 0;font-size:24px;color:${this.brandDark};">New Mobile SPA Request!</h2>
      </div>

      <p style="font-size:15px;color:#3a5a60;line-height:1.6;">
        You have a new mobile spa request from <strong>${data.clientName}</strong>.
      </p>

      <div style="padding:16px 20px;background:#f0f9ff;border-radius:12px;border-left:4px solid ${this.brandColor};margin:16px 0;">
        <p style="margin:0 0 8px;font-size:14px;color:${this.brandDark};"><strong>Client:</strong> ${data.clientName}</p>
        <p style="margin:0 0 8px;font-size:14px;color:${this.brandDark};"><strong>Email:</strong> ${data.clientEmail}</p>
        ${data.clientPhone ? `<p style="margin:0 0 8px;font-size:14px;color:${this.brandDark};"><strong>Phone:</strong> ${data.clientPhone}</p>` : ''}
        <p style="margin:0 0 8px;font-size:14px;color:${this.brandDark};"><strong>Number of People:</strong> ${data.numberOfPeople}</p>
        <p style="margin:0;font-size:14px;color:${this.brandDark};"><strong>Location:</strong> ${data.location.address}</p>
      </div>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="8" style="margin:16px 0;">
        <tr>
          ${this.infoBox('Date', data.requestedDate, '📅')}
          ${this.infoBox('Time', data.requestedTime || 'Flexible', '🕐')}
          ${this.infoBox('Total', `₦${data.totalAmount.toLocaleString()}`, '💰')}
        </tr>
      </table>

      ${this.serviceTable(data.services)}
      ${this.ctaButton('Manage Request', manageUrl)}`;

    return {
      subject: `🚗 New Mobile SPA Request from ${data.clientName}`,
      html: this.wrapInLayout('Mobile SPA Request', body, data.logoUrl),
    };
  }

  // ================================================================
  // MOBILE SPA ACCEPTED (to User, with payment link)
  // ================================================================
  mobileSpaAccepted(data: {
    clientName: string;
    businessName: string;
    services: Array<{ serviceName: string; price: number; quantity?: number }>;
    confirmedDate: string;
    confirmedTime: string;
    totalAmount: number;
    paymentLink: string;
    logoUrl?: string;
  }): { subject: string; html: string } {
    const body = `
      <div style="text-align:center;margin-bottom:24px;">
        <p style="font-size:48px;margin:0;">🎉</p>
        <h2 style="margin:8px 0;font-size:24px;color:${this.brandDark};">Your Mobile SPA Request is Accepted!</h2>
      </div>

      <p style="font-size:15px;color:#3a5a60;line-height:1.6;">
        Great news, <strong>${data.clientName}</strong>! <strong>${data.businessName}</strong> has accepted your mobile spa request.
        Please complete your payment to confirm the booking.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="8" style="margin:24px 0;">
        <tr>
          ${this.infoBox('Date', data.confirmedDate, '📅')}
          ${this.infoBox('Time', data.confirmedTime, '🕐')}
          ${this.infoBox('Total', `₦${data.totalAmount.toLocaleString()}`, '💰')}
        </tr>
      </table>

      ${this.serviceTable(data.services)}
      ${this.ctaButton('Complete Payment', data.paymentLink)}

      <p style="margin:24px 0 0;font-size:13px;color:#5a7a80;text-align:center;">
        Please complete your payment to secure your appointment.
      </p>`;

    return {
      subject: `🎉 Mobile SPA Accepted — Complete Your Payment | ${data.businessName}`,
      html: this.wrapInLayout('Mobile SPA Accepted', body, data.logoUrl),
    };
  }

  // ================================================================
  // MOBILE SPA TIME SUGGESTION (to User)
  // ================================================================
  mobileSpaTimeSuggestion(data: {
    clientName: string;
    businessName: string;
    originalDate: string;
    originalTime: string;
    suggestedDate: string;
    suggestedTime: string;
    businessNotes?: string;
    requestId: string;
    logoUrl?: string;
  }): { subject: string; html: string } {
    const respondUrl = `${this.frontendUrl}/mobile-spa/respond/${data.requestId}`;

    const body = `
      <p style="font-size:15px;color:#3a5a60;line-height:1.6;">
        Hi <strong>${data.clientName}</strong>,
      </p>
      <p style="font-size:15px;color:#3a5a60;line-height:1.6;">
        <strong>${data.businessName}</strong> has reviewed your mobile spa request and would like to suggest an alternative time.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
        <tr>
          <td style="width:48%;padding:16px;background:#fee2e2;border-radius:12px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;color:#991b1b;text-transform:uppercase;">Your Request</p>
            <p style="margin:0;font-size:14px;color:#7f1d1d;text-decoration:line-through;">${data.originalDate} at ${data.originalTime}</p>
          </td>
          <td style="width:4%;text-align:center;font-size:20px;">→</td>
          <td style="width:48%;padding:16px;background:#dcfce7;border-radius:12px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;color:#166534;text-transform:uppercase;">Suggested Time</p>
            <p style="margin:0;font-size:14px;color:#14532d;font-weight:600;">${data.suggestedDate} at ${data.suggestedTime}</p>
          </td>
        </tr>
      </table>

      ${data.businessNotes ? `
        <div style="padding:12px 16px;background:#fef3cd;border-radius:8px;border-left:4px solid #f59e0b;margin-bottom:16px;">
          <p style="margin:0 0 4px;font-size:12px;color:#92400e;text-transform:uppercase;">Message from Business</p>
          <p style="margin:0;font-size:14px;color:#78350f;">${data.businessNotes}</p>
        </div>` : ''}

      ${this.ctaButton('Respond to Suggestion', respondUrl)}`;

    return {
      subject: `📅 Alternative Time Suggested for Your Mobile SPA — ${data.businessName}`,
      html: this.wrapInLayout('Time Suggestion', body, data.logoUrl),
    };
  }

  // ================================================================
  // BUSINESS REMINDER — Complete Appointments
  // ================================================================
  businessCompleteReminder(data: {
    businessName: string;
    pendingAppointments: Array<{ clientName: string; serviceName: string; date: string; time: string; appointmentId: string }>;
    logoUrl?: string;
  }): { subject: string; html: string } {
    const rows = data.pendingAppointments.map(a => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #cce5e9;font-size:14px;color:#1a3a40;">${a.clientName}</td>
        <td style="padding:10px 0;border-bottom:1px solid #cce5e9;font-size:14px;color:#5a7a80;">${a.serviceName}</td>
        <td style="padding:10px 0;border-bottom:1px solid #cce5e9;font-size:14px;color:#5a7a80;">${a.date}</td>
      </tr>`).join('');

    const body = `
      <div style="text-align:center;margin-bottom:24px;">
        <p style="font-size:48px;margin:0;">📋</p>
        <h2 style="margin:8px 0;font-size:24px;color:${this.brandDark};">Appointments Pending Completion</h2>
      </div>

      <p style="font-size:15px;color:#3a5a60;line-height:1.6;">
        Hi <strong>${data.businessName}</strong>, you have <strong>${data.pendingAppointments.length}</strong> appointment(s) that haven't been marked as completed.
        Please review and mark them to ensure accurate sales reports and tax records.
      </p>

      <div style="padding:12px 16px;background:#fef3cd;border-radius:8px;border-left:4px solid #f59e0b;margin:16px 0;">
        <p style="margin:0;font-size:13px;color:#78350f;">⚠️ Unmarked appointments do NOT count as sales and will not appear in your reports or tax remittance.</p>
      </div>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
        <tr>
          <td style="padding:8px 0;border-bottom:2px solid ${this.brandColor};font-size:12px;color:#5a7a80;text-transform:uppercase;">Client</td>
          <td style="padding:8px 0;border-bottom:2px solid ${this.brandColor};font-size:12px;color:#5a7a80;text-transform:uppercase;">Service</td>
          <td style="padding:8px 0;border-bottom:2px solid ${this.brandColor};font-size:12px;color:#5a7a80;text-transform:uppercase;">Date</td>
        </tr>
        ${rows}
      </table>

      ${this.ctaButton('Go to Dashboard', `${this.frontendUrl}/business/appointments`)}`;

    return {
      subject: `📋 ${data.pendingAppointments.length} Appointment(s) Need Completion — Action Required`,
      html: this.wrapInLayout('Complete Appointments', body, data.logoUrl),
    };
  }

  // ================================================================
  // SERVICE COMPLETED — SALE RECORDED (to Business)
  // ================================================================
  saleRecorded(data: {
    businessName: string;
    clientName: string;
    serviceName: string;
    saleNumber: string;
    totalAmount: number;
    completedAt: string;
    logoUrl?: string;
  }): { subject: string; html: string } {
    const body = `
      <div style="text-align:center;margin-bottom:24px;">
        <p style="font-size:48px;margin:0;">💰</p>
        <h2 style="margin:8px 0;font-size:24px;color:${this.brandDark};">Sale Recorded!</h2>
      </div>

      <p style="font-size:15px;color:#3a5a60;line-height:1.6;">
        A new sale has been added to your daily report.
      </p>

      <div style="padding:20px;background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%);border-radius:12px;margin:16px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:14px;color:#166534;">Sale Number</td>
            <td style="font-size:14px;color:#15803d;font-weight:600;text-align:right;">${data.saleNumber}</td>
          </tr>
          <tr>
            <td style="padding-top:8px;font-size:14px;color:#166534;">Client</td>
            <td style="padding-top:8px;font-size:14px;color:#15803d;text-align:right;">${data.clientName}</td>
          </tr>
          <tr>
            <td style="padding-top:8px;font-size:14px;color:#166534;">Service</td>
            <td style="padding-top:8px;font-size:14px;color:#15803d;text-align:right;">${data.serviceName}</td>
          </tr>
          <tr>
            <td style="padding-top:8px;font-size:14px;color:#166534;">Completed</td>
            <td style="padding-top:8px;font-size:14px;color:#15803d;text-align:right;">${data.completedAt}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:12px;border-top:1px solid #bbf7d0;"></td>
          </tr>
          <tr>
            <td style="font-size:18px;color:#166534;font-weight:700;">Total Amount</td>
            <td style="font-size:18px;color:${this.brandColor};font-weight:700;text-align:right;">₦${data.totalAmount.toLocaleString()}</td>
          </tr>
        </table>
      </div>

      ${this.ctaButton('View Sales Report', `${this.frontendUrl}/business/reports`)}`;

    return {
      subject: `💰 Sale Recorded — ₦${data.totalAmount.toLocaleString()} | ${data.saleNumber}`,
      html: this.wrapInLayout('Sale Recorded', body, data.logoUrl),
    };
  }
}
