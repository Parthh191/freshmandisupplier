'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Truck,
  Shield
} from 'lucide-react'

export default function CheckoutPage() {
  const [cart, setCart] = useState({})
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
    loadCart()
    fetchProducts()
  }, [])

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        setUser(user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }

  const loadCart = () => {
    const savedCart = localStorage.getItem('marketplace-cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error parsing cart:', error)
      }
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/marketplace/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      const newCart = { ...cart }
      delete newCart[productId]
      setCart(newCart)
      localStorage.setItem('marketplace-cart', JSON.stringify(newCart))
    } else {
      const newCart = { ...cart, [productId]: newQuantity }
      setCart(newCart)
      localStorage.setItem('marketplace-cart', JSON.stringify(newCart))
    }
  }

  const getCartItems = () => {
    return Object.entries(cart).map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId)
      return { ...product, quantity }
    }).filter(item => item.id)
  }

  const getSubtotal = () => {
    return getCartItems().reduce((total, item) => {
      return total + (item.pricePerKg * item.quantity)
    }, 0)
  }

  const getTotal = () => {
    return getSubtotal()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      alert('Please login to place an order')
      router.push('/login')
      return
    }

    if (getCartItems().length === 0) {
      alert('Your cart is empty')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      const token = localStorage.getItem('token')
      const orderItems = getCartItems().map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))

      const response = await fetch('/api/vendor/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: orderItems })
      })

      if (response.ok) {
        setSuccess(true)
        // Clear cart
        localStorage.removeItem('marketplace-cart')
        setCart({})
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/vendor-dashboard')
        }, 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to place order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      setError('Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-8 backdrop-blur-sm">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-300 mb-6">
              Your order has been confirmed and is being processed. You'll receive updates on your order status.
            </p>
            <div className="flex flex-col space-y-3">
              <Link 
                href="/vendor-dashboard" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link 
                href="/marketplace" 
                className="border border-blue-600 text-blue-400 px-6 py-3 rounded-lg hover:bg-blue-600/10 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const cartItems = getCartItems()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <ShoppingCart className="w-20 h-20 text-gray-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-300 mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">
            Add some products to your cart before proceeding to checkout.
          </p>
          <Link 
            href="/marketplace" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <ShoppingCart className="w-6 h-6 text-blue-400" />
                <span>Order Summary</span>
              </h2>

              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                    <div className="flex items-center space-x-4">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-400 mb-2">{item.supplier?.businessName}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-green-400 font-semibold">
                              {formatCurrency(item.pricePerKg)} per {item.unit}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-white font-medium min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">
                              {formatCurrency(item.pricePerKg * item.quantity)}
                            </p>
                            <button
                              onClick={() => updateQuantity(item.id, 0)}
                              className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1 text-sm"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Total & Checkout */}
          <div className="space-y-6">
            {/* Order Total */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Order Total</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>{formatCurrency(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Delivery Fee</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span>{formatCurrency(getTotal())}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={submitting || cartItems.length === 0}
                className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Place Order</span>
                  </>
                )}
              </button>
            </div>

            {/* Order Benefits */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Order Benefits</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <Truck className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Free Delivery</p>
                    <p className="text-sm text-gray-400">Direct pickup from suppliers</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Quality Assured</p>
                    <p className="text-sm text-gray-400">Verified suppliers only</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Secure Payment</p>
                    <p className="text-sm text-gray-400">Pay on pickup</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 