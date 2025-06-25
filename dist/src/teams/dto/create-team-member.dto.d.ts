declare class ProfileDto {
    type: string;
    url: string;
}
declare class PublicationDto {
    title: string;
    authors: string;
    year: number;
    journal: string;
    doi?: string;
    pubLink?: string;
    doiLink?: string;
}
export declare class CreateTeamMemberDto {
    image?: string;
    name: string;
    initials: string;
    title: string;
    position: number;
    profiles: ProfileDto[];
    bio: string;
    methods?: string[];
    publications?: PublicationDto[];
}
export {};
