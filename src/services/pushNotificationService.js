// src/services/pushNotificationService.js
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../config/firebase';
import { getDecryptedUser } from '../components/common/CommonFunctions';

/**
 * Request notification permission and get FCM token
 * @returns {Promise<string|null>} FCM token or null if permission denied
 */
export const requestNotificationPermission = async () => {
  if (!messaging || typeof window === 'undefined') {
    console.log('Messaging not available');
    return null;
  }

  try {
    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_VAPID_KEY || 'YOUR_VAPID_KEY_HERE', // Replace with your VAPID key
      });
      
      if (token) {
        // Store token in localStorage
        localStorage.setItem('fcmToken', token);
        console.log('FCM Token:', token);
        
        // TODO: Send token to your backend to associate with user
        // await axiosInstance.post('/api/notifications/register-token', { token });
        
        return token;
      }
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

/**
 * Listen for foreground push notifications
 * @param {Function} callback - Callback function to handle notifications
 */
export const onForegroundMessage = (callback) => {
  if (!messaging) {
    return () => {}; // Return no-op unsubscribe function
  }

  return onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    
    // Show browser notification
    if (Notification.permission === 'granted') {
      const notification = new Notification(payload.notification?.title || 'New Message', {
        body: payload.notification?.body || payload.data?.message,
        icon: payload.notification?.icon || '/logo192.png',
        badge: '/logo192.png',
        tag: payload.data?.messageId,
        requireInteraction: false,
        data: payload.data,
      });

      notification.onclick = () => {
        window.focus();
        if (payload.data?.trainerId) {
          window.location.href = `/client-messages/${payload.data.trainerId}`;
        }
        notification.close();
      };
    }

    // Call custom callback
    if (callback) {
      callback(payload);
    }
  });
};

/**
 * Initialize push notifications
 * @param {Function} onNotification - Callback for handling notifications
 */
export const initializePushNotifications = async (onNotification) => {
  // Check if browser supports notifications
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }

  // Check if service worker is supported
  if (!('serviceWorker' in navigator)) {
    console.log('This browser does not support service workers');
    return;
  }

  // Check if user is a client
  const user = getDecryptedUser();
  if (!user || user.role !== 'Client') {
    return;
  }

  // Request permission and get token
  const token = await requestNotificationPermission();
  
  if (token) {
    // Listen for foreground messages
    onForegroundMessage(onNotification);
    
    // Register service worker for background notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('Service Worker ready for push notifications');
      });
    }
  }
};

/**
 * Check if notifications are enabled
 * @returns {boolean}
 */
export const isNotificationEnabled = () => {
  return Notification.permission === 'granted';
};

/**
 * Get stored FCM token
 * @returns {string|null}
 */
export const getStoredFCMToken = () => {
  return localStorage.getItem('fcmToken');
};

