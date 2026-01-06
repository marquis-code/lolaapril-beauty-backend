import { CreateBookingDto } from './create-booking.dto';
export declare enum BookingSourceType {
    MARKETPLACE = "marketplace",
    DIRECT_LINK = "direct_link",
    QR_CODE = "qr_code",
    BUSINESS_WEBSITE = "business_website",
    GOOGLE_SEARCH = "google_search",
    SOCIAL_MEDIA = "social_media",
    REFERRAL = "referral",
    WALK_IN = "walk_in",
    PHONE = "phone"
}
export declare class BookingSourceDto {
    sourceType: BookingSourceType;
    channel?: string;
    referrer?: string;
    referrerUrl?: string;
    trackingCode?: string;
    campaignId?: string;
    affiliateId?: string;
    sourceIdentifier?: string;
    referralCode?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}
export declare class CreateBookingWithSourceDto extends CreateBookingDto {
    bookingSource: BookingSourceDto;
    sourceType?: BookingSourceType;
    sourceIdentifier?: string;
    referralCode?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
}
