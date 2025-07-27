'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  TrendingUp, 
  Users, 
  Shield, 
  Zap, 
  Globe,
  CheckCircle,
  ArrowRight,
  Star,
  Truck,
  BarChart3,
  ShoppingCart,
  Building,
  MapPin,
  Phone,
  Mail,
  Play
} from 'lucide-react';

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  };

  const features = [
    {
      icon: <Package className="w-8 h-8 text-blue-400" />,
      title: "Product Management",
      description: "Easily manage your product catalog with categories, pricing, and inventory tracking."
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-green-400" />,
      title: "Order Management",
      description: "Track incoming orders, update status, and manage customer relationships efficiently."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-400" />,
      title: "Analytics Dashboard",
      description: "Get detailed insights into your sales, revenue trends, and product performance."
    },
    {
      icon: <Users className="w-8 h-8 text-orange-400" />,
      title: "Vendor Network",
      description: "Connect with verified vendors across the agricultural marketplace."
    },
    {
      icon: <Shield className="w-8 h-8 text-red-400" />,
      title: "Secure Transactions",
      description: "Safe and secure payment processing with transparent order tracking."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Real-time Updates",
      description: "Instant notifications for new orders, status changes, and important updates."
    }
  ];

  const benefits = [
    "Expand your market reach across multiple regions",
    "Reduce operational costs with streamlined processes",
    "Access detailed analytics to optimize your business",
    "Build long-term relationships with reliable vendors",
    "Secure payment processing and order tracking",
    "24/7 platform availability for your business"
  ];

  const stats = [
    { number: "500+", label: "Active Suppliers" },
    { number: "1000+", label: "Products Listed" },
    { number: "₹50M+", label: "Total Transactions" },
    { number: "95%", label: "Satisfaction Rate" }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      business: "Fresh Farms Co.",
      location: "Punjab",
      rating: 5,
      comment: "FreshMandi has transformed our business. We've increased our sales by 300% and connected with vendors across India."
    },
    {
      name: "Priya Sharma",
      business: "Organic Harvest",
      location: "Maharashtra",
      rating: 5,
      comment: "The analytics dashboard helps us make data-driven decisions. The platform is incredibly user-friendly."
    },
    {
      name: "Amit Patel",
      business: "Green Valley Suppliers",
      location: "Gujarat",
      rating: 5,
      comment: "Excellent customer support and secure transactions. Highly recommended for any agricultural supplier."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
                         <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
               Grow Your
               <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Agricultural Business</span>
             </h1>
             <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
               Connect with verified vendors, manage your products efficiently, and scale your agricultural supply business with FreshMandi's comprehensive marketplace platform.
             </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center gap-2 cursor-pointer"
              >
                Start Selling Today
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center gap-2 cursor-pointer">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-16">
             <h2 className="text-4xl font-bold text-white mb-4">Everything You Need to Succeed</h2>
             <p className="text-xl text-gray-400 max-w-2xl mx-auto">
               FreshMandi's comprehensive platform provides all the tools and features you need to manage and grow your agricultural supply business.
             </p>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition-colors">
                <div className="mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                         <div>
               <h2 className="text-4xl font-bold text-white mb-6">Why Choose FreshMandi?</h2>
               <p className="text-xl text-gray-400 mb-8">
                 Join thousands of successful agricultural suppliers who have transformed their business with our platform.
               </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button
                  onClick={handleGetStarted}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Join Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Revenue Growth</h3>
                      <p className="text-gray-400 text-sm">Average 300% increase</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Vendor Network</h3>
                      <p className="text-gray-400 text-sm">500+ verified vendors</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Secure Platform</h3>
                      <p className="text-gray-400 text-sm">Bank-level security</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-16">
             <h2 className="text-4xl font-bold text-white mb-4">What Our Suppliers Say</h2>
             <p className="text-xl text-gray-400 max-w-2xl mx-auto">
               Hear from successful agricultural suppliers who have transformed their business with FreshMandi.
             </p>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-6 italic">"{testimonial.comment}"</p>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 font-semibold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.business} • {testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Grow Your Business?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of successful agricultural suppliers and start selling your products today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              href="/login"
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors cursor-pointer"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
