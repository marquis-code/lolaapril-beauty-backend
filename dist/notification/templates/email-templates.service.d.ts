export declare class EmailTemplatesService {
    private readonly brandColor;
    private readonly brandDark;
    private readonly brandLight;
    private readonly frontendUrl;
    private wrapInLayout;
    private ctaButton;
    private serviceTable;
    private infoBox;
    bookingConfirmation(data: {
        clientName: string;
        bookingNumber: string;
        services: Array<{
            serviceName: string;
            price: number;
            quantity?: number;
            duration?: number;
        }>;
        preferredDate: string;
        preferredStartTime: string;
        estimatedEndTime: string;
        totalAmount: number;
        businessName: string;
        businessPhone?: string;
        specialRequests?: string;
    }): {
        subject: string;
        html: string;
    };
    bookingReminder(data: {
        clientName: string;
        bookingNumber: string;
        services: Array<{
            serviceName: string;
            price: number;
            quantity?: number;
        }>;
        preferredDate: string;
        preferredStartTime: string;
        businessName: string;
        businessAddress?: string;
        reminderTier: string;
    }): {
        subject: string;
        html: string;
    };
    thankYouAndReview(data: {
        clientName: string;
        serviceName: string;
        businessName: string;
        appointmentId: string;
        businessId: string;
    }): {
        subject: string;
        html: string;
    };
    rebookReminder(data: {
        clientName: string;
        serviceName: string;
        businessName: string;
        businessId: string;
    }): {
        subject: string;
        html: string;
    };
    mobileSpaRequestToBusiness(data: {
        clientName: string;
        clientEmail: string;
        clientPhone?: string;
        services: Array<{
            serviceName: string;
            price: number;
            quantity?: number;
        }>;
        numberOfPeople: number;
        location: {
            address: string;
            lat: number;
            lng: number;
        };
        requestedDate: string;
        requestedTime?: string;
        totalAmount: number;
        requestId: string;
    }): {
        subject: string;
        html: string;
    };
    mobileSpaAccepted(data: {
        clientName: string;
        businessName: string;
        services: Array<{
            serviceName: string;
            price: number;
            quantity?: number;
        }>;
        confirmedDate: string;
        confirmedTime: string;
        totalAmount: number;
        paymentLink: string;
    }): {
        subject: string;
        html: string;
    };
    mobileSpaTimeSuggestion(data: {
        clientName: string;
        businessName: string;
        originalDate: string;
        originalTime: string;
        suggestedDate: string;
        suggestedTime: string;
        businessNotes?: string;
        requestId: string;
    }): {
        subject: string;
        html: string;
    };
    businessCompleteReminder(data: {
        businessName: string;
        pendingAppointments: Array<{
            clientName: string;
            serviceName: string;
            date: string;
            time: string;
            appointmentId: string;
        }>;
    }): {
        subject: string;
        html: string;
    };
    saleRecorded(data: {
        businessName: string;
        clientName: string;
        serviceName: string;
        saleNumber: string;
        totalAmount: number;
        completedAt: string;
    }): {
        subject: string;
        html: string;
    };
}
