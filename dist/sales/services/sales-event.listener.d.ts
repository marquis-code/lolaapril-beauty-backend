import { SalesService } from '../sales.service';
export declare class SalesEventListener {
    private readonly salesService;
    private readonly logger;
    constructor(salesService: SalesService);
    handleBookingCompletedEvent(payload: {
        booking: any;
    }): Promise<void>;
    handleBookingStatusChangedEvent(payload: {
        booking: any;
        newStatus: string;
    }): Promise<void>;
}
