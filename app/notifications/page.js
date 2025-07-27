'use client';

import { useState, useEffect } from 'react';
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
  Filter,
  Check,
  Loader2,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, [pagination.page, selectedStatus, selectedType]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        ...(selectedType !== 'all' && { type: selectedType })
      });

      const response = await fetch(`/api/notifications?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds) => {
    try {
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
        fetchNotifications();
        setSelectedNotifications([]);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to mark notifications as read');
      }
    } catch (err) {
      alert('Failed to mark notifications as read');
    }
  };

  const markAllAsRead = async () => {
    try {
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
        fetchNotifications();
        setSelectedNotifications([]);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to mark all notifications as read');
      }
    } catch (err) {
      alert('Failed to mark all notifications as read');
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
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedNotifications.length === 0) return;

    if (bulkAction === 'markAsRead') {
      await markAsRead(selectedNotifications);
    }
    
    setBulkAction('');
  };

  const toggleNotificationSelection = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-5 h-5 text-blue-400" />;
      case 'product':
        return <Package className="w-5 h-5 text-orange-400" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-400" />;
      case 'delivery':
        return <Truck className="w-5 h-5 text-purple-400" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
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

  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Page Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
              <p className="text-gray-400">Stay updated with your latest activities</p>
            </div>

            <div className="mt-4 sm:mt-0 flex items-center gap-3">
              {selectedNotifications.length > 0 && (
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  <option value="">Bulk Actions</option>
                  <option value="markAsRead">Mark as Read</option>
                </select>
              )}
              
              {bulkAction && selectedNotifications.length > 0 && (
                <button
                  onClick={handleBulkAction}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Apply
                </button>
              )}

              <button
                onClick={markAllAsRead}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Mark All Read
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm">Filter by:</span>
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="order">Orders</option>
              <option value="product">Products</option>
              <option value="payment">Payments</option>
              <option value="delivery">Delivery</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {notifications.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No notifications found</h3>
            <p className="text-gray-400">
              {selectedStatus !== 'all' || selectedType !== 'all'
                ? 'Try adjusting your filter criteria'
                : 'You don\'t have any notifications yet'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Bulk Selection Header */}
            {notifications.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.length === notifications.length}
                      onChange={selectAll}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="text-gray-300">
                      {selectedNotifications.length} of {notifications.length} selected
                    </span>
                  </div>
                  
                  {selectedNotifications.length > 0 && (
                    <button
                      onClick={() => setSelectedNotifications([])}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden ${getNotificationColor(notification.type)} border-l-4 ${
                    notification.status === 'unread' ? 'bg-gray-700/30' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Checkbox for bulk selection */}
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => toggleNotificationSelection(notification.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer mt-1"
                      />

                      {/* Notification Icon */}
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {notification.status === 'unread' && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            )}
                            <span className="text-sm text-gray-400">
                              {formatTime(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 mb-4">
                          {notification.message}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleNotificationClick(notification)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>

                          {notification.status === 'unread' && (
                            <button
                              onClick={() => markAsRead([notification.id])}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              Mark as Read
                            </button>
                          )}

                          {notification.status === 'read' && (
                            <button
                              onClick={() => markAsRead([notification.id])}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                            >
                              <EyeOff className="w-4 h-4" />
                              Mark as Unread
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>

                  <span className="px-4 py-2 text-gray-300">
                    Page {pagination.page} of {pagination.pages}
                  </span>

                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 