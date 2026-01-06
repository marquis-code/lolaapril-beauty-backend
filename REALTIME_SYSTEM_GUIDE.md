# 🚀 Real-Time Notification & Chat System

## Overview

A comprehensive WebSocket-based real-time notification and chat system with:
- **Audit Logs → Notifications**: Automatically funnels audit logs to business dashboard
- **Real-Time Chat**: WhatsApp-like chat between customers and businesses
- **Automated Responses**: FAQ automation and auto-responses when business is offline
- **Team Chat**: Communication between staff members
- **Scalable Architecture**: Redis-backed WebSocket for horizontal scaling

---

## 🏗️ Architecture

```
┌─────────────────┐
│  Audit Service  │ ──────▶ Event Emitter
└─────────────────┘            │
                               ▼
                    ┌──────────────────────┐
                    │ Notification Listener │
                    └──────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Realtime Gateway    │ ◀──▶ Redis Adapter
                    └──────────────────────┘
                               │
                               ▼
                    WebSocket Connections
                    (Business Dashboard & Users)
```

---

## 📡 WebSocket Connection

### Client Connection (Frontend)

```typescript
import { io } from 'socket.io-client'

// Connect with JWT token
const socket = io('http://your-backend-url/realtime', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  },
  transports: ['websocket', 'polling']
})

// Connection events
socket.on('connected', (data) => {
  console.log('Connected:', data)
})

socket.on('error', (error) => {
  console.error('Connection error:', error)
})
```

---

## 🔔 Real-Time Notifications

### Listen for Notifications (Business Dashboard)

```typescript
// Listen for all notifications
socket.on('notification:new', (notification) => {
  console.log('New notification:', notification)
  // Display in dashboard
})

// Listen for audit logs
socket.on('audit:log', (auditLog) => {
  console.log('Audit event:', auditLog)
  // {
  //   type: 'audit',
  //   action: 'create',
  //   entity: 'booking',
  //   description: 'New booking created',
  //   timestamp: '2026-01-05T...'
  // }
})

// Listen for specific event types
socket.on('booking.created', (data) => {
  showNotification('New Booking!', data.message)
})

socket.on('payment.received', (data) => {
  showNotification('💰 Payment Received', data.message)
})
```

### Notification Types

The system emits these notification types:
- `booking` - New bookings, status changes
- `payment` - Payment received, failed
- `client` - New clients, updates
- `appointment` - Reminders, cancellations
- `staff` - Availability changes
- `inventory` - Low stock alerts
- `system` - System alerts
- `audit` - Audit log events

---

## 💬 Real-Time Chat System

### Customer Initiates Chat

```typescript
// 1. Create/get chat room
const response = await fetch('/api/chat/rooms/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    userId: 'customer-user-id',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    userPhone: '+234...'
  })
})

const { _id: roomId } = await response.json()

// 2. Join the room via WebSocket
socket.emit('chat:join-room', { roomId })

// 3. Listen for incoming messages
socket.on('chat:new-message', (message) => {
  displayMessage(message)
})

// 4. Listen for automated responses
socket.on('chat:auto-response', (response) => {
  displayMessage(response)
})

socket.on('chat:faq-response', (faq) => {
  displayMessage(faq)
})

// 5. Send messages
socket.emit('chat:send-message', {
  roomId,
  senderId: 'user-id',
  senderType: 'customer',
  senderName: 'John Doe',
  content: 'Hello, I need help with my booking'
})

// 6. Typing indicators
socket.emit('chat:typing', { roomId, isTyping: true })

// Listen for others typing
socket.on('chat:user-typing', (data) => {
  showTypingIndicator(data.userId, data.isTyping)
})

// 7. Read receipts
socket.emit('chat:read-messages', { 
  roomId, 
  messageIds: ['msg1', 'msg2'] 
})

socket.on('chat:messages-read', (data) => {
  updateReadStatus(data.messageIds)
})
```

### Business Dashboard Chat View

