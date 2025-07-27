'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Package, 
  Save, 
  Loader2, 
  AlertCircle,
  ArrowLeft,
  CheckCircle
} from 'lucide-react'

export default function AddCategoryPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      setUser(user)

      // Redirect non-supplier users
      if (user.userType?.type !== 'supplier') {
        if (user.userType?.type === 'vendor') {
          router.push('/vendor-dashboard')
        } else {
          router.push('/login')
        }
        return
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create category')
      }

      setSuccess('Category created successfully!')
      setFormData({ name: '', description: '' })
      
      // Redirect to categories page after a short delay
      setTimeout(() => {
        router.push('/categories')
      }, 1500)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/categories" 
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Categories</span>
              </Link>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-bold text-white">Add Category</h1>
              <p className="text-gray-300 text-lg">Create a new product category</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">New Category</h2>
              <p className="text-gray-400">Organize your products with categories</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-400">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Vegetables, Fruits, Grains"
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                Choose a clear, descriptive name for your category
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Optional: Add a description to help organize your products..."
              />
              <p className="text-sm text-gray-400 mt-1">
                Provide additional details about this category (optional)
              </p>
            </div>

            {/* Example Categories */}
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Example Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">• Vegetables</div>
                <div className="text-gray-400">• Fruits</div>
                <div className="text-gray-400">• Grains & Cereals</div>
                <div className="text-gray-400">• Dairy Products</div>
                <div className="text-gray-400">• Spices & Herbs</div>
                <div className="text-gray-400">• Pulses & Legumes</div>
                <div className="text-gray-400">• Oil Seeds</div>
                <div className="text-gray-400">• Processed Foods</div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading || !formData.name.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Create Category</span>
                  </>
                )}
              </button>
              <Link
                href="/categories"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 