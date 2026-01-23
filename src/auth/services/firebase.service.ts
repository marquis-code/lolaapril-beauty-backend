// src/modules/auth/services/firebase.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as admin from 'firebase-admin'

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App

  constructor(private configService: ConfigService) {
    this.initializeFirebase()
  }

  private initializeFirebase() {
    try {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID')
      const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY')
      const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL')

      if (!projectId || !privateKey || !clientEmail) {
        throw new Error('Firebase credentials are missing in environment variables')
      }

      // Replace escaped newlines with actual newlines
      const formattedPrivateKey = privateKey.replace(/\\n/g, '\n')

      // Initialize Firebase Admin only once
      if (!admin.apps.length) {
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            privateKey: formattedPrivateKey,
            clientEmail,
          }),
        })
        console.log('✅ Firebase Admin initialized successfully')
      } else {
        this.firebaseApp = admin.app()
        console.log('✅ Firebase Admin already initialized')
      }
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Admin:', error.message)
      throw error
    }
  }

  /**
   * Verify Firebase ID token and return decoded token
   */
  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken)
      console.log('✅ Firebase token verified successfully')
      return decodedToken
    } catch (error) {
      console.error('❌ Firebase token verification failed:', error.message)
      throw new UnauthorizedException('Invalid or expired Firebase token')
    }
  }

  /**
   * Get user information from Firebase
   */
  async getUserByUid(uid: string): Promise<admin.auth.UserRecord> {
    try {
      const user = await admin.auth().getUser(uid)
      return user
    } catch (error) {
      console.error('❌ Failed to get Firebase user:', error.message)
      throw new UnauthorizedException('Firebase user not found')
    }
  }

  /**
   * Extract user info from decoded token
   */
  extractUserInfo(decodedToken: admin.auth.DecodedIdToken) {
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
    }
  }

  /**
   * Determine the OAuth provider from Firebase token
   */
  getAuthProvider(decodedToken: admin.auth.DecodedIdToken): string {
    const provider = decodedToken.firebase?.sign_in_provider

    if (provider === 'google.com') return 'google'
    if (provider === 'facebook.com') return 'facebook'
    if (provider === 'password') return 'local'

    return 'firebase'
  }

  /**
   * Extract provider-specific ID from Firebase token
   */
  getProviderId(decodedToken: admin.auth.DecodedIdToken, provider: string): string | undefined {
    const identities = decodedToken.firebase?.identities

    if (!identities) return undefined

    if (provider === 'google' && identities['google.com']) {
      return identities['google.com'][0]
    }

    if (provider === 'facebook' && identities['facebook.com']) {
      return identities['facebook.com'][0]
    }

    return undefined
  }
}
