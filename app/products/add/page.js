'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Package, 
  Loader2, 
  AlertCircle,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerKg: '',
    availableQty: '',
    unit: 'kg',
    categoryId: '',
    imageUrl: '',
    minOrderQty: '1',
    maxOrderQty: '',
    isLocalDelivery: true,
    deliveryRadius: '',
    deliveryFee: '0',
    bulkPricing: {
      '5kg': '',
      '10kg': '',
      '25kg': ''
    }
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage({
        file,
        preview: e.target.result
      });
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return null;

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imageData: selectedImage.preview,
          fileName: selectedImage.file.name
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      return data.imageUrl;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      // Upload image if selected
      let imageUrl = formData.imageUrl;
      if (selectedImage) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setLoading(false);
          return;
        }
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          imageUrl
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Page Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/products"
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Add New Product</h1>
              <p className="text-gray-400">Create a new product for your catalog</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Price and Quantity Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price */}
              <div>
                <label htmlFor="pricePerKg" className="block text-sm font-medium text-gray-300 mb-2">
                  Price per Unit *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    type="number"
                    id="pricePerKg"
                    name="pricePerKg"
                    value={formData.pricePerKg}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Available Quantity */}
              <div>
                <label htmlFor="availableQty" className="block text-sm font-medium text-gray-300 mb-2">
                  Available Quantity *
                </label>
                <input
                  type="number"
                  id="availableQty"
                  name="availableQty"
                  value={formData.availableQty}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>

              {/* Unit */}
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-300 mb-2">
                  Unit *
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  required
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="ton">Ton</option>
                  <option value="piece">Piece</option>
                  <option value="dozen">Dozen</option>
                  <option value="litre">Litre (L)</option>
                  <option value="ml">Millilitre (ml)</option>
                  <option value="quintal">Quintal</option>
                </select>
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">
                  No categories found. Please{' '}
                  <Link href="/categories/add" className="text-blue-400 hover:text-blue-300">
                    create a category
                  </Link>{' '}
                  first.
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Product Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your product (quality, usage, etc.)"
              />
            </div>

            {/* Order Quantities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="minOrderQty" className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Order Quantity
                </label>
                <input
                  type="number"
                  id="minOrderQty"
                  name="minOrderQty"
                  value={formData.minOrderQty}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1"
                />
              </div>
              <div>
                <label htmlFor="maxOrderQty" className="block text-sm font-medium text-gray-300 mb-2">
                  Maximum Order Quantity (Optional)
                </label>
                <input
                  type="number"
                  id="maxOrderQty"
                  name="maxOrderQty"
                  value={formData.maxOrderQty}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="No limit"
                />
              </div>
            </div>

            {/* Bulk Pricing */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bulk Pricing (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(formData.bulkPricing).map(([quantity, price]) => (
                  <div key={quantity}>
                    <label className="block text-xs text-gray-400 mb-1">
                      {quantity} - Price per {formData.unit}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">₹</span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            bulkPricing: {
                              ...prev.bulkPricing,
                              [quantity]: e.target.value
                            }
                          }));
                        }}
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Leave blank if no bulk discount is offered
              </p>
            </div>

            {/* Delivery Options */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Delivery Options
              </label>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isLocalDelivery"
                    name="isLocalDelivery"
                    checked={formData.isLocalDelivery}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        isLocalDelivery: e.target.checked
                      }));
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="isLocalDelivery" className="ml-2 text-sm text-gray-300">
                    Offer local delivery
                  </label>
                </div>
                
                {formData.isLocalDelivery && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="deliveryRadius" className="block text-sm font-medium text-gray-300 mb-2">
                        Delivery Radius (km)
                      </label>
                      <input
                        type="number"
                        id="deliveryRadius"
                        name="deliveryRadius"
                        value={formData.deliveryRadius}
                        onChange={handleInputChange}
                        step="0.1"
                        min="0"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <label htmlFor="deliveryFee" className="block text-sm font-medium text-gray-300 mb-2">
                        Delivery Fee (₹)
                      </label>
                      <input
                        type="number"
                        id="deliveryFee"
                        name="deliveryFee"
                        value={formData.deliveryFee}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Image
              </label>
              
              {/* Image Preview */}
              {selectedImage && (
                <div className="mb-4 relative">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-600">
                    <img
                      src={selectedImage.preview}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {selectedImage.file.name} ({(selectedImage.file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}

              {/* Upload Area */}
              {!selectedImage && (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-white mb-2">
                        Upload Product Image
                      </p>
                      <p className="text-gray-400 mb-4">
                        Drag and drop an image here, or click to browse
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Choose File
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>
                </div>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />

              {/* Manual URL Input (Fallback) */}
              <div className="mt-4">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-2">
                  Or provide image URL
                </label>
                <div className="relative">
                  <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Optional: Provide a URL to an image of your product
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center gap-4 pt-6">
              <button
                type="submit"
                disabled={loading || uploading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading || uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {uploading ? 'Uploading Image...' : 'Creating Product...'}
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5" />
                    Create Product
                  </>
                )}
              </button>
              
              <Link
                href="/products"
                className="px-8 py-3 border border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 