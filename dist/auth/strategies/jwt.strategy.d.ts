import { Model } from "mongoose";
import { type UserDocument } from "../schemas/user.schema";
declare const JwtStrategy_base: new (...args: unknown[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    validate(payload: any): Promise<{
        userId: any;
        sub: any;
        email: any;
        role: any;
        businessId: any;
        subdomain: any;
    }>;
}
export {};
