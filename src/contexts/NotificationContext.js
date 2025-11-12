// src/contexts/NotificationContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getDecryptedUser } from '../components/common/CommonFunctions';
import { subscribeToMessages, getChatId } from '../config/chatService';
import { getTrainerForClient } from '../features/client/clientMessageService';
import { initializePushNotifications } from '../services/pushNotificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const unsubscribeRef = React.useRef(null);
  const lastMessageIdRef = React.useRef(null);
  const soundEnabledRef = React.useRef(true);

  // Get current user
  const getCurrentUser = useCallback(() => {
    return getDecryptedUser();
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (!soundEnabledRef.current) return;
    
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGH0fPTgjMGHm7A7+OZVA4OUqzn77FdGAg+ltryy3kpBSl+zfLZiTYIGWi77+efTQ8MUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQYxh9Hz04IzBh5uwO/jmVQODlKs5++xXRgIPpba8st5KQUpfs3y2Yk2CBlou+/nn00PDFCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBACxRetOnrqFUUCkaf4PK+bCEGMYfR89OCMwYebsDv45lUDg5SrOfvsV0YCD6W2vLLeSkFKX7N8tmJNggZaLvv559NDwxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGH0fPTgjMGHm7A7+OZVA4OUqzn77FdGAg+ltryy3kpBSl+zfLZiTYIGWi77+efTQ8MUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQYxh9Hz04IzBh5uwO/jmVQODlKs5++xXRgIPpba8st5KQUpfs3y2Yk2CBlou+/nn00PDFCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBACxRetOnrqFUUCkaf4PK+bCEGMYfR89OCMwYebsDv45lUDg5SrOfvsV0YCD6W2vLLeSkFKX7N8tmJNggZaLvv559NDwxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGH0fPTgjMGHm7A7+OZVA4OUqzn77FdGAg+ltryy3kpBSl+zfLZiTYIGWi77+efTQ8MUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQYxh9Hz04IzBh5uwO/jmVQODlKs5++xXRgIPpba8st5KQUpfs3y2Yk2CBlou+/nn00PDFCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBACxRetOnrqFUUCkaf4PK+bCEGMYfR89OCMwYebsDv45lUDg5SrOfvsV0YCD6W2vLLeSkFKX7N8tmJNggZaLvv559NDwxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGH0fPTgjMGHm7A7+OZVA4OUqzn77FdGAg+ltryy3kpBSl+zfLZiTYIGWi77+efTQ8MUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQYxh9Hz04IzBh5uwO/jmVQODlKs5++xXRgIBAA==');
      audio.volume = 0.3;
      audio.play().catch(err => {
        // Ignore audio play errors (user interaction required, etc.)
        console.log('Notification sound play failed:', err);
      });
    } catch (error) {
      console.log('Notification sound error:', error);
    }
  }, []);

  // Format timestamp
  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const msgTime = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffMs = now - msgTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return msgTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }, []);

  // Add notification
  const addNotification = useCallback((notification) => {
    setNotifications(prev => {
      // Check if notification already exists (prevent duplicates)
      const exists = prev.some(n => n.id === notification.id);
      if (exists) return prev;
      
      const newNotifications = [notification, ...prev].slice(0, 50); // Keep last 50
      return newNotifications;
    });
    
    // Play sound for new notifications
    if (notification.isNew) {
      playNotificationSound();
    }
  }, [playNotificationSound]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    
    // Update in Firestore if needed
    try {
      const user = getCurrentUser();
      if (user && user.clientId) {
        // Store read status in localStorage for now
        const readNotifications = JSON.parse(
          localStorage.getItem('readNotifications') || '[]'
        );
        if (!readNotifications.includes(notificationId)) {
          readNotifications.push(notificationId);
          localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [getCurrentUser]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    
    try {
      const user = getCurrentUser();
      if (user && user.clientId) {
        const allIds = notifications.map(n => n.id);
        const readNotifications = JSON.parse(
          localStorage.getItem('readNotifications') || '[]'
        );
        const updated = [...new Set([...readNotifications, ...allIds])];
        localStorage.setItem('readNotifications', JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, [notifications, getCurrentUser]);

  // Start listening for new messages
  const startListening = useCallback(async () => {
    if (isListening) return;

    const user = getCurrentUser();
    if (!user || user.role !== 'Client' || !user.clientId) {
      return;
    }

    try {
      const trainer = await getTrainerForClient(user.clientId);
      if (!trainer || !trainer.trainerId) {
        console.log('No trainer found for client');
        setIsListening(false);
        return;
      }

      setIsListening(true);
      const trainerId = trainer.trainerId;
      const clientId = user.clientId;

      // Get existing read notifications
      const readNotifications = JSON.parse(
        localStorage.getItem('readNotifications') || '[]'
      );

      // Subscribe to messages
      unsubscribeRef.current = subscribeToMessages(trainerId, clientId, (messages) => {
        if (!messages || messages.length === 0) return;

        // Get the latest message
        const latestMessage = messages[messages.length - 1];
        
        // Check if this is a new message from trainer
        if (
          latestMessage.senderId === trainerId &&
          latestMessage.id !== lastMessageIdRef.current
        ) {
          const isRead = readNotifications.includes(latestMessage.id);
          
          const notification = {
            id: latestMessage.id,
            type: 'message',
            senderId: trainerId,
            senderName: trainer.fullName || 'Your Trainer',
            message: latestMessage.text,
            preview: latestMessage.text.length > 50 
              ? latestMessage.text.substring(0, 50) + '...' 
              : latestMessage.text,
            timestamp: latestMessage.timestamp,
            formattedTime: formatTimestamp(latestMessage.timestamp),
            read: isRead,
            isNew: !isRead,
            chatId: getChatId(trainerId, clientId),
            trainerId,
            clientId,
          };

          addNotification(notification);
          lastMessageIdRef.current = latestMessage.id;
        }
      });
    } catch (error) {
      console.error('Error starting notification listener:', error);
      setIsListening(false);
    }
  }, [isListening, getCurrentUser, addNotification, formatTimestamp]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Toggle sound
  const toggleSound = useCallback(() => {
    soundEnabledRef.current = !soundEnabledRef.current;
    localStorage.setItem('notificationSoundEnabled', soundEnabledRef.current.toString());
  }, []);

  // Initialize
  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role === 'Client') {
      startListening();
      
      // Initialize push notifications
      initializePushNotifications((payload) => {
        // Handle push notification
        console.log('Push notification received:', payload);
        // The notification context will handle the message via Firestore listener
      });
    }

    // Load sound preference
    const soundPref = localStorage.getItem('notificationSoundEnabled');
    if (soundPref !== null) {
      soundEnabledRef.current = soundPref === 'true';
    }

    return () => {
      stopListening();
    };
  }, [getCurrentUser, startListening, stopListening]);

  // Update unread count
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const value = {
    notifications,
    unreadCount,
    isListening,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    toggleSound,
    soundEnabled: soundEnabledRef.current,
    formatTimestamp,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

