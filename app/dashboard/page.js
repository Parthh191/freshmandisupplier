'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  BarChart3,
  FolderOpen,
  Activity,
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch user data
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Fetch analytics (last 30 days)
      const analyticsResponse = await fetch('/api/analytics?days=30', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }

      // Fetch recent orders
      const ordersResponse = await fetch('/api/orders?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setRecentOrders(ordersData.orders);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-400" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'shipped':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'delivered':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Failed to load dashboard</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Welcome Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.name || 'Supplier'}! 👋
              </h1>
              <p className="text-gray-400">Here's what's happening with your business today</p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <Link
                href="/products/add"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Link>
              <Link
                href="/analytics"
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <BarChart3 className="w-4 h-4" />
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {analytics && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {formatCurrency(analytics.overview.totalRevenue)}
              </h3>
              <p className="text-gray-400 text-sm">Last 30 days</p>
            </div>

            {/* Total Orders */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {formatNumber(analytics.overview.totalOrders)}
              </h3>
              <p className="text-gray-400 text-sm">Orders received</p>
            </div>

            {/* Average Order Value */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {formatCurrency(analytics.overview.averageOrderValue)}
              </h3>
              <p className="text-gray-400 text-sm">Avg order value</p>
            </div>

            {/* Active Products */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Package className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {formatNumber(analytics.overview.productCount)}
              </h3>
              <p className="text-gray-400 text-sm">Active products</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Recent Orders */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
                <Link
                  href="/orders"
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 cursor-pointer"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No recent orders</p>
                  <p className="text-gray-500 text-sm">Orders from vendors will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Package className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{order.product.name}</p>
                          <p className="text-gray-400 text-sm">
                            {order.quantity} {order.product.unit} • {order.vendor.user.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{formatCurrency(order.totalPrice)}</p>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="text-xs capitalize">{order.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/products/add"
                  className="flex items-center gap-3 p-3 bg-blue-600/10 hover:bg-blue-600/20 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Add New Product</span>
                </Link>
                <Link
                  href="/products"
                  className="flex items-center gap-3 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
                >
                  <Package className="w-5 h-5 text-gray-400" />
                  <span className="text-white">Manage Products</span>
                </Link>
                <Link
                  href="/categories"
                  className="flex items-center gap-3 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
                >
                  <FolderOpen className="w-5 h-5 text-gray-400" />
                  <span className="text-white">Manage Categories</span>
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-400" />
                  <span className="text-white">View Orders</span>
                </Link>
                <Link
                  href="/analytics"
                  className="flex items-center gap-3 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
                >
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                  <span className="text-white">View Analytics</span>
                </Link>

              </div>
            </div>

            {/* Business Info */}
            {user && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-semibold text-white mb-4">Business Info</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">Business Owner</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-white">{user.email}</p>
                      <p className="text-gray-400 text-sm">Email</p>
                    </div>
                  </div>
                  
                  {user.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white">{user.phone}</p>
                        <p className="text-gray-400 text-sm">Phone</p>
                      </div>
                    </div>
                  )}
                  
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    View Full Profile
                  </Link>
                </div>
              </div>
            )}

            {/* Top Products */}
            {analytics && analytics.topProducts.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-semibold text-white mb-4">Top Products</h2>
                <div className="space-y-3">
                  {analytics.topProducts.slice(0, 3).map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <span className="text-blue-400 text-xs font-medium">{index + 1}</span>
                        </div>
                        <span className="text-white text-sm truncate max-w-24">{product.name}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{formatCurrency(product.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 