# 🧪 Anonymous Chat - Testing Checklist

## ✅ Pre-Deployment Checks

### 1. Server Configuration
- [ ] Server is running: `npm run start:dev`
- [ ] WebSocket gateway initialized (check logs for "🚀 WebSocket Gateway Initialized")
- [ ] Redis connected (optional, for scaling)
- [ ] MongoDB connected
- [ ] Port 3000 accessible

### 2. Environment Variables
```env
# Required
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/lola-beauty
REDIS_HOST=localhost
REDIS_PORT=6379

# Optional
REDIS_PASSWORD=
GUEST_SESSION_TIMEOUT=7200000  # 2 hours
```

---

## 🔌 Connection Tests

### Test 1: Anonymous Connection (No Token)
```javascript
const socket = io('http://localhost:3000/realtime')

socket.on('connect', () => {
  console.log('✅ Connected successfully')
})

socket.on('guest:registered', (data) => {
  console.log('✅ Guest registered:', data.guestId)
  console.log('Session ID:', data.sessionId)
})

socket.on('error', (error) => {
  console.error('❌ Error:', error)
})
```

**Expected Result:**
```
✅ Connected successfully
✅ Guest registered: guest_1735344000000_k3j4h5g2
Session ID: xyz123abc
```

**Check Server Logs:**
```
🔓 Anonymous user connecting: socket-id-here
✅ Anonymous guest connected: socket-id-here | Guest ID: guest_...
📊 Total connected clients: 1
```

---

### Test 2: Authenticated Connection (With Token)
```javascript
const socket = io('http://localhost:3000/realtime', {
  auth: {
    token: 'your-jwt-token-here'
  }
})

socket.on('connected', (data) => {
  console.log('✅ Authenticated:', data)
})
```

**Expected Result:**
```
✅ Authenticated: {
  message: 'Connected to real-time server',
  clientId: '...',
  isAuthenticated: true,
  timestamp: '...'
}
```

**Check Server Logs:**
```
✅ Authenticated client connected: socket-id | Business: ... | User: ...
```

---

### Test 3: Invalid Token (Fallback to Guest)
```javascript
const socket = io('http://localhost:3000/realtime', {
  auth: {
    token: 'invalid-token-here'
  }
})

socket.on('guest:registered', (data) => {
  console.log('✅ Fallback to guest mode:', data.guestId)
})
```

**Expected Result:**
```
✅ Fallback to guest mode: guest_...
```

**Check Server Logs:**
```
⚠️ Invalid token for client ..., treating as anonymous
✅ Anonymous guest connected: ...
```

---

## 💬 Chat Flow Tests

### Test 4: Join Room (Anonymous User)
```javascript
socket.on('guest:registered', ({ guestId, sessionId }) => {
  // Join room with businessId
  socket.emit('chat:join-room', {
    businessId: 'your-business-id-here',
    userName: 'Test Guest',
    email: null
  }, (response) => {
    console.log('Room join response:', response)
  })
})
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Room created/joined successfully",
  "roomId": "67abc123...",
  "isGuest": true,
  "guestId": "guest_..."
}
```

**Check Database:**
```javascript
db.chatrooms.findOne({ 'metadata.guestInfo.sessionId': 'your-session-id' })
```

**Expected Document:**
```json
{
  "_id": "...",
  "businessId": "...",
  "roomType": "customer-support",
  "roomName": "Chat with Test Guest (Guest)",
  "metadata": {
    "userType": "guest",
    "userName": "Test Guest",
    "isGuest": true,
    "guestInfo": {
      "guestId": "guest_...",
      "sessionId": "...",
      "userAgent": "..."
    },
    "tags": ["new-guest", "anonymous"]
  }
}
```

---

### Test 5: Send Message (Guest)
```javascript
socket.emit('chat:send-message', {
  roomId: 'room-id-from-join-response',
  content: 'Hello, I have a question'
})

socket.on('chat:new-message', (message) => {
  console.log('✅ Message sent:', message)
})
```

**Expected:**
- Message saved to database
- Business receives notification
- FAQ auto-response triggered (if matches)

**Check Database:**
```javascript
db.chatmessages.find({ roomId: ObjectId('your-room-id') })
```

---

