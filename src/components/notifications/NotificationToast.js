// src/components/notifications/NotificationToast.js
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationToast = ({ notification, onClose, onClick }) => {
  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getInitials = (name) => {
    if (!name) return 'T';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="notification-toast"
      onClick={onClick}
      style={{
        minWidth: '320px',
        maxWidth: '400px',
        background: 'var(--color-card-bg)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
        cursor: 'pointer',
        overflow: 'hidden',
        marginBottom: '12px',
      }}
    >
      <div className="d-flex align-items-start p-3">
        {/* Avatar */}
        <div
          className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
          style={{
            width: '48px',
            height: '48px',
            background: 'var(--health-gradient)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          {getInitials(notification.senderName)}
        </div>

        {/* Content */}
        <div className="flex-grow-1" style={{ minWidth: 0 }}>
          <div className="d-flex align-items-start justify-content-between mb-1">
            <h6 className="mb-0 fw-bold" style={{ color: 'var(--color-text)', fontSize: '0.95rem' }}>
              {notification.senderName}
            </h6>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="btn btn-link p-0 border-0"
              style={{
                color: 'var(--color-muted)',
                minWidth: '24px',
                height: '24px',
                padding: '0',
              }}
            >
              <FaTimes size={12} />
            </motion.button>
          </div>
          <p
            className="mb-1"
            style={{
              color: 'var(--color-text)',
              fontSize: '0.875rem',
              lineHeight: '1.4',
              wordBreak: 'break-word',
            }}
          >
            {notification.preview || notification.message}
          </p>
          <small style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>
            {notification.formattedTime || 'Just now'}
          </small>
        </div>
      </div>

      {/* Unread indicator */}
      {!notification.read && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            boxShadow: '0 0 8px var(--color-primary)',
          }}
        />
      )}
    </motion.div>
  );
};

const NotificationToastContainer = () => {
  const { notifications, markAsRead } = useNotifications();
  const [visibleToasts, setVisibleToasts] = React.useState([]);

  useEffect(() => {
    // Show only unread notifications as toasts
    const unread = notifications
      .filter(n => !n.read && n.isNew)
      .slice(0, 3); // Max 3 toasts at once
    
    setVisibleToasts(unread);
  }, [notifications]);

  const handleClose = (id) => {
    setVisibleToasts(prev => prev.filter(n => n.id !== id));
    markAsRead(id);
  };

  const handleClick = (notification) => {
    markAsRead(notification.id);
    // Navigate to messages
    window.location.href = `/client-messages/${notification.trainerId}`;
  };

  return (
    <div
      className="notification-toast-container"
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {visibleToasts.map(notification => (
          <div key={notification.id} style={{ pointerEvents: 'auto' }}>
            <NotificationToast
              notification={notification}
              onClose={() => handleClose(notification.id)}
              onClick={() => handleClick(notification)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToastContainer;

