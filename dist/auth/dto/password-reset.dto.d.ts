export declare class ForgotPasswordDto {
    email: string;
}
export declare class VerifyResetOTPDto {
    email: string;
    otp: string;
}
export declare class ResetPasswordDto {
    email: string;
    otp: string;
    newPassword: string;
}