### Test 6: Session Recovery
```javascript
// First connection
const sessionId = 'saved-session-id'

// Disconnect and reconnect with same sessionId
const socket2 = io('http://localhost:3000/realtime', {
  auth: { sessionId }
})

socket2.emit('chat:join-room', {
  businessId: 'same-business-id',
  userName: 'Test Guest'
}, (response) => {
  console.log('Should return EXISTING room:', response.roomId)
})
```

**Expected:**
- Same roomId returned
- Previous messages visible
- No duplicate room created

---

## 🤖 Automation Tests

### Test 7: FAQ Auto-Response
```javascript
socket.emit('chat:send-message', {
  roomId: roomId,
  content: 'What are your hours?' // Should trigger FAQ
})

socket.on('chat:faq-response', (response) => {
  console.log('✅ FAQ triggered:', response.answer)
})
```

**Expected:**
- FAQ matched with 70%+ confidence
- Auto-response sent within 200ms
- Business notified

---

### Test 8: Offline Auto-Response
```javascript
// Send message when business is offline
socket.emit('chat:send-message', {
  roomId: roomId,
  content: 'Are you there?'
})

socket.on('chat:system-message', (message) => {
  console.log('✅ Offline message:', message.content)
})
```

**Expected:**
```
"Thanks for your message! We're currently offline but will respond soon."
```

---

## 🎨 Frontend Widget Tests

### Test 9: Widget Integration
```bash
# Copy widget to your frontend
cp src/notification/examples/anonymous-chat-widget.tsx /path/to/frontend/components/

# Install dependencies
npm install socket.io-client
```

```tsx
import { AnonymousChatWidget } from './components/anonymous-chat-widget'

<AnonymousChatWidget
  businessId="your-business-id"
  businessName="Lola Beauty"
  themeColor="#ec4899"
/>
```

**Manual Checks:**
- [ ] Widget button appears (bottom right)
- [ ] Clicking opens chat window
- [ ] "Guest Mode" indicator shows
- [ ] Can send messages
- [ ] Receives responses
- [ ] Email form appears after 2+ messages
- [ ] Works on mobile

---

## 📊 Business Dashboard Tests

### Test 10: View Anonymous Chats
```javascript
// API call from business dashboard
fetch('/api/chat/rooms?businessId=your-business-id', {
  headers: {
    'Authorization': 'Bearer business-token'
  }
})
```

**Expected Response:**
```json
{
  "rooms": [
    {
      "_id": "...",
      "roomName": "Chat with Test Guest (Guest)",
      "metadata": {
        "isGuest": true,
        "userName": "Test Guest",
        "guestInfo": {
          "guestId": "guest_..."
        }
      },
      "lastMessageAt": "..."
    }
  ]
}
```

**UI Checks:**
- [ ] Guest chats show "Guest" badge
- [ ] Can distinguish from authenticated chats
- [ ] Can respond to guest chats
- [ ] Guest info displayed correctly

---

## 🔒 Security Tests

### Test 11: Rate Limiting
```javascript
// Send 20 messages rapidly
for (let i = 0; i < 20; i++) {
  socket.emit('chat:send-message', {
    roomId: roomId,
    content: `Message ${i}`
  })
}
```

**Expected:**
- First 10 messages succeed
- After that, rate limit kicks in
- Error response returned

---

### Test 12: Multiple Guest Sessions
```javascript
// Create 5 different guest connections
const sockets = []
for (let i = 0; i < 5; i++) {
  const socket = io('http://localhost:3000/realtime')
  sockets.push(socket)
}

// Each should get unique guestId
```

**Expected:**
- Each connection gets unique guestId
- All can chat independently
- No cross-contamination

---

## 📈 Performance Tests

### Test 13: Concurrent Guests
```javascript
// Simulate 50 concurrent anonymous users
const guests = []
for (let i = 0; i < 50; i++) {
  const socket = io('http://localhost:3000/realtime')
  guests.push(socket)
}

// All should connect successfully
```

**Monitor:**
- [ ] All connections successful
- [ ] Server response time < 100ms
- [ ] Memory usage stable
- [ ] No connection drops

---

