# 🔓 Anonymous Chat Support - Implementation Guide

## Overview
Users can now chat with businesses **WITHOUT logging in**. The system automatically generates guest sessions and tracks conversations.

## Key Changes

### 1. **WebSocket Connection** - No Authentication Required

**Before:** Required JWT token  
**After:** Optional JWT token, supports anonymous guests

```typescript
// Anonymous user connection
const socket = io('http://localhost:3000/realtime', {
  // No token needed!
  auth: {
    sessionId: localStorage.getItem('guestSessionId') // Optional: for returning guests
  }
})

// Listen for guest registration
socket.on('guest:registered', ({ guestId, sessionId }) => {
  // Save for future connections
  localStorage.setItem('guestSessionId', sessionId)
  localStorage.setItem('guestId', guestId)
})
```

### 2. **Guest ID Generation**
- Format: `guest_${timestamp}_${random}`
- Example: `guest_1735344000000_k3j4h5g2`
- Automatically assigned on connection
- Sent back to client via `guest:registered` event

### 3. **Session Persistence**
Anonymous users can reconnect to their conversation using:
- **sessionId**: Stored in localStorage
- **guestId**: Unique identifier for this guest
- **userAgent**: Browser fingerprint

### 4. **Updated Schemas**

#### ChatRoom Metadata
```typescript
metadata: {
  userType: 'customer' | 'staff' | 'guest',  // Added 'guest'
  userId?: string,  // Now optional for guests
  userName: string,
  isGuest: boolean,  // New flag
  guestInfo?: {
    guestId: string,
    sessionId: string,
    userAgent: string,
    email?: string,  // Can collect during chat
    phone?: string,  // Can collect during chat
  }
}
```

#### ChatMessage
```typescript
{
  senderId: string,  // userId or guestId
  senderType: 'customer' | 'staff' | 'system' | 'guest',  // Added 'guest'
  senderName: string,
  isGuest: boolean,  // New flag
}
```

---

## Implementation Steps

### Step 1: Update Gateway (Already Done in Code)

The `realtime.gateway.ts` now:
- ✅ Makes JWT authentication optional
- ✅ Generates guest IDs automatically
- ✅ Emits `guest:registered` event
- ✅ Tracks guest sessions

### Step 2: Update Chat Service (Already Done in Code)

The `chat.service.ts` now:
- ✅ Accepts `isGuest` parameter
- ✅ Creates rooms for anonymous users
- ✅ Searches by sessionId for returning guests
- ✅ Tags guest conversations as `['anonymous']`

### Step 3: Frontend Integration

#### Simple Anonymous Chat Widget

```typescript
import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'

function AnonymousChatWidget({ businessId }: { businessId: string }) {
  const [socket, setSocket] = useState(null)
  const [guestId, setGuestId] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    // Connect WITHOUT token
    const newSocket = io('http://localhost:3000/realtime', {
      auth: {
        sessionId: localStorage.getItem('guestSessionId')
      }
    })

    // Handle guest registration
    newSocket.on('guest:registered', ({ guestId, sessionId }) => {
      console.log('Registered as guest:', guestId)
      setGuestId(guestId)
      localStorage.setItem('guestSessionId', sessionId)
      localStorage.setItem('guestId', guestId)

      // Join chat room
      newSocket.emit('chat:join-room', {
        businessId,
        userName: 'Guest User',
        email: null // Can be collected later
      })
    })

    // Handle incoming messages
    newSocket.on('chat:new-message', (message) => {
      setMessages(prev => [...prev, message])
    })

    // Handle FAQ auto-responses
    newSocket.on('chat:faq-response', (response) => {
      setMessages(prev => [...prev, {
        ...response,
        senderType: 'system'
      }])
    })

    setSocket(newSocket)

    return () => newSocket.close()
  }, [businessId])

  const sendMessage = () => {
    if (!socket || !inputValue.trim()) return

    socket.emit('chat:send-message', {
      roomId: socket.roomId, // Set when joining room
      content: inputValue
    })

    setInputValue('')
  }

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <h3>Chat with us</h3>
        {guestId && <span className="guest-badge">Guest</span>}
      </div>
      
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.senderType}`}>
            <strong>{msg.senderName}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default AnonymousChatWidget
```

---

## Business Dashboard Updates

### Viewing Anonymous Chats

```typescript
// Business can see which chats are from guests
function ChatList({ chats }) {
  return (
    <div>
      {chats.map(chat => (
        <div key={chat._id} className="chat-item">
          <div className="chat-info">
            <span>{chat.metadata.userName}</span>
            {chat.metadata.isGuest && (
              <span className="guest-badge">Anonymous</span>
            )}
          </div>
          <div className="chat-preview">
            {chat.lastMessage}
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Converting Guest to Customer

```typescript
// When guest provides email/phone, business can convert them
async function convertGuestToCustomer(roomId: string, email: string, phone?: string) {
  await fetch(`/api/chat/rooms/${roomId}/convert-guest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, phone })
  })
}
```

---

## API Endpoint Updates

### Get Business Chat Rooms (Including Anonymous)

```typescript
GET /api/chat/rooms?businessId={businessId}

