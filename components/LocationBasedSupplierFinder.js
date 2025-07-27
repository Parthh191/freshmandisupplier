'use client';

import { useState, useEffect } from 'react';
import { MapPin, Search, Loader2, Star } from 'lucide-react';

export default function LocationBasedSupplierFinder() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(10);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const findNearbySuppliers = async () => {
    if (!userLocation) {
      alert('Please allow location access to find nearby suppliers');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/marketplace/products?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radius}`);
      if (response.ok) {
        const data = await response.json();
        
        // Group products by supplier
        const supplierMap = new Map();
        data.products.forEach(product => {
          if (!supplierMap.has(product.supplier.id)) {
            supplierMap.set(product.supplier.id, {
              ...product.supplier,
              products: [],
              totalProducts: 0
            });
          }
          supplierMap.get(product.supplier.id).products.push(product);
          supplierMap.get(product.supplier.id).totalProducts++;
        });
        
        setSuppliers(Array.from(supplierMap.values()));
      }
    } catch (error) {
      console.error('Error finding suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Find Nearby Suppliers</h3>
      </div>

      <div className="space-y-4">
        {/* Location Status */}
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${userLocation ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm text-gray-300">
            {userLocation ? 'Location detected' : 'Location not available'}
          </span>
        </div>

        {/* Radius Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Search Radius: {radius} km
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={findNearbySuppliers}
          disabled={!userLocation || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          {loading ? 'Searching...' : 'Find Suppliers'}
        </button>

        {/* Results */}
        {suppliers.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-white mb-4">
              Found {suppliers.length} suppliers nearby
            </h4>
            <div className="space-y-3">
              {suppliers.map((supplier) => {
                const distance = userLocation ? 
                  calculateDistance(userLocation.lat, userLocation.lng, supplier.latitude, supplier.longitude) : 
                  'N/A';
                
                return (
                  <div key={supplier.id} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="text-white font-medium">{supplier.businessName}</h5>
                        <p className="text-gray-400 text-sm">{supplier.location}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{distance} km away</span>
                          <span>{supplier.totalProducts} products</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm">4.5</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
} 