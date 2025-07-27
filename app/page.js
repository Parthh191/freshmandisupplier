'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Package, 
  ShoppingCart, 
  MapPin, 
  Star, 
  Users, 
  TrendingUp, 
  Shield, 
  Truck, 
  Clock,
  CheckCircle,
  Play,
  Phone,
  Mail,
  MessageCircle,
  Zap,
  Target,
  Globe,
  Award,
  Heart
} from 'lucide-react';

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  };

  const stats = [
    { number: '500+', label: 'Active Suppliers', icon: Package },
    { number: '2000+', label: 'Street Food Vendors', icon: Users },
    { number: '50+', label: 'Cities Covered', icon: MapPin },
    { number: '4.8', label: 'Average Rating', icon: Star }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Orders',
      description: 'Order supplies in minutes, not hours. Get your ingredients delivered to your doorstep.'
    },
    {
      icon: Target,
      title: 'Bulk Pricing',
      description: 'Save money with volume discounts. The more you buy, the more you save.'
    },
    {
      icon: MapPin,
      title: 'Local Delivery',
      description: 'Find suppliers near you. Quick delivery within your area.'
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'All products are quality checked. Fresh and authentic ingredients.'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Order anytime, anywhere. Your marketplace never sleeps.'
    },
    {
      icon: TrendingUp,
      title: 'Business Growth',
      description: 'Track your spending, manage inventory, and grow your business.'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Chaat Vendor, Mumbai',
      content: 'FreshMandi has transformed my business. I get fresh ingredients delivered daily at wholesale prices.',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Dosa Stall Owner, Bangalore',
      content: 'The bulk pricing saves me 30% on my monthly supplies. Highly recommended for street food vendors!',
      rating: 5
    },
    {
      name: 'Amit Patel',
      role: 'Restaurant Supplier, Delhi',
      content: 'Great platform to reach more vendors. My business has grown 50% since joining FreshMandi.',
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              FreshMandi
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Street Food Supply Chain
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect street food vendors with quality suppliers. Get fresh ingredients, 
              equipment, and packaging at wholesale prices with local delivery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/signup"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/marketplace"
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-700/50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Browse Marketplace
                  </Link>
                </>
              ) : (
                <Link
                  href={user?.userType?.type === 'vendor' ? '/vendor-dashboard' : '/dashboard'}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose FreshMandi?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The ultimate platform for street food vendors and suppliers. 
              Streamlined supply chain, better prices, and local delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 group">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Vendors Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                For Street Food Vendors
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Get everything you need to run your street food business efficiently. 
                From fresh ingredients to cooking equipment and packaging materials.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Bulk pricing on all supplies</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Local delivery within hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Quality assured products</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Track orders and spending</span>
                </div>
              </div>

              <Link
                href="/signup"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 inline-flex items-center gap-2"
              >
                Start Ordering
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl p-8 border border-green-500/30">
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-5 h-5 text-green-400" />
                      <span className="text-white font-medium">Raw Materials</span>
                    </div>
                    <p className="text-gray-400 text-sm">Flour, rice, spices, oils</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Truck className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Equipment</span>
                    </div>
                    <p className="text-gray-400 text-sm">Tawa, kadai, utensils</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <ShoppingCart className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-medium">Packaging</span>
                    </div>
                    <p className="text-gray-400 text-sm">Plates, bags, containers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Suppliers Section */}
      <section className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl p-8 border border-blue-500/30">
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Business Growth</span>
                    </div>
                    <p className="text-gray-400 text-sm">Reach more customers</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-medium">Vendor Network</span>
                    </div>
                    <p className="text-gray-400 text-sm">2000+ active vendors</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-medium">Quality Recognition</span>
                    </div>
                    <p className="text-gray-400 text-sm">Build your brand</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-white mb-6">
                For Suppliers & Farmers
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Expand your reach and grow your business. Connect with thousands of 
                street food vendors who need quality supplies daily.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Reach 2000+ vendors</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Manage inventory easily</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Set your own prices</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Track sales and analytics</span>
                </div>
              </div>

              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 inline-flex items-center gap-2"
              >
                Start Selling
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands of satisfied vendors and suppliers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
                <div className="flex items-center gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of street food vendors and suppliers who are already 
            growing their business with FreshMandi.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/marketplace"
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-700/50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Explore Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">FreshMandi</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                The ultimate platform connecting street food vendors with quality suppliers. 
                Fresh ingredients, equipment, and packaging at wholesale prices.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-400" />
                </div>
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">For Vendors</h4>
              <ul className="space-y-2">
                <li><Link href="/marketplace" className="text-gray-400 hover:text-white transition-colors">Browse Products</Link></li>
                <li><Link href="/signup" className="text-gray-400 hover:text-white transition-colors">Create Account</Link></li>
                <li><Link href="/vendor-dashboard" className="text-gray-400 hover:text-white transition-colors">Vendor Dashboard</Link></li>
                <li><Link href="/vendor-orders" className="text-gray-400 hover:text-white transition-colors">Order History</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">For Suppliers</h4>
              <ul className="space-y-2">
                <li><Link href="/signup" className="text-gray-400 hover:text-white transition-colors">Join as Supplier</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Supplier Dashboard</Link></li>
                <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">Manage Products</Link></li>
                <li><Link href="/orders" className="text-gray-400 hover:text-white transition-colors">View Orders</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 FreshMandi. All rights reserved.
            </p>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-gray-400 text-sm">Made for Indian Street Food Vendors</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
