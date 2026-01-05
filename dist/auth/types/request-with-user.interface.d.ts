import { Request } from "express";
import { UserRole } from "../schemas/user.schema";
export interface JwtPayload {
    sub: string;
    userId: string;
    email: string;
    role: UserRole;
    businessId?: string;
    subdomain?: string;
    iat?: number;
    exp?: number;
}
export interface RequestWithUser extends Request {
    user: JwtPayload;
}
export declare function hasBusinessContext(user: JwtPayload): user is Required<Pick<JwtPayload, 'sub' | 'email' | 'role' | 'businessId' | 'subdomain'>> & JwtPayload;
