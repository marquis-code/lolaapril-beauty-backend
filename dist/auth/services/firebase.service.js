"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin = require("firebase-admin");
let FirebaseService = class FirebaseService {
    constructor(configService) {
        this.configService = configService;
        this.initializeFirebase();
    }
    initializeFirebase() {
        try {
            const projectId = this.configService.get('FIREBASE_PROJECT_ID');
            const privateKey = this.configService.get('FIREBASE_PRIVATE_KEY');
            const clientEmail = this.configService.get('FIREBASE_CLIENT_EMAIL');
            if (!projectId || !privateKey || !clientEmail) {
                throw new Error('Firebase credentials are missing in environment variables');
            }
            const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
            if (!admin.apps.length) {
                this.firebaseApp = admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId,
                        privateKey: formattedPrivateKey,
                        clientEmail,
                    }),
                });
                console.log('✅ Firebase Admin initialized successfully');
            }
            else {
                this.firebaseApp = admin.app();
                console.log('✅ Firebase Admin already initialized');
            }
        }
        catch (error) {
            console.error('❌ Failed to initialize Firebase Admin:', error.message);
            throw error;
        }
    }
    async verifyIdToken(idToken) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            console.log('✅ Firebase token verified successfully');
            return decodedToken;
        }
        catch (error) {
            console.error('❌ Firebase token verification failed:', error.message);
            throw new common_1.UnauthorizedException('Invalid or expired Firebase token');
        }
    }
    async getUserByUid(uid) {
        try {
            const user = await admin.auth().getUser(uid);
            return user;
        }
        catch (error) {
            console.error('❌ Failed to get Firebase user:', error.message);
            throw new common_1.UnauthorizedException('Firebase user not found');
        }
    }
    extractUserInfo(decodedToken) {
        return {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified,
            name: decodedToken.name,
            picture: decodedToken.picture,
            firebase: {
                sign_in_provider: decodedToken.firebase.sign_in_provider,
                identities: decodedToken.firebase.identities,
            },
        };
    }
    getAuthProvider(decodedToken) {
        const provider = decodedToken.firebase?.sign_in_provider;
        if (provider === 'google.com')
            return 'google';
        if (provider === 'facebook.com')
            return 'facebook';
        if (provider === 'password')
            return 'local';
        return 'firebase';
    }
    getProviderId(decodedToken, provider) {
        const identities = decodedToken.firebase?.identities;
        if (!identities)
            return undefined;
        if (provider === 'google' && identities['google.com']) {
            return identities['google.com'][0];
        }
        if (provider === 'facebook' && identities['facebook.com']) {
            return identities['facebook.com'][0];
        }
        return undefined;
    }
};
FirebaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FirebaseService);
exports.FirebaseService = FirebaseService;
//# sourceMappingURL=firebase.service.js.map