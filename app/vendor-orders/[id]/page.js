'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
  MapPin,
  User,
  Building,
  Phone,
  Mail,
  Star
} from 'lucide-react'

export default function VendorOrderDetailPage() {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    fetchOrderDetail()
  }, [params.id])

  const fetchOrderDetail = async () => {
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

      const response = await fetch(`/api/vendor/orders/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else {
        setError('Failed to load order details')
      }
    } catch (err) {
      console.error('Error fetching order details:', err)
      setError('Failed to load order details')
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
      case 'pending': return <Clock className="w-5 h-5" />
      case 'confirmed': return <CheckCircle className="w-5 h-5" />
      case 'ready': return <Package className="w-5 h-5" />
      case 'picked': return <Truck className="w-5 h-5" />
      case 'cancelled': return <XCircle className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400">{error || 'Order not found'}</p>
          <Link 
            href="/vendor-orders" 
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/vendor-orders" 
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Orders</span>
              </Link>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-bold text-white">Order Details</h1>
              <p className="text-gray-300 text-lg">#{order.id.slice(-8)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Order Status</h2>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-lg ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{getStatusText(order.status)}</h3>
                  <p className="text-gray-400">
                    {order.status === 'pending' && 'Your order is being processed by the supplier'}
                    {order.status === 'confirmed' && 'Your order has been confirmed and is being prepared'}
                    {order.status === 'ready' && 'Your order is ready for pickup'}
                    {order.status === 'picked' && 'Your order has been successfully picked up'}
                    {order.status === 'cancelled' && 'Your order has been cancelled'}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Order Items</h2>
              
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{item.productName}</h3>
                          <p className="text-gray-400">Product ID: {item.productId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">{formatCurrency(item.totalPrice)}</p>
                        <p className="text-gray-400">
                          {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Order Timeline</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">Order Placed</h3>
                    <p className="text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                
                {order.updatedAt && order.updatedAt !== order.createdAt && (
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">Order Updated</h3>
                      <p className="text-gray-400">{formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                )}
                
                {order.estimatedPickupTime && (
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">Estimated Pickup</h3>
                      <p className="text-gray-400">{formatDate(order.estimatedPickupTime)}</p>
                    </div>
                  </div>
                )}
                
                {order.actualPickupTime && (
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">Picked Up</h3>
                      <p className="text-gray-400">{formatDate(order.actualPickupTime)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID</span>
                  <span className="text-white font-medium">#{order.id.slice(-8)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Type</span>
                  <span className="text-white font-medium capitalize">{order.orderType}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Items</span>
                  <span className="text-white font-medium">{order.items.length} items</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-medium">{formatCurrency(order.totalAmount)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery Fee</span>
                  <span className="text-green-400 font-medium">Free</span>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-white">Total</span>
                    <span className="text-2xl font-bold text-green-400">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Order Actions</h3>
              
              <div className="space-y-3">
                {order.status === 'ready' && (
                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                    <Truck className="w-4 h-4" />
                    <span>Confirm Pickup</span>
                  </button>
                )}
                
                {order.status === 'pending' && (
                  <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Order</span>
                  </button>
                )}
                
                <Link 
                  href="/vendor-orders" 
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Orders</span>
                </Link>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Order Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Created</p>
                  <p className="text-white">{formatDate(order.createdAt)}</p>
                </div>
                
                {order.updatedAt && order.updatedAt !== order.createdAt && (
                  <div>
                    <p className="text-sm text-gray-400">Last Updated</p>
                    <p className="text-white">{formatDate(order.updatedAt)}</p>
                  </div>
                )}
                
                {order.estimatedPickupTime && (
                  <div>
                    <p className="text-sm text-gray-400">Estimated Pickup</p>
                    <p className="text-white">{formatDate(order.estimatedPickupTime)}</p>
                  </div>
                )}
                
                {order.actualPickupTime && (
                  <div>
                    <p className="text-sm text-gray-400">Actual Pickup</p>
                    <p className="text-white">{formatDate(order.actualPickupTime)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 