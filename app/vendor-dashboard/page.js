'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  MapPin, 
  Clock, 
  AlertTriangle,
  Loader2,
  Plus,
  Search,
  Filter
} from 'lucide-react';

export default function VendorDashboardPage() {
  const [vendor, setVendor] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [nearbySuppliers, setNearbySuppliers] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);
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

      // Fetch vendor profile
      const profileResponse = await fetch('/api/vendor/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setVendor(profileData.vendor);
      }

      // Fetch recent orders
      const ordersResponse = await fetch('/api/vendor/orders?limit=5', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setRecentOrders(ordersData.orders || []);
      }

      // Fetch nearby suppliers (mock data for now)
      setNearbySuppliers([
        { id: 1, name: 'Fresh Farms', distance: '2.5km', rating: 4.5, products: 45 },
        { id: 2, name: 'Local Market', distance: '3.8km', rating: 4.2, products: 32 },
        { id: 3, name: 'Quality Supplies', distance: '5.2km', rating: 4.7, products: 28 }
      ]);

      // Mock price alerts
      setPriceAlerts([
        { id: 1, product: 'Wheat Flour', oldPrice: 35, newPrice: 32, supplier: 'Fresh Farms' },
        { id: 2, product: 'Fresh Tomatoes', oldPrice: 40, newPrice: 35, supplier: 'Local Market' }
      ]);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'confirmed': return 'text-blue-400';
      case 'ready': return 'text-green-400';
      case 'picked': return 'text-purple-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
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
      {/* Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Street Food Vendor Dashboard</h1>
              <p className="text-gray-400 mt-2">
                Welcome back, {vendor?.businessName || 'Vendor'}! Manage your supplies and track your business.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/marketplace"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-5 h-5" />
                Find Supplies
              </Link>
              <Link
                href="/vendor-orders"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                My Orders
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{vendor?.totalOrders || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Monthly Spending</p>
                  <p className="text-2xl font-bold text-white">₹{vendor?.monthlySpending || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Nearby Suppliers</p>
                  <p className="text-2xl font-bold text-white">{nearbySuppliers.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Price Alerts</p>
                  <p className="text-2xl font-bold text-white">{priceAlerts.length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
                  <Link
                    href="/vendor-orders"
                    className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
                  >
                    View All
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No orders yet</p>
                    <Link
                      href="/marketplace"
                      className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer mt-2 inline-block"
                    >
                      Start shopping for supplies
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Order #{order.id.slice(-8)}</p>
                            <p className="text-gray-400 text-sm">₹{order.totalAmount}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </p>
                          <p className="text-gray-400 text-sm">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Nearby Suppliers */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Nearby Suppliers</h3>
                <div className="space-y-3">
                  {nearbySuppliers.map((supplier) => (
                    <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{supplier.name}</p>
                        <p className="text-gray-400 text-sm">{supplier.distance} • {supplier.products} products</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-white text-sm">{supplier.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/marketplace"
                  className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer mt-4 inline-block"
                >
                  View all suppliers
                </Link>
              </div>

              {/* Price Alerts */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Price Alerts</h3>
                <div className="space-y-3">
                  {priceAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-white font-medium">{alert.product}</p>
                      <p className="text-gray-400 text-sm">
                        ₹{alert.oldPrice} → ₹{alert.newPrice} at {alert.supplier}
                      </p>
                    </div>
                  ))}
                </div>
                {priceAlerts.length === 0 && (
                  <p className="text-gray-400 text-sm">No price alerts</p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/marketplace"
                    className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors cursor-pointer"
                  >
                    <Search className="w-5 h-5 text-blue-400" />
                    <span className="text-white">Find Supplies</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <Package className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Update Profile</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 