// Response includes both authenticated and anonymous chats
{
  "rooms": [
    {
      "_id": "...",
      "roomName": "Chat with Guest User",
      "metadata": {
        "userType": "guest",
        "userName": "Guest User",
        "isGuest": true,
        "guestInfo": {
          "guestId": "guest_1735344000000_k3j4h5g2",
          "sessionId": "abc123"
        }
      },
      "lastMessageAt": "2026-01-05T10:30:00Z"
    }
  ]
}
```

---

## Key Benefits

### ✅ For Users
- 🚀 **Instant Access**: Start chatting immediately, no signup required
- 🔄 **Session Recovery**: Come back later using saved sessionId
- 📧 **Optional Info**: Provide email/phone only if they want
- 💬 **Full Features**: FAQ automation, auto-responses, etc.

### ✅ For Businesses
- 📈 **Lower Barriers**: More users will initiate conversations
- 🎯 **Lead Generation**: Collect contact info during chat
- 📊 **Better Analytics**: Track anonymous → customer conversion
- 🤖 **Same Automation**: FAQs and auto-responses work for guests

---

## Security Considerations

### ✅ Safe Practices
- Guest IDs are temporary and session-based
- No sensitive data stored without consent
- Rate limiting applies to anonymous users
- Sessions expire after inactivity (configurable)

### ⚠️ Spam Prevention
```typescript
// Add rate limiting for anonymous users
@UseGuards(ThrottlerGuard)
@Throttle(5, 60) // 5 messages per minute for guests
```

---

## Testing Anonymous Chat

### 1. Test WebSocket Connection
```bash
# No token needed!
wscat -c ws://localhost:3000/realtime

# Wait for guest:registered event
# You'll receive: { "guestId": "guest_...", "sessionId": "..." }
```

### 2. Test Chat Flow
```javascript
// 1. Connect
socket.on('connect', () => console.log('Connected'))

// 2. Register as guest
socket.on('guest:registered', (data) => {
  console.log('Guest ID:', data.guestId)
  
  // 3. Join room
  socket.emit('chat:join-room', {
    businessId: 'your-business-id',
    userName: 'Anonymous User'
  })
})

// 4. Send message
socket.emit('chat:send-message', {
  roomId: 'room-id-from-join',
  content: 'Hello, I have a question'
})
```

### 3. Test Session Recovery
```javascript
// Store sessionId
localStorage.setItem('guestSessionId', sessionId)

// Later, reconnect with same sessionId
const socket = io('http://localhost:3000/realtime', {
  auth: {
    sessionId: localStorage.getItem('guestSessionId')
  }
})

// System will find previous chat room
```

---

## Database Queries

### Find Anonymous Chats
```typescript
// All active anonymous chats
db.chatrooms.find({
  'metadata.isGuest': true,
  isActive: true
})

// Anonymous chats by sessionId
db.chatrooms.find({
  'metadata.guestInfo.sessionId': 'specific-session-id'
})
```

### Analytics
```typescript
// Conversion rate: guests who provided email
db.chatrooms.aggregate([
  { $match: { 'metadata.isGuest': true } },
  {
    $group: {
      _id: null,
      total: { $sum: 1 },
      withEmail: {
        $sum: { $cond: ['$metadata.guestInfo.email', 1, 0] }
      }
    }
  }
])
```

---

## Migration Notes

### Existing Chats
- ✅ All existing authenticated chats continue to work
- ✅ No database migration needed
- ✅ Backward compatible with current implementation

### New Fields (Optional)
```typescript
// Add to existing ChatRoom documents
{
  'metadata.isGuest': false,  // Default for existing chats
}
```

---

## Environment Variables

```env
# Optional: Guest session configuration
GUEST_SESSION_TIMEOUT=7200000  # 2 hours in milliseconds
GUEST_MESSAGE_RATE_LIMIT=10    # Messages per minute
GUEST_MAX_ROOMS_PER_SESSION=5  # Prevent abuse
```

---

## Complete Flow Diagram

```
┌─────────────┐
│   User      │
│ (No Login)  │
└──────┬──────┘
       │
       │ 1. Connect to WebSocket (no token)
       ▼
┌─────────────────┐
│  WebSocket      │
│   Gateway       │
└────────┬────────┘
         │
         │ 2. Generate guestId
         │ 3. Emit guest:registered
         ▼
┌─────────────────┐
│   Frontend      │
│ Save sessionId  │
└────────┬────────┘
         │
         │ 4. Join chat room
         ▼
┌─────────────────┐
│  Chat Service   │
│ Create/Get Room │
└────────┬────────┘
         │
         │ 5. Room created with guest metadata
         ▼
┌─────────────────┐
│    Database     │
│  Guest Room     │
└─────────────────┘
         │
         │ 6. Send message
         ▼
┌─────────────────┐
│   FAQ System    │
│  Auto-Response  │
└────────┬────────┘
         │
         │ 7. Business receives notification
         ▼
┌─────────────────┐
│   Business      │
│   Dashboard     │
└─────────────────┘
```

---

## 🎉 Summary

### What Changed
- ✅ JWT authentication is now **optional**
- ✅ Anonymous users get automatic **guest IDs**
- ✅ **Session persistence** via sessionId
- ✅ Guest conversations marked with `isGuest: true`
- ✅ Full chat features available to anonymous users
- ✅ Businesses can see which chats are anonymous

### What Stayed the Same
- ✅ All existing features work identically
- ✅ FAQ automation works for guests
- ✅ Auto-responses work for guests
- ✅ Real-time notifications work
- ✅ Same API endpoints
- ✅ Same WebSocket events

### Migration Required
❌ **NONE** - Fully backward compatible!

---

**Ready to use immediately!** Just update your frontend to connect without tokens.
