'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Eye, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  Loader2, 
  AlertCircle, 
  Calendar, 
  ArrowLeft,
  Filter,
  Search,
  Star,
  MapPin
} from 'lucide-react'

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      if (!token) {
        router.push('/login')
        return
      }

      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        setUser(user)

        // Redirect non-vendor users
        if (user.userType?.type !== 'vendor') {
          if (user.userType?.type === 'supplier') {
            router.push('/orders')
          } else {
            router.push('/login')
          }
          return
        }
      }

      const response = await fetch('/api/vendor/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        setError('Failed to load orders')
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'ready': return <Package className="w-4 h-4" />
      case 'picked': return <Truck className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10'
      case 'confirmed': return 'text-blue-400 bg-blue-400/10'
      case 'ready': return 'text-green-400 bg-green-400/10'
      case 'picked': return 'text-purple-400 bg-purple-400/10'
      case 'cancelled': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending'
      case 'confirmed': return 'Confirmed'
      case 'ready': return 'Ready for Pickup'
      case 'picked': return 'Picked Up'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = !statusFilter || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="ready">Ready</option>
                <option value="picked">Picked</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg p-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">{filteredOrders.length} orders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-20 h-20 text-gray-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-300 mb-4">No orders found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {orders.length === 0 
                ? "You haven't placed any orders yet. Start shopping to see your order history here."
                : "No orders match your current search criteria."
              }
            </p>
            {orders.length === 0 && (
              <Link 
                href="/marketplace" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Products
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-200">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Order #{order.id.slice(-8)}</h3>
                      <p className="text-gray-400">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map(item => (
                      <div key={item.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-white">{item.productName}</h5>
                              <p className="text-sm text-gray-400">
                                {item.quantity} × {formatCurrency(item.unitPrice)} per unit
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-white">{formatCurrency(item.totalPrice)}</p>
                            <p className="text-sm text-gray-400">{item.quantity} units</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-400">Order Type</span>
                    </div>
                    <p className="text-white font-medium capitalize">{order.orderType}</p>
                  </div>
                  
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <ShoppingCart className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-400">Total Items</span>
                    </div>
                    <p className="text-white font-medium">{order.items.length} items</p>
                  </div>
                  
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-gray-400">Order Value</span>
                    </div>
                    <p className="text-white font-medium">{formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Order ID: {order.id}</span>
                    <span>•</span>
                    <span>Created: {formatDate(order.createdAt)}</span>
                    {order.updatedAt && order.updatedAt !== order.createdAt && (
                      <>
                        <span>•</span>
                        <span>Updated: {formatDate(order.updatedAt)}</span>
                      </>
                    )}
                  </div>
                  <Link 
                    href={`/vendor-orders/${order.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
  )
} 