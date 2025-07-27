'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Edit,
  Save,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Camera,
  Globe,
  Calendar,
  Package,
  ShoppingCart,
  BarChart3
} from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.supplier || data.vendor);
      setFormData({
        name: data.supplier?.user?.name || data.vendor?.user?.name || '',
        email: data.supplier?.user?.email || data.vendor?.user?.email || '',
        phone: data.supplier?.user?.phone || data.vendor?.user?.phone || '',
        businessName: data.supplier?.businessName || data.vendor?.mandiName || '',
        location: data.supplier?.location || data.vendor?.location || '',
        latitude: data.supplier?.latitude || data.vendor?.latitude || '',
        longitude: data.supplier?.longitude || data.vendor?.longitude || ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      const data = await response.json();
      setProfile(data.supplier || data.vendor);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Update localStorage user data
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: profile?.user?.name || '',
      email: profile?.user?.email || '',
      phone: profile?.user?.phone || '',
      businessName: profile?.businessName || profile?.mandiName || '',
      location: profile?.location || '',
      latitude: profile?.latitude || '',
      longitude: profile?.longitude || ''
    });
    setIsEditing(false);
    setError('');
  };

  const getStats = () => {
    if (!profile) return [];
    
    const isSupplier = profile.user?.userType?.type === 'supplier';
    
    if (isSupplier) {
      return [
        {
          label: 'Total Products',
          value: profile._count?.products || 0,
          icon: Package,
          color: 'text-blue-400'
        },
        {
          label: 'Total Categories',
          value: profile.categories?.length || 0,
          icon: BarChart3,
          color: 'text-green-400'
        },
        {
          label: 'Total Orders',
          value: profile._count?.orders || 0,
          icon: ShoppingCart,
          color: 'text-purple-400'
        }
      ];
    } else {
      return [
        {
          label: 'Total Orders',
          value: profile._count?.orders || 0,
          icon: ShoppingCart,
          color: 'text-blue-400'
        },
        {
          label: 'Active Products',
          value: profile._count?.products || 0,
          icon: Package,
          color: 'text-green-400'
        }
      ];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="pt-20 pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="pt-20 pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Failed to load profile</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                onClick={fetchProfile}
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

  const stats = getStats();
  const isSupplier = profile?.user?.userType?.type === 'supplier';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Page Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
              <p className="text-gray-400">Manage your account information and business details</p>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={cancelEdit}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-400">{success}</p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-700/30 rounded-lg">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-white">{profile?.user?.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-700/30 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-white">{profile?.user?.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-700/30 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-white">{profile?.user?.phone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Account Type
                    </label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-700/30 rounded-lg">
                      <Building className="w-5 h-5 text-gray-400" />
                      <span className="text-white capitalize">{profile?.user?.userType?.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-6">
                {isSupplier ? 'Business Information' : 'Mandi Information'}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      {isSupplier ? 'Business Name' : 'Mandi Name'}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={isSupplier ? 'Enter business name' : 'Enter mandi name'}
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-700/30 rounded-lg">
                        <Building className="w-5 h-5 text-gray-400" />
                        <span className="text-white">{profile?.businessName || profile?.mandiName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your location"
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-700/30 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-white">{profile?.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Latitude (Optional)
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter latitude"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Longitude (Optional)
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter longitude"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Statistics */}
            {stats.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-semibold text-white mb-6">Account Statistics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        <span className="text-gray-400 text-sm">{stat.label}</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {profile?.user?.name}
                </h3>
                <p className="text-gray-400 capitalize">
                  {profile?.user?.userType?.type}
                </p>
                
                {isEditing && (
                  <button className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto cursor-pointer">
                    <Camera className="w-4 h-4" />
                    Change Photo
                  </button>
                )}
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Member Since</p>
                    <p className="text-white">
                      {new Date(profile?.user?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Account Status</p>
                    <p className="text-green-400">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/settings')}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Account Settings
                </button>
                <button
                  onClick={() => router.push('/notifications')}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Notification Preferences
                </button>
                {isSupplier && (
                  <button
                    onClick={() => router.push('/products/add')}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Add New Product
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 