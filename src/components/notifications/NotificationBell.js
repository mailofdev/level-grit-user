// src/components/notifications/NotificationBell.js
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, formatTimestamp } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    navigate(`/client-messages/${notification.trainerId}`, {
      state: {
        trainerId: notification.trainerId,
        clientId: notification.clientId,
      },
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const getInitials = (name) => {
    if (!name) return 'T';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    const timeA = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : new Date(a.timestamp || 0).getTime();
    const timeB = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : new Date(b.timestamp || 0).getTime();
    return timeB - timeA;
  });

  return (
    <div className="position-relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-link position-relative border-0 p-2"
        style={{
          color: 'white',
          minWidth: '44px',
          height: '44px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              fontSize: '0.7rem',
              padding: '4px 6px',
              minWidth: '20px',
              border: '2px solid white',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1040,
                background: 'rgba(0, 0, 0, 0.3)',
              }}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="notification-dropdown"
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '360px',
                maxWidth: '90vw',
                maxHeight: '500px',
                background: 'var(--color-card-bg)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--color-border)',
                zIndex: 1050,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div
                className="d-flex align-items-center justify-content-between p-3 border-bottom"
                style={{
                  background: 'var(--color-surface)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <h6 className="mb-0 fw-bold" style={{ color: 'var(--color-text)' }}>
                  Notifications
                  {unreadCount > 0 && (
                    <span className="badge bg-primary ms-2">{unreadCount}</span>
                  )}
                </h6>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="btn btn-link p-0 text-decoration-none"
                    style={{
                      color: 'var(--color-primary)',
                      fontSize: '0.875rem',
                    }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div
                className="flex-grow-1 overflow-auto"
                style={{
                  maxHeight: '400px',
                }}
              >
                {sortedNotifications.length === 0 ? (
                  <div className="text-center py-5">
                    <FaBell size={32} style={{ color: 'var(--color-muted)', opacity: 0.5 }} />
                    <p className="text-muted mt-3 mb-0">No notifications</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {sortedNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ backgroundColor: 'var(--color-surface-hover)' }}
                        onClick={() => handleNotificationClick(notification)}
                        className="d-flex align-items-start p-3 rounded-3 mb-2"
                        style={{
                          cursor: 'pointer',
                          background: notification.read
                            ? 'transparent'
                            : 'var(--color-surface-variant)',
                          border: notification.read
                            ? 'none'
                            : '1px solid var(--color-primary)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {/* Avatar */}
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                          style={{
                            width: '40px',
                            height: '40px',
                            background: 'var(--health-gradient)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                          }}
                        >
                          {getInitials(notification.senderName)}
                        </div>

                        {/* Content */}
                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                          <div className="d-flex align-items-start justify-content-between mb-1">
                            <h6
                              className="mb-0"
                              style={{
                                color: 'var(--color-text)',
                                fontSize: '0.875rem',
                                fontWeight: notification.read ? 'normal' : 'bold',
                              }}
                            >
                              {notification.senderName}
                            </h6>
                            {!notification.read && (
                              <span
                                className="badge bg-primary rounded-pill"
                                style={{ fontSize: '0.6rem', minWidth: '8px', height: '8px', padding: '4px' }}
                              />
                            )}
                          </div>
                          <p
                            className="mb-1"
                            style={{
                              color: 'var(--color-text)',
                              fontSize: '0.8125rem',
                              lineHeight: '1.4',
                              wordBreak: 'break-word',
                              opacity: notification.read ? 0.7 : 1,
                            }}
                          >
                            {notification.preview || notification.message}
                          </p>
                          <small style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>
                            {notification.formattedTime || formatTimestamp(notification.timestamp)}
                          </small>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;

