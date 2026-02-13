import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SalesService } from '../sales.service';

@Injectable()
export class SalesEventListener {
    private readonly logger = new Logger(SalesEventListener.name);

    constructor(private readonly salesService: SalesService) { }

    @OnEvent('booking.completed')
    async handleBookingCompletedEvent(payload: { booking: any }) {
        this.logger.log(`🔔 Handling booking.completed event for booking ${payload.booking.bookingNumber}`);

        try {
            const sale = await this.salesService.createFromBooking(
                payload.booking,
                payload.booking.businessId.toString(),
            );
            this.logger.log(`✅ Sale created from event: ${sale.saleNumber} for booking ${payload.booking.bookingNumber}`);
        } catch (error) {
            this.logger.error(`❌ Failed to create sale from booking completion event: ${error.message}`);
        }
    }

    @OnEvent('booking.status.changed')
    async handleBookingStatusChangedEvent(payload: { booking: any, newStatus: string }) {
        if (payload.newStatus === 'completed') {
            this.logger.log(`🔔 Handling booking.status.changed (completed) event for booking ${payload.booking.bookingNumber}`);

            try {
                const sale = await this.salesService.createFromBooking(
                    payload.booking,
                    payload.booking.businessId.toString(),
                );
                this.logger.log(`✅ Sale created from event: ${sale.saleNumber} for booking ${payload.booking.bookingNumber}`);
            } catch (error) {
                this.logger.error(`❌ Failed to create sale from booking status change event: ${error.message}`);
            }
        }
    }
}