### Test 14: Message Throughput
```javascript
// Send 100 messages from different guests
Promise.all(
  guests.map((socket, i) =>
    socket.emit('chat:send-message', {
      roomId: roomId,
      content: `Message ${i}`
    })
  )
)
```

**Monitor:**
- [ ] All messages delivered
- [ ] Average latency < 50ms
- [ ] Database writes successful
- [ ] No message loss

---

## 🔍 Database Verification

### Test 15: Data Integrity
```javascript
// Check guest room structure
db.chatrooms.findOne({ 'metadata.isGuest': true })

// Required fields check
const room = db.chatrooms.findOne({ 'metadata.isGuest': true })
assert(room.metadata.guestInfo.guestId, 'guestId missing')
assert(room.metadata.guestInfo.sessionId, 'sessionId missing')
assert(room.metadata.tags.includes('anonymous'), 'tag missing')
```

---

### Test 16: Session Queries
```javascript
// Find guest by sessionId
db.chatrooms.find({
  'metadata.guestInfo.sessionId': 'specific-session-id'
})

// Should return exactly one room per session
```

---

## 📱 Mobile Tests

### Test 17: Mobile Browser
- [ ] Open widget on iPhone Safari
- [ ] Open widget on Android Chrome
- [ ] Touch interactions work
- [ ] Keyboard doesn't break layout
- [ ] Messages scroll correctly
- [ ] Input field stays visible

---

## 🐛 Error Handling Tests

### Test 18: Connection Failures
```javascript
// Disconnect server
socket.on('disconnect', () => {
  console.log('Disconnected')
})

socket.on('connect_error', (error) => {
  console.log('Connection error:', error)
})

// Try to reconnect
socket.connect()
```

**Expected:**
- Error handled gracefully
- User notified of disconnection
- Reconnection attempted
- Session recovered

---

### Test 19: Invalid Room ID
```javascript
socket.emit('chat:send-message', {
  roomId: 'invalid-room-id',
  content: 'Test'
}, (response) => {
  console.log('Error response:', response)
})
```

**Expected:**
```json
{
  "success": false,
  "error": "Room not found"
}
```

---

## ✅ Final Checklist

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint passes
- [ ] No console.errors in production
- [ ] Proper error handling

### Documentation
- [ ] README updated
- [ ] API docs updated
- [ ] Frontend integration guide complete
- [ ] Testing guide complete

### Performance
- [ ] WebSocket connection < 100ms
- [ ] Message delivery < 50ms
- [ ] FAQ matching < 50ms
- [ ] Database queries optimized
- [ ] Indexes created

### Security
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Input sanitization
- [ ] SQL injection prevention
- [ ] XSS prevention

### Monitoring
- [ ] Logging configured
- [ ] Error tracking setup
- [ ] Analytics implemented
- [ ] Health checks working

---

## 🚀 Deployment Steps

1. **Pre-Deploy:**
   ```bash
   npm run build
   npm run test
   ```

2. **Deploy Backend:**
   ```bash
   pm2 start dist/main.js --name lola-backend
   ```

3. **Deploy Frontend Widget:**
   ```bash
   # Copy widget to production frontend
   npm run build
   npm run deploy
   ```

4. **Verify Production:**
   - [ ] WebSocket connects: `wss://your-domain.com/realtime`
   - [ ] Anonymous connection works
   - [ ] Messages delivered
   - [ ] FAQ automation works
   - [ ] Monitored logs for errors

5. **Monitor:**
   - [ ] Check error logs
   - [ ] Monitor WebSocket connections
   - [ ] Track guest conversion rate
   - [ ] Monitor response times

---

## 📞 Support

**Issues?** Check:
1. Server logs: `tail -f logs/error.log`
2. WebSocket connection: Browser DevTools → Network → WS
3. Database: `mongo` → Check chatrooms and chatmessages
4. Redis: `redis-cli` → Check connections

**Still stuck?** Review:
- `ANONYMOUS_CHAT_UPDATE.md` - Detailed guide
- `REALTIME_SYSTEM_GUIDE.md` - System overview
- `anonymous-chat-widget.tsx` - Frontend example

---

**Test Status:** 
- [ ] All tests passing
- [ ] Ready for production

**Tested by:** _______________  
**Date:** _______________  
**Environment:** [ ] Dev [ ] Staging [ ] Production
