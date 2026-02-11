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
    sourceIdentifier?: string;
    trackingCode?: string;
    referralCode?: string;
    campaignId?: string;
    affiliateId?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    channel?: string;
    referrer?: string;
    referrerUrl?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}
