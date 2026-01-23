# Firebase Authentication Integration Guide

## Overview

Your backend now supports Firebase Authentication for social sign-in (Google, Facebook, etc.). This provides a modern, secure authentication flow where Firebase handles the OAuth complexity on the client side.

## 🔥 How It Works

### **Frontend Flow:**
1. User clicks "Sign in with Google/Facebook"
2. Firebase SDK handles the OAuth flow
3. Firebase returns an ID token to your frontend
4. Frontend sends the ID token to your backend
5. Backend verifies the token and creates/updates user
6. Backend returns JWT tokens for subsequent requests

### **Backend Flow:**
1. Receives Firebase ID token from frontend
2. Verifies token using Firebase Admin SDK
3. Extracts user information from decoded token
4. Creates new user or updates existing user
5. Returns JWT access & refresh tokens
6. Client uses JWT tokens for all subsequent API calls

## 📡 API Endpoint

### **POST `/auth/firebase`**

Authenticate with Firebase ID token (supports Google, Facebook, and other Firebase providers)

**Request Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ...",
  "subdomain": "my-salon" // Optional: for business context
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Firebase authentication successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "client",
    "status": "active",
    "profileImage": "https://...",
    "emailVerified": true,
    "authProvider": "google",
    "googleId": "1234567890",
    "preferences": {
      "language": "en",
      "timezone": "Africa/Lagos",
      "currency": "NGN"
    }
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "business": {
    "id": "507f1f77bcf86cd799439012",
    "businessName": "My Salon",
    "subdomain": "my-salon",
    "status": "active"
  },
  "businesses": [
    {
      "id": "507f1f77bcf86cd799439012",
      "businessName": "My Salon",
      "subdomain": "my-salon",
      "status": "active"
    }
  ]
}
```

**Error Response (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid or expired Firebase token"
}
```

## 🎯 Frontend Integration Example

### **Nuxt 3 / Vue 3**

```typescript
// composables/useFirebaseAuth.ts
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'

export const useFirebaseAuth = () => {
  const { $firebaseAuth } = useNuxtApp()
  
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup($firebaseAuth, provider)
      
      // Get Firebase ID token
      const idToken = await result.user.getIdToken()
      
      // Send to backend
      const response = await $fetch('/auth/firebase', {
        method: 'POST',
        body: {
          idToken,
          subdomain: 'my-salon' // Optional
        }
      })
      
      // Store JWT tokens
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      return response
    } catch (error) {
      console.error('Google sign-in failed:', error)
      throw error
    }
  }
  
  const signInWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider()
      const result = await signInWithPopup($firebaseAuth, provider)
      
      const idToken = await result.user.getIdToken()
      
      const response = await $fetch('/auth/firebase', {
        method: 'POST',
        body: { idToken }
      })
      
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      return response
    } catch (error) {
      console.error('Facebook sign-in failed:', error)
      throw error
    }
  }
  
  return {
    signInWithGoogle,
    signInWithFacebook
  }
}
```

### **Usage in Component**

```vue
<template>
  <div>
    <button @click="handleGoogleSignIn">
      Sign in with Google
    </button>
    <button @click="handleFacebookSignIn">
      Sign in with Facebook
    </button>
  </div>
</template>

<script setup>
const { signInWithGoogle, signInWithFacebook } = useFirebaseAuth()
const router = useRouter()

const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithGoogle()
    console.log('✅ Signed in:', result.user)
    router.push('/dashboard')
  } catch (error) {
    console.error('❌ Sign-in failed:', error)
  }
}

const handleFacebookSignIn = async () => {
  try {
    const result = await signInWithFacebook()
    console.log('✅ Signed in:', result.user)
    router.push('/dashboard')
  } catch (error) {
    console.error('❌ Sign-in failed:', error)
  }
}
</script>
```

## 🔐 Security Features

### **Token Verification**
- Firebase ID tokens are cryptographically signed by Google
- Backend verifies token signature using Firebase Admin SDK
- Expired tokens are automatically rejected

### **User Mapping**
- Users are mapped by email address
- Provider-specific IDs (googleId, facebookId) are stored
- Email verification status is tracked

### **JWT Tokens**
- Backend returns its own JWT tokens after verification
- Access token expires in 15 minutes
- Refresh token for long-term sessions
- Use JWT tokens for all subsequent API calls

## 🔄 Migration from Old Google OAuth

### **Old Flow (Passport.js):**
```
Frontend → Redirect to /auth/google → Google OAuth → Callback → Redirect to frontend
```

### **New Flow (Firebase):**
```
Frontend → Firebase SDK → Get ID Token → POST /auth/firebase → Get JWT tokens
```

### **Benefits:**
✅ No server-side redirects  
✅ Better UX (no page reload)  
✅ Supports multiple providers (Google, Facebook, Apple, etc.)  
✅ Mobile-friendly (works with React Native, Flutter)  
✅ Token-based authentication (stateless)  
✅ Firebase handles OAuth complexity  

### **Legacy Endpoints (Still Available):**
- `GET /auth/google` - Old OAuth flow (kept for backward compatibility)
- `GET /auth/google/callback` - Old callback handler
- `POST /auth/google/token` - Google ID token verification (deprecated, use `/auth/firebase`)

## 📝 Environment Variables

Make sure your `.env` has these Firebase credentials:

```env
FIREBASE_PROJECT_ID=lolaapril-wellness
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

## 🚀 Testing

### **Test with cURL:**

```bash
# 1. Get Firebase ID token from your frontend
# 2. Send to backend
curl -X POST http://localhost:3000/auth/firebase \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "YOUR_FIREBASE_ID_TOKEN"
  }'
```

### **Test with Postman:**

1. **URL:** `POST http://localhost:3000/auth/firebase`
2. **Headers:** `Content-Type: application/json`
3. **Body (raw JSON):**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ..."
}
```

## 📊 User Flow Diagram

```
┌─────────────┐
│   Frontend  │
│  (Firebase) │
└──────┬──────┘
       │
       │ 1. User clicks "Sign in with Google"
       │
       ▼
┌─────────────────┐
│  Firebase Auth  │
│  (Google OAuth) │
└──────┬──────────┘
       │
       │ 2. Returns Firebase ID Token
       │
       ▼
┌─────────────┐
│   Frontend  │
│ POST /auth/ │
│   firebase  │
└──────┬──────┘
       │
       │ 3. Send ID Token
       │
       ▼
┌─────────────────┐
│     Backend     │
│  Verify Token   │
│  Create/Update  │
│      User       │
└──────┬──────────┘
       │
       │ 4. Return JWT Tokens
       │
       ▼
┌─────────────┐
│   Frontend  │
│ Store Tokens│
│  Navigate   │
└─────────────┘
```

## 🎓 Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Verify ID Tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens)

## 🐛 Troubleshooting

### **"Invalid or expired Firebase token"**
- Check that the ID token is valid and not expired
- ID tokens expire after 1 hour - get a fresh one from Firebase

### **"Firebase credentials are missing"**
- Verify `.env` file has all Firebase variables
- Check that `FIREBASE_PRIVATE_KEY` has proper escaping (`\n` for newlines)

### **User email not provided**
- Make sure Firebase is requesting email scope
- Check Google OAuth consent screen settings

## ✅ What's Next?

1. Update your frontend to use Firebase authentication
2. Remove old Passport.js Google OAuth code (optional)
3. Add Facebook, Apple, or other providers
4. Implement token refresh logic
5. Add logout functionality

---

**Note:** The old Google OAuth endpoints are still available for backward compatibility, but we recommend migrating to Firebase for a better user experience.
