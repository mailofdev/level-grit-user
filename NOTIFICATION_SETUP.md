# Real-Time Notification System Setup Guide

This document explains how to set up and use the real-time notification system for the Client Portal.

## Features Implemented

✅ **Real-time notifications** - Clients receive instant notifications when trainers send messages
✅ **Toast notifications** - Popup alerts for new messages
✅ **Badge counter** - Unread message count on notification bell icon
✅ **Sound alerts** - Optional sound notification for new messages
✅ **Mark as read** - Automatic marking when client views conversation
✅ **Push notifications** - FCM/Web Push API support for background notifications
✅ **Theme consistent** - Matches portal's design system

## Components

### 1. NotificationContext (`src/contexts/NotificationContext.js`)
- Manages global notification state
- Listens for real-time messages from Firestore
- Handles notification sound, read status, and formatting

### 2. NotificationBell (`src/components/notifications/NotificationBell.js`)
- Bell icon with badge counter in the Topbar
- Dropdown panel showing all notifications
- Click to navigate to messages

### 3. NotificationToast (`src/components/notifications/NotificationToast.js`)
- Toast/popup notifications for instant alerts
- Auto-dismisses after 5 seconds
- Clickable to navigate to conversation

### 4. Push Notification Service (`src/services/pushNotificationService.js`)
- Handles FCM token registration
- Manages foreground and background notifications

## Setup Instructions

### 1. Firebase Cloud Messaging (FCM) Setup

To enable push notifications, you need to:

1. **Generate VAPID Key**:
   - Go to Firebase Console → Project Settings → Cloud Messaging
   - Generate a new Web Push certificate (VAPID key)
   - Copy the key pair

2. **Update Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   REACT_APP_VAPID_KEY=your_vapid_key_here
   ```

3. **Update `pushNotificationService.js`**:
   Replace `'YOUR_VAPID_KEY_HERE'` with your actual VAPID key or use the environment variable:
   ```javascript
   vapidKey: process.env.REACT_APP_VAPID_KEY || 'your_vapid_key_here'
   ```

### 2. Service Worker

The service worker (`public/service-worker.js`) has been updated to handle push notifications. It will:
- Show notifications when the app is in the background
- Handle notification clicks to open the app
- Support offline functionality

### 3. Backend Integration (Optional)

To send push notifications from your backend:

1. **Store FCM Tokens**:
   When a client grants notification permission, the FCM token is stored in `localStorage`. You should send this token to your backend to associate it with the user.

2. **Send Notifications**:
   When a trainer sends a message, your backend should:
   - Get the client's FCM token
   - Send a push notification using Firebase Admin SDK

   Example (Node.js):
   ```javascript
   const admin = require('firebase-admin');
   
   async function sendPushNotification(clientToken, message, trainerName) {
     const message = {
       notification: {
         title: trainerName,
         body: message.text,
       },
       data: {
         trainerId: message.trainerId,
         clientId: message.clientId,
         messageId: message.id,
       },
       token: clientToken,
     };
     
     await admin.messaging().send(message);
   }
   ```

## Usage

### For Clients

1. **Notification Bell**: Click the bell icon in the top navigation to see all notifications
2. **Toast Notifications**: New messages appear as toast notifications in the top-right corner
3. **Auto-read**: Messages are automatically marked as read when you open the conversation
4. **Sound Alerts**: Sound plays for new notifications (can be toggled in settings)

### For Developers

#### Accessing Notifications in Components

```javascript
import { useNotifications } from '../contexts/NotificationContext';

function MyComponent() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();
  
  // Use notifications...
}
```

#### Notification Object Structure

```javascript
{
  id: 'message-id',
  type: 'message',
  senderId: 'trainer-id',
  senderName: 'Trainer Name',
  message: 'Full message text',
  preview: 'Message preview...',
  timestamp: FirestoreTimestamp,
  formattedTime: 'Just now',
  read: false,
  isNew: true,
  chatId: 'chat-id',
  trainerId: 'trainer-id',
  clientId: 'client-id',
}
```

## Customization

### Styling

Notification styles are in `src/styles/notifications.css`. You can customize:
- Toast position and animation
- Dropdown panel appearance
- Badge colors and animations

### Sound

The notification sound is embedded as a base64-encoded WAV file. To change it:
1. Replace the base64 string in `NotificationContext.js` (line ~30)
2. Or load from a file:
   ```javascript
   const audio = new Audio('/sounds/notification.mp3');
   ```

### Notification Behavior

Modify `NotificationContext.js` to:
- Change auto-dismiss timeout (currently 5 seconds)
- Adjust notification limit (currently 50)
- Customize timestamp formatting

## Testing

1. **Local Testing**:
   - Run the app: `npm start`
   - Login as a client
   - Have a trainer send a message
   - Verify toast notification appears
   - Check badge count updates

2. **Push Notification Testing**:
   - Deploy to HTTPS (required for push notifications)
   - Grant notification permission
   - Send a message while app is in background
   - Verify browser notification appears

## Troubleshooting

### Notifications not appearing
- Check browser console for errors
- Verify Firestore rules allow read access
- Ensure client has a trainer assigned
- Check that `NotificationProvider` wraps the app

### Push notifications not working
- Verify HTTPS is enabled (required for service workers)
- Check browser supports notifications (Chrome, Firefox, Edge)
- Ensure VAPID key is correctly configured
- Check service worker is registered

### Sound not playing
- Check browser autoplay policies
- Verify `notificationSoundEnabled` in localStorage
- Some browsers require user interaction before playing audio

## Browser Support

- ✅ Chrome/Edge (Full support)
- ✅ Firefox (Full support)
- ✅ Safari (Limited - no push notifications)
- ⚠️ Mobile browsers (Varies by platform)

## Security Considerations

1. **FCM Tokens**: Store securely on backend, never expose in client code
2. **Firestore Rules**: Ensure proper read/write permissions
3. **User Privacy**: Respect notification preferences
4. **HTTPS**: Required for service workers and push notifications

## Future Enhancements

- [ ] Notification preferences/settings page
- [ ] Group notifications by conversation
- [ ] Notification history
- [ ] Email notifications fallback
- [ ] Rich notifications with images
- [ ] Notification scheduling

