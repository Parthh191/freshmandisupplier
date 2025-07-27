'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  ShoppingCart, 
  FolderOpen,
  Calendar,
  Loader2,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState(30);
  const router = useRouter();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/analytics?days=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'confirmed': return 'text-blue-400';
      case 'shipped': return 'text-purple-400';
      case 'delivered': return 'text-green-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) {
      return <ArrowUpRight className="w-4 h-4 text-green-400" />;
    } else if (growth < 0) {
      return <ArrowDownRight className="w-4 h-4 text-red-400" />;
    }
    return null;
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-400';
    if (growth < 0) return 'text-red-400';
    return 'text-gray-400';
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

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Failed to load analytics</h3>
              <p className="text-gray-400 mb-6">{error || 'Unable to fetch analytics data.'}</p>
              <button
                onClick={fetchAnalytics}
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
      {/* Page Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-gray-400">Track your business performance and insights</p>
            </div>
            
            {/* Time Range Selector */}
            <div className="mt-4 sm:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(parseInt(e.target.value))}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex items-center gap-1">
                {getGrowthIcon(analytics.overview.revenueGrowth)}
                <span className={`text-sm font-medium ${getGrowthColor(analytics.overview.revenueGrowth)}`}>
                  {analytics.overview.revenueGrowth > 0 ? '+' : ''}{analytics.overview.revenueGrowth.toFixed(1)}%
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {formatCurrency(analytics.overview.totalRevenue)}
            </h3>
            <p className="text-gray-400 text-sm">Total Revenue</p>
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
            <p className="text-gray-400 text-sm">Total Orders</p>
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
            <p className="text-gray-400 text-sm">Avg Order Value</p>
          </div>

          {/* Products */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Package className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {formatNumber(analytics.overview.productCount)}
            </h3>
            <p className="text-gray-400 text-sm">Active Products</p>
          </div>
        </div>
      </div>

      {/* Charts and Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Status Breakdown */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Order Status Breakdown</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(analytics.statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status).replace('text-', 'bg-')}`}></div>
                    <span className="text-white capitalize">{status}</span>
                  </div>
                  <span className="text-gray-400 font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Top Products by Revenue</h2>
            </div>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-400 text-xs font-medium">{index + 1}</span>
                    </div>
                    <span className="text-white truncate max-w-32">{product.name}</span>
                  </div>
                  <span className="text-gray-400 font-medium">{formatCurrency(product.revenue)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-6">
              <FolderOpen className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Orders by Category</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(analytics.categoryBreakdown).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-white">{category}</span>
                  <span className="text-gray-400 font-medium">{count} orders</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Comparison */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-orange-400" />
              <h2 className="text-xl font-semibold text-white">Monthly Revenue</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Current Month</span>
                <span className="text-white font-medium">{formatCurrency(analytics.currentMonthRevenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Previous Month</span>
                <span className="text-white font-medium">{formatCurrency(analytics.previousMonthRevenue)}</span>
              </div>
              <div className="pt-2 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Growth</span>
                  <div className="flex items-center gap-1">
                    {getGrowthIcon(analytics.overview.revenueGrowth)}
                    <span className={`font-medium ${getGrowthColor(analytics.overview.revenueGrowth)}`}>
                      {analytics.overview.revenueGrowth > 0 ? '+' : ''}{analytics.overview.revenueGrowth.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              <Link
                href="/orders"
                className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
              >
                View All Orders →
              </Link>
            </div>
            <div className="space-y-4">
              {analytics.recentOrders.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No recent orders</p>
              ) : (
                analytics.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Package className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{order.productName}</p>
                        <p className="text-gray-400 text-sm">
                          {order.quantity} units • {order.vendorName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{formatCurrency(order.totalPrice)}</p>
                      <span className={`text-sm capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 