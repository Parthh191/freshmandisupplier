'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  MapPin, 
  Package,
  User,
  LogIn,
  Plus,
  Minus,
  Loader2,
  Grid3X3,
  List,
  SlidersHorizontal
} from 'lucide-react'

export default function MarketplacePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [cart, setCart] = useState({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    checkAuthStatus()
    loadCart()
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
      
      // Get vendor location if available
      let url = '/api/marketplace/products'
      const token = localStorage.getItem('token')
      
      if (token && user?.vendor?.latitude && user?.vendor?.longitude) {
        url += `?lat=${user.vendor.latitude}&lng=${user.vendor.longitude}&radius=10`
      }
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/marketplace/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const addToCart = (productId, quantity = 1) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart')
      router.push('/login')
      return
    }

    const newCart = { ...cart, [productId]: (cart[productId] || 0) + quantity }
    setCart(newCart)
    localStorage.setItem('marketplace-cart', JSON.stringify(newCart))
  }

  const removeFromCart = (productId) => {
    const newCart = { ...cart }
    if (newCart[productId] > 1) {
      newCart[productId] -= 1
    } else {
      delete newCart[productId]
    }
    setCart(newCart)
    localStorage.setItem('marketplace-cart', JSON.stringify(newCart))
  }

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  }

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId)
      return total + (product?.pricePerKg * quantity || 0)
    }, 0)
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Please login to place an order')
      router.push('/login')
      return
    }

    if (Object.keys(cart).length === 0) {
      alert('Your cart is empty')
      return
    }

    router.push('/marketplace/checkout')
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier?.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category?.name === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      
      {/* Search and Filter */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products or suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Summary */}
      {Object.keys(cart).length > 0 && (
        <div className="bg-blue-600/20 border-b border-blue-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300">
                  {getCartItemCount()} items in cart • Total: {formatCurrency(getCartTotal())}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading products...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {filteredProducts.length} products found
              </h2>
              <p className="text-gray-400">Browse our collection of fresh agricultural products</p>
            </div>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-200 group">
                    {product.imageUrl && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-white text-xs font-medium">4.5</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {product.name}
                        </h3>
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-3">
                        {product.supplier?.businessName}
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{product.supplier?.location || 'Location not specified'}</span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-400">
                            {formatCurrency(product.pricePerKg)}
                          </span>
                          <span className="text-sm text-gray-500">per {product.unit}</span>
                        </div>
                        
                        {/* Bulk Pricing */}
                        {product.bulkPricing && Object.keys(product.bulkPricing).length > 0 && (
                          <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <p className="text-xs text-blue-400 font-medium mb-1">Bulk Discounts:</p>
                            <div className="space-y-1">
                              {Object.entries(product.bulkPricing).map(([quantity, price]) => (
                                <div key={quantity} className="flex justify-between text-xs">
                                  <span className="text-gray-300">{quantity}:</span>
                                  <span className="text-green-400 font-medium">{formatCurrency(price)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Delivery Info */}
                        {product.isLocalDelivery && (
                          <div className="mt-2 flex items-center text-xs text-gray-400">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>Local delivery available</span>
                            {product.deliveryFee > 0 && (
                              <span className="ml-1">(+₹{product.deliveryFee})</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-400">
                          Available: {product.availableQty} {product.unit}
                        </span>
                        <span className="text-sm text-gray-500">
                          {product.category?.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {cart[product.id] ? (
                          <>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium text-white min-w-[2rem] text-center">{cart[product.id]}</span>
                            <button
                              onClick={() => addToCart(product.id, 1)}
                              className="p-2 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => addToCart(product.id, 1)}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-gray-600/50 transition-all duration-200">
                    <div className="flex items-center space-x-6">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-xl text-white mb-1">{product.name}</h3>
                            <p className="text-gray-400">{product.supplier?.businessName}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-400 mb-1">
                              {formatCurrency(product.pricePerKg)}
                            </div>
                            <span className="text-sm text-gray-500">per {product.unit}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{product.category?.name}</span>
                            <span>•</span>
                            <span>Available: {product.availableQty} {product.unit}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span>4.5</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {cart[product.id] ? (
                              <>
                                <button
                                  onClick={() => removeFromCart(product.id)}
                                  className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-medium text-white min-w-[2rem] text-center">{cart[product.id]}</span>
                                <button
                                  onClick={() => addToCart(product.id, 1)}
                                  className="p-2 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => addToCart(product.id, 1)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                <span>Add to Cart</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <Package className="w-20 h-20 text-gray-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-300 mb-4">No products found</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('')
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 