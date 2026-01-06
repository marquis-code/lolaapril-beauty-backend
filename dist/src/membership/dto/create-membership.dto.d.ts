export declare class MembershipBenefitDto {
    benefitType: string;
    description: string;
    discountPercentage?: number;
    freeServiceId?: string;
    freeServiceName?: string;
}
export declare class MembershipTierDto {
    tierName: string;
    tierLevel: number;
    minimumSpend: number;
    pointsMultiplier: number;
    benefits: MembershipBenefitDto[];
    tierColor: string;
}
export declare class CreateMembershipDto {
    membershipName: string;
    description: string;
    membershipType: string;
    tiers?: MembershipTierDto[];
    pointsPerDollar?: number;
    pointsRedemptionValue?: number;
    subscriptionPrice?: number;
    subscriptionDuration?: number;
    generalBenefits?: MembershipBenefitDto[];
    isActive?: boolean;
    createdBy: string;
}
