'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Save, 
  Edit, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Calendar,
  Package,
  ShoppingCart,
  Star,
  Award
} from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    businessName: '',
    location: '',
    latitude: '',
    longitude: ''
  })
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
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
      }

      const response = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        const profileData = data.supplier || data.vendor
        setProfile(profileData)
        setFormData({
          businessName: profileData.businessName || '',
          location: profileData.location || '',
          latitude: profileData.latitude?.toString() || '',
          longitude: profileData.longitude?.toString() || ''
        })
      } else {
        setError('Failed to load profile')
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const token = localStorage.getItem('token')
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        setSuccess('Profile updated successfully!')
        setEditing(false)
        
        // Update form data with new values
        setFormData({
          businessName: updatedProfile.businessName || '',
          location: updatedProfile.location || '',
          latitude: updatedProfile.latitude?.toString() || '',
          longitude: updatedProfile.longitude?.toString() || ''
        })
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update profile')
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setFormData({
      businessName: profile.businessName || '',
      location: profile.location || '',
      latitude: profile.latitude?.toString() || '',
      longitude: profile.longitude?.toString() || ''
    })
    setError('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400">Profile not found</p>
        </div>
      </div>
    )
  }

  const isVendor = user?.userType?.type === 'vendor'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
              <p className="text-gray-300 text-lg">Manage your business information</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isVendor 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {isVendor ? 'Vendor' : 'Supplier'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Building className="w-6 h-6 text-blue-400" />
                  <span>Business Information</span>
                </h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
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

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Business Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter business name"
                    />
                  ) : (
                    <p className="text-white font-medium">{profile.businessName || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter location"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <p className="text-white">{profile.location || 'Not set'}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Latitude
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter latitude"
                      />
                    ) : (
                      <p className="text-white">{profile.latitude || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Longitude
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter longitude"
                      />
                    ) : (
                      <p className="text-white">{profile.longitude || 'Not set'}</p>
                    )}
                  </div>
                </div>

                {editing && (
                  <div className="flex items-center space-x-4 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Info & Stats */}
          <div className="space-y-6">
            {/* User Information */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-400" />
                <span>Account Info</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="text-white font-medium">{user?.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <p className="text-white">{user?.email}</p>
                  </div>
                </div>
                
                {user?.phone && (
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <p className="text-white">{user.phone}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-white">
                      {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : 'Recently joined'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Stats */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5 text-green-400" />
                <span>Business Stats</span>
              </h3>
              
              <div className="space-y-4">
                {isVendor ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300">Total Orders</span>
                      </div>
                      <span className="text-white font-bold">{profile._count?.vendorOrders || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300">Quality Rating</span>
                      </div>
                      <span className="text-white font-bold">{profile.qualityRating || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-300">Status</span>
                      </div>
                      <span className={`font-bold ${profile.isVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                        {profile.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300">Products</span>
                      </div>
                      <span className="text-white font-bold">{profile._count?.products || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">Categories</span>
                      </div>
                      <span className="text-white font-bold">{profile._count?.categories || 0}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 