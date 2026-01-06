import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { RealtimeGateway } from '../gateways/realtime.gateway'

@Injectable()
export class NotificationEventListener {
  private readonly logger = new Logger(NotificationEventListener.name)

  constructor(private realtimeGateway: RealtimeGateway) {}

  /**
   * Listen for audit log creation and emit as notification
   */
  @OnEvent('audit.created')
  handleAuditCreated(payload: { businessId: string; auditLog: any }) {
    this.logger.log(`📢 Audit event received for business ${payload.businessId}`)
    
    // Emit audit notification to business via WebSocket
    this.realtimeGateway.emitAuditNotification(payload.businessId, payload.auditLog)
  }

  /**
   * Listen for booking events
   */
  @OnEvent('booking.created')
  handleBookingCreated(payload: { businessId: string; booking: any }) {
    this.logger.log(`📅 New booking created for business ${payload.businessId}`)
    
    const notification = {
      type: 'booking',
      subType: 'created',
      title: 'New Booking',
      message: `New booking from ${payload.booking.clientName}`,
      data: payload.booking,
      timestamp: new Date(),
    }

    this.realtimeGateway.emitNotificationToBusiness(payload.businessId, notification)
  }

  /**
   * Listen for booking status changes
   */
  @OnEvent('booking.status-changed')
  handleBookingStatusChanged(payload: { businessId: string; booking: any; oldStatus: string; newStatus: string }) {
    this.logger.log(`📝 Booking status changed for business ${payload.businessId}`)
    
    const notification = {
      type: 'booking',
      subType: 'status-changed',
      title: 'Booking Status Updated',
      message: `Booking ${payload.booking.id} changed from ${payload.oldStatus} to ${payload.newStatus}`,
      data: payload.booking,
      timestamp: new Date(),
    }

    this.realtimeGateway.emitNotificationToBusiness(payload.businessId, notification)
  }

  /**
   * Listen for payment events
   */
  @OnEvent('payment.received')
  handlePaymentReceived(payload: { businessId: string; payment: any }) {
    this.logger.log(`💰 Payment received for business ${payload.businessId}`)
    
    const notification = {
      type: 'payment',
      subType: 'received',
      title: 'Payment Received',
      message: `Payment of ${payload.payment.amount} received`,
      data: payload.payment,
      timestamp: new Date(),
    }

    this.realtimeGateway.emitNotificationToBusiness(payload.businessId, notification)
  }

  /**
   * Listen for client events
   */
  @OnEvent('client.created')
  handleClientCreated(payload: { businessId: string; client: any }) {
    this.logger.log(`👤 New client created for business ${payload.businessId}`)
    
    const notification = {
      type: 'client',
      subType: 'created',
      title: 'New Client',
      message: `New client: ${payload.client.profile.firstName} ${payload.client.profile.lastName}`,
      data: payload.client,
      timestamp: new Date(),
    }

    this.realtimeGateway.emitNotificationToBusiness(payload.businessId, notification)
  }

  /**
   * Listen for appointment reminders
   */
  @OnEvent('appointment.reminder')
  handleAppointmentReminder(payload: { businessId: string; appointment: any }) {
    this.logger.log(`⏰ Appointment reminder for business ${payload.businessId}`)
    
    const notification = {
      type: 'appointment',
      subType: 'reminder',
      title: 'Upcoming Appointment',
      message: `Appointment with ${payload.appointment.clientName} in 1 hour`,
      data: payload.appointment,
      timestamp: new Date(),
    }

    this.realtimeGateway.emitNotificationToBusiness(payload.businessId, notification)
  }

  /**
   * Listen for staff availability changes
   */
  @OnEvent('staff.availability-changed')
  handleStaffAvailabilityChanged(payload: { businessId: string; staff: any; isAvailable: boolean }) {
    this.logger.log(`👨‍💼 Staff availability changed for business ${payload.businessId}`)
    
    const notification = {
      type: 'staff',
      subType: 'availability-changed',
      title: 'Staff Availability Update',
      message: `${payload.staff.name} is now ${payload.isAvailable ? 'available' : 'unavailable'}`,
      data: payload.staff,
      timestamp: new Date(),
    }

    this.realtimeGateway.emitNotificationToBusiness(payload.businessId, notification)
  }

  /**
   * Listen for low stock alerts
   */
  @OnEvent('inventory.low-stock')
  handleLowStockAlert(payload: { businessId: string; product: any }) {
    this.logger.log(`📦 Low stock alert for business ${payload.businessId}`)
    
    const notification = {
      type: 'inventory',
      subType: 'low-stock',
      title: 'Low Stock Alert',
      message: `${payload.product.name} is running low`,
      data: payload.product,
      priority: 'high',
      timestamp: new Date(),
    }

    this.realtimeGateway.emitNotificationToBusiness(payload.businessId, notification)
  }

  /**
   * Listen for system alerts
   */
  @OnEvent('system.alert')
  handleSystemAlert(payload: { businessId: string; alert: any }) {
    this.logger.log(`⚠️ System alert for business ${payload.businessId}`)
    
    const notification = {
      type: 'system',
      subType: 'alert',
      title: payload.alert.title || 'System Alert',
      message: payload.alert.message,
      data: payload.alert,
      priority: payload.alert.priority || 'medium',
      timestamp: new Date(),
    }

    this.realtimeGateway.emitNotificationToBusiness(payload.businessId, notification)
  }
}
