export declare class CreateClientMembershipDto {
    clientId: string;
    membershipId: string;
    membershipNumber: string;
    joinDate: Date;
    expiryDate?: Date;
    totalPoints?: number;
    totalSpent?: number;
    currentTier?: string;
    tierProgress?: number;
    status?: string;
}
