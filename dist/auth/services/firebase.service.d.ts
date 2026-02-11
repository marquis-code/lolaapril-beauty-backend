import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
export declare class FirebaseService {
    private configService;
    private firebaseApp;
    constructor(configService: ConfigService);
    private initializeFirebase;
    verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken>;
    getUserByUid(uid: string): Promise<admin.auth.UserRecord>;
    extractUserInfo(decodedToken: admin.auth.DecodedIdToken): {
        uid: string;
        email: string;
        emailVerified: boolean;
        name: any;
        picture: string;
        firebase: {
            sign_in_provider: string;
            identities: {
                [key: string]: any;
            };
        };
    };
    getAuthProvider(decodedToken: admin.auth.DecodedIdToken): string;
    getProviderId(decodedToken: admin.auth.DecodedIdToken, provider: string): string | undefined;
}
