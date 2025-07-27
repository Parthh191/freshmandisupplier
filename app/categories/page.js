'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  AlertCircle,
  ArrowLeft,
  Search,
  Filter
} from 'lucide-react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
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

      const response = await fetch('/api/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      } else {
        setError('Failed to load categories')
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setCategories(categories.filter(cat => cat.id !== categoryId))
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete category')
      }
    } catch (err) {
      console.error('Error deleting category:', err)
      alert('Failed to delete category')
    }
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading categories...</p>
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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-bold text-white">Categories</h1>
              <p className="text-gray-300 text-lg">Manage your product categories</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Actions */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg p-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">{filteredCategories.length} categories</span>
              </div>
              <Link
                href="/categories/add"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Categories List */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-gray-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-300 mb-4">
              {categories.length === 0 ? 'No categories yet' : 'No categories found'}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {categories.length === 0 
                ? "Create your first category to start organizing your products."
                : "No categories match your search criteria."
              }
            </p>
            {categories.length === 0 && (
              <Link 
                href="/categories/add" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Category
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map(category => (
              <div key={category.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                      <p className="text-sm text-gray-400">
                        {category._count?.products || 0} products
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/categories/${category.id}/edit`}
                      className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600/50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Created</span>
                    <span className="text-white">
                      {new Date(category.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <Link
                    href={`/products?category=${category.id}`}
                    className="w-full bg-gray-700/50 text-white py-2 rounded-lg hover:bg-gray-600/50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Package className="w-4 h-4" />
                    <span>View Products</span>
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