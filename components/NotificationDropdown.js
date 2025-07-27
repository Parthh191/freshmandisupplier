'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Package,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  DollarSign,
  X,
  Check,
  Loader2
} from 'lucide-react';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/notifications?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationIds) => {
    try {
      setMarkingRead(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'markAsRead',
          notificationIds
        })
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notificationIds.includes(notification.id) 
              ? { ...notification, status: 'read', readAt: new Date() }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    } finally {
      setMarkingRead(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setMarkingRead(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'markAllAsRead'
        })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => ({
            ...notification,
            status: 'read',
            readAt: new Date()
          }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setMarkingRead(false);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read if unread
    if (notification.status === 'unread') {
      markAsRead([notification.id]);
    }

    // Navigate based on notification type and data
    if (notification.data) {
      const data = notification.data;
      
      switch (notification.type) {
        case 'order':
          if (data.orderId) {
            router.push(`/orders/${data.orderId}`);
          }
          break;
        case 'product':
          if (data.productId) {
            router.push(`/products/edit/${data.productId}`);
          }
          break;
        case 'payment':
          if (data.orderId) {
            router.push(`/orders/${data.orderId}`);
          }
          break;
        case 'delivery':
          if (data.orderId) {
            router.push(`/orders/${data.orderId}`);
          }
          break;
        default:
          break;
      }
    }

    setIsOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-4 h-4 text-blue-400" />;
      case 'product':
        return <Package className="w-4 h-4 text-orange-400" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-green-400" />;
      case 'delivery':
        return <Truck className="w-4 h-4 text-purple-400" />;
      case 'system':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order':
        return 'border-l-blue-500';
      case 'product':
        return 'border-l-orange-500';
      case 'payment':
        return 'border-l-green-500';
      case 'delivery':
        return 'border-l-purple-500';
      case 'system':
        return 'border-l-yellow-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-300 hover:text-white transition-colors cursor-pointer group"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-white font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={markingRead}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {markingRead ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    'Mark all read'
                  )}
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No notifications</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 hover:bg-gray-700/50 transition-colors cursor-pointer border-l-4 ${getNotificationColor(notification.type)} ${
                      notification.status === 'unread' ? 'bg-gray-700/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-white truncate">
                            {notification.title}
                          </p>
                          <div className="flex items-center gap-1">
                            {notification.status === 'unread' && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            )}
                            <span className="text-xs text-gray-400">
                              {formatTime(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-700">
              <button
                onClick={() => router.push('/notifications')}
                className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 