'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Package, Star, MapPin } from 'lucide-react';

export default function Marketplace() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Organic Wheat",
      price: 2500,
      unit: "per ton",
      supplier: "Green Farms Ltd",
      location: "Punjab, India",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Fresh Tomatoes",
      price: 45,
      unit: "per kg",
      supplier: "Fresh Harvest Co",
      location: "Maharashtra, India",
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Premium Rice",
      price: 3200,
      unit: "per ton",
      supplier: "Rice Valley Farms",
      location: "Haryana, India",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Sweet Corn",
      price: 35,
      unit: "per kg",
      supplier: "Corn Fields Inc",
      location: "Karnataka, India",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1601593768797-9acb5d1a0c9a?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      name: "Fresh Potatoes",
      price: 25,
      unit: "per kg",
      supplier: "Potato Paradise",
      location: "Uttar Pradesh, India",
      rating: 4.1,
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      name: "Organic Onions",
      price: 30,
      unit: "per kg",
      supplier: "Organic Valley",
      location: "Gujarat, India",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop"
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Page Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-gray-400">Discover fresh agricultural products from trusted suppliers</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products, suppliers, or categories..."
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Button */}
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 overflow-hidden group">
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-medium">{product.rating}</span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="flex items-center gap-1 text-gray-400 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{product.location}</span>
                </div>
                
                <p className="text-gray-400 text-sm mb-4">{product.supplier}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-white">₹{product.price}</span>
                    <span className="text-gray-400 text-sm ml-1">{product.unit}</span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg transition-colors">
            Load More Products
          </button>
        </div>
      </div>
    </div>
  );
} 