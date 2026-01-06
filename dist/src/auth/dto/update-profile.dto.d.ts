export declare class UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    profileImage?: string;
    bio?: string;
    dateOfBirth?: string;
    gender?: string;
}
export declare class NotificationPreferencesDto {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
}
export declare class UserPreferencesDto {
    language?: string;
    timezone?: string;
    currency?: string;
    notifications?: NotificationPreferencesDto;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export declare class UpdateEmailDto {
    newEmail: string;
    password: string;
}