```typescript
// Get all active chat rooms
const rooms = await fetch('/api/chat/rooms?isActive=true&page=1&limit=20', {
  headers: { 'Authorization': `Bearer ${token}` }
})

// Join multiple rooms
rooms.forEach(room => {
  socket.emit('chat:join-room', { roomId: room._id })
})

// Listen for new conversations
socket.on('chat:new-conversation', (chatInfo) => {
  addChatToList(chatInfo)
  playNotificationSound()
})

// Send staff response
const sendStaffMessage = async (roomId, content) => {
  await fetch(`/api/chat/rooms/${roomId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      senderId: 'staff-user-id',
      senderType: 'staff',
      senderName: 'Support Agent',
      content
    })
  })
}
```

---

## 🤖 Automated Chat Features

### 1. FAQ Management

```typescript
// Create FAQ
await fetch('/api/chat/faqs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    question: 'What are your business hours?',
    answer: 'We are open Monday-Friday 9AM-6PM, Saturday 10AM-4PM.',
    keywords: ['hours', 'open', 'time', 'schedule'],
    alternativeQuestions: [
      'When are you open?',
      'What time do you close?',
      'Business hours?'
    ],
    category: 'general',
    confidenceThreshold: 70, // Auto-respond if 70%+ match
    priority: 10 // Higher priority checked first
  })
})

