'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Plus, 
  Eye, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  Loader2,
  AlertCircle,
  Calendar,
  ArrowRight,
  Star,
  Award,
  Target,
  Activity,
  Building,
  MapPin
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [supplier, setSupplier] = useState(null);
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

      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUser(user);

        // Redirect vendors to their dashboard
        if (user.userType?.type === 'vendor') {
          router.push('/vendor-dashboard');
          return;
        }

        // Only proceed if user is a supplier
        if (user.userType?.type !== 'supplier') {
          router.push('/login');
          return;
        }
      }

      // Fetch supplier profile
      const supplierResponse = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (supplierResponse.ok) {
        const supplierData = await supplierResponse.json();
        setSupplier(supplierData);
      }

      // Fetch analytics
      const analyticsResponse = await fetch('/api/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }

      // Fetch recent orders
      const ordersResponse = await fetch('/api/orders?limit=5', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setRecentOrders(ordersData.orders || []);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
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
      case 'pending': return <Clock className="w-4 h-4" />
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10'
      case 'confirmed': return 'text-blue-400 bg-blue-400/10'
      case 'shipped': return 'text-purple-400 bg-purple-400/10'
      case 'delivered': return 'text-green-400 bg-green-400/10'
      case 'cancelled': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Supplier Dashboard</h1>
              <p className="text-gray-300 text-lg">Welcome back, {user?.name}!</p>
            </div>
            <div className="mt-6 md:mt-0 flex items-center space-x-4">
              <Link 
                href="/products/add" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </Link>
              <Link 
                href="/orders" 
                className="border border-blue-600 text-blue-400 px-6 py-3 rounded-lg hover:bg-blue-600/10 transition-colors flex items-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>View All Orders</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(analytics?.totalRevenue || 0)}
                </p>
              </div>
              <div className="bg-blue-600/20 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-white">
                  {formatNumber(analytics?.totalOrders || 0)}
                </p>
              </div>
              <div className="bg-green-600/20 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Active Products</p>
                <p className="text-3xl font-bold text-white">
                  {formatNumber(analytics?.activeProducts || 0)}
                </p>
              </div>
              <div className="bg-purple-600/20 p-3 rounded-lg">
                <Package className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm font-medium">Monthly Growth</p>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl font-bold text-white">
                    {analytics?.monthlyGrowth || 0}%
                  </p>
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
              <div className="bg-yellow-600/20 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Recent Orders</h2>
                <Link 
                  href="/orders" 
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-6">Orders from vendors will appear here.</p>
                  <Link 
                    href="/products" 
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Manage Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {(recentOrders || []).map(order => (
                    <div key={order.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30 hover:border-gray-500/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">Order #{order.id.slice(-8)}</h3>
                            <p className="text-sm text-gray-400">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-400">{formatCurrency(order.totalPrice)}</p>
                          <p className="text-sm text-gray-400">{order.quantity} {order.product?.unit}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{order.product?.name}</span>
                          <span>•</span>
                          <span className="capitalize">{order.status}</span>
                        </div>
                        <Link 
                          href={`/orders/${order.id}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Business Info & Quick Actions */}
          <div className="space-y-6">
            {/* Business Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-400" />
                <span>Business Info</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Business Name</p>
                  <p className="text-white font-medium">{supplier?.businessName || 'Not set'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <p className="text-white">{supplier?.location || 'Not set'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="text-white">
                    {supplier?.createdAt ? formatDate(supplier.createdAt) : 'Recently joined'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                <Link 
                  href="/profile" 
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Building className="w-4 h-4" />
                  <span>Update Profile</span>
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-400" />
                <span>Quick Actions</span>
              </h2>
              
              <div className="space-y-3">
                <Link 
                  href="/products/add" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <Plus className="w-5 h-5" />
                    <span>Add Product</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  href="/products" 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5" />
                    <span>Manage Products</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  href="/orders" 
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="w-5 h-5" />
                    <span>View Orders</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  href="/analytics" 
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white py-3 px-4 rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5" />
                    <span>Analytics</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 