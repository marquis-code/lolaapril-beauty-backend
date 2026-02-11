export interface BusinessContext {
    businessId: string;
    subdomain: string;
    userId: string;
    userEmail: string;
    userRole: string;
}
export declare const BusinessContext: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare const BusinessId: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare const OptionalBusinessId: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare const OptionalBusinessContext: (...dataOrPipes: unknown[]) => ParameterDecorator;