// Get all FAQs
const faqs = await fetch('/api/chat/faqs', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### 2. Auto-Responses

```typescript
// Create welcome message
await fetch('/api/chat/auto-responses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Welcome Message',
    responseType: 'welcome',
    message: 'Hi! 👋 Welcome to our chat support. How can I help you today?',
    trigger: {
      event: 'user-joined'
    }
  })
})

// Create offline message
await fetch('/api/chat/auto-responses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Offline Response',
    responseType: 'offline',
    message: "Thanks for reaching out! We're offline now but will respond when we're back online. ⏰",
    trigger: {
      event: 'after-hours',
      conditions: {
        dayOfWeek: [0, 6], // Weekend
        timeRange: { start: '18:00', end: '09:00' }
      }
    },
    quickReplies: [
      'Check business hours',
      'Book an appointment',
      'View services'
    ]
  })
})
```

### 3. Auto-Response Flow

```
Customer Message
      │
      ▼
Is Business Available? ────No───▶ Send Offline Response
      │
     Yes
      │
      ▼
Match with FAQ? ────Yes (>70%)───▶ Send FAQ Response
      │                             │
      No                            ▼
      │                        Ask "Was this helpful?"
      ▼
Send Acknowledgment
      │
      ▼
Notify Staff
```

---

## 🔍 Audit Log → Notification Integration

### Triggering Events in Your Code

```typescript
// In your service (e.g., BookingService)
import { EventEmitter2 } from '@nestjs/event-emitter'

constructor(private eventEmitter: EventEmitter2) {}

async createBooking(bookingData) {
  const booking = await this.bookingModel.create(bookingData)
  
  // Emit event that triggers notification
  this.eventEmitter.emit('booking.created', {
    businessId: bookingData.businessId,
    booking: {
      id: booking._id,
      clientName: booking.clientName,
      service: booking.serviceName,
      date: booking.date,
      time: booking.time
    }
  })
  
  return booking
}
```

### Available Events to Emit

```typescript
// Booking events
this.eventEmitter.emit('booking.created', { businessId, booking })
this.eventEmitter.emit('booking.status-changed', { businessId, booking, oldStatus, newStatus })

// Payment events
this.eventEmitter.emit('payment.received', { businessId, payment })

// Client events
this.eventEmitter.emit('client.created', { businessId, client })

// Appointment events
this.eventEmitter.emit('appointment.reminder', { businessId, appointment })

// Staff events
this.eventEmitter.emit('staff.availability-changed', { businessId, staff, isAvailable })

// Inventory events
this.eventEmitter.emit('inventory.low-stock', { businessId, product })

// System alerts
this.eventEmitter.emit('system.alert', { 
  businessId, 
  alert: { 
    title: 'System Alert', 
    message: 'Important update',
    priority: 'high'
  } 
})
```

---

## 📊 Usage Statistics

### Monitor WebSocket Connections

```typescript
// In your admin panel
const stats = {
  totalConnections: realtimeGateway.getConnectedClientsCount(),
  businessConnections: realtimeGateway.getBusinessConnections(businessId),
  isUserOnline: realtimeGateway.isUserOnline(userId)
}
```

---

## 🎯 API Endpoints

### Chat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/rooms/create` | Create/get customer chat room |
| GET | `/api/chat/rooms` | Get all chat rooms |
| PUT | `/api/chat/rooms/:roomId/archive` | Archive chat room |
| POST | `/api/chat/rooms/:roomId/messages` | Send message |
| GET | `/api/chat/rooms/:roomId/messages` | Get room messages |
| PUT | `/api/chat/rooms/:roomId/messages/read` | Mark as read |
| POST | `/api/chat/faqs` | Create FAQ |
| GET | `/api/chat/faqs` | Get FAQs |
| PUT | `/api/chat/faqs/:faqId` | Update FAQ |
| DELETE | `/api/chat/faqs/:faqId` | Delete FAQ |
| POST | `/api/chat/auto-responses` | Create auto-response |
| GET | `/api/chat/auto-responses` | Get auto-responses |
| PUT | `/api/chat/auto-responses/:responseId` | Update auto-response |

---

## 🔐 Security

- JWT authentication required for WebSocket connections
- Business-scoped rooms (users only see their business data)
- Redis adapter for horizontal scaling
- Message encryption in transit (WSS)

---

## 🚀 Deployment

### Environment Variables

```bash
# WebSocket
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET=your-secret-key
```

### Start Server

```bash
npm run start:dev
```

The WebSocket server runs on: `ws://localhost:3000/realtime`

---

## 📱 Frontend Integration Examples

### React Hook for Chat

```typescript
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export const useChat = (roomId: string, token: string) => {
  const [messages, setMessages] = useState([])
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io('http://localhost:3000/realtime', {
      auth: { token }
    })

    newSocket.on('connected', () => {
      newSocket.emit('chat:join-room', { roomId })
    })

    newSocket.on('chat:new-message', (message) => {
      setMessages(prev => [...prev, message])
    })

    newSocket.on('chat:auto-response', (response) => {
      setMessages(prev => [...prev, response])
    })

    setSocket(newSocket)

    return () => newSocket.close()
  }, [roomId, token])

  const sendMessage = (content: string) => {
    socket?.emit('chat:send-message', {
      roomId,
      content,
      senderId: 'user-id',
      senderType: 'customer',
      senderName: 'User'
    })
  }

  return { messages, sendMessage, socket }
}
```

---

## 🎉 Features Summary

✅ **Real-time notifications** for all business events  
✅ **Audit logs** automatically pushed to business dashboard  
✅ **Customer chat** with WhatsApp-like experience  
✅ **FAQ automation** with keyword matching  
✅ **Auto-responses** when business is offline  
✅ **Team chat** between staff members  
✅ **Typing indicators** and read receipts  
✅ **Message history** with pagination  
✅ **Scalable** with Redis adapter  
✅ **Secure** with JWT authentication  
✅ **Multiple chat rooms** per business  
✅ **Priority-based** FAQ matching  
✅ **Customizable** auto-responses  

---

## 🛠️ Next Steps

1. **Test WebSocket Connection**: Use Postman or any WebSocket client
2. **Create FAQs**: Add common questions for your business
3. **Set Up Auto-Responses**: Configure welcome and offline messages
4. **Integrate Frontend**: Use the examples above
5. **Monitor Performance**: Check connection counts and response times

---

## 📞 Support

For issues or questions, check the logs:
- WebSocket connections: Look for `🚀 WebSocket Gateway Initialized`
- Chat events: Look for `💬 Message sent in room`
- Notifications: Look for `📢 Notification sent to business`

---

**Built with ❤️ using NestJS, Socket.IO, and MongoDB**
