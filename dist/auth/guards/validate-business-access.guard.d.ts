import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
import { BusinessDocument } from '../../business/schemas/business.schema';
export declare class ValidateBusinessAccessGuard implements CanActivate {
    private reflector;
    private userModel;
    private businessModel;
    constructor(reflector: Reflector, userModel: Model<UserDocument>, businessModel: Model<BusinessDocument>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
