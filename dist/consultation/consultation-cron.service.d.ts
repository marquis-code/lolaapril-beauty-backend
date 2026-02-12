import { ConsultationService } from './consultation.service';
export declare class ConsultationCronService {
    private readonly consultationService;
    private readonly logger;
    constructor(consultationService: ConsultationService);
    handleReminders(): Promise<void>;
    handleThankYouEmails(): Promise<void>;
    handleExpiredBookings(): Promise<void>;
}
