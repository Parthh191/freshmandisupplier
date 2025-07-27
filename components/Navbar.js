'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Store, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Bell,
  Search,
  Home,
  Plus,
  Users,
  Truck
} from 'lucide-react';
import { cn } from '../lib/utils';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if current page is auth page
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        handleLogout();
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
    router.push('/login');
  };

  // Don't render navbar on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FreshMandi</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* Supplier Navigation */}
                {user?.userType?.type === 'supplier' && (
                  <>
                    <Link 
                      href="/dashboard" 
                      className={cn(
                        "text-gray-300 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer",
                        pathname === '/dashboard' && "text-blue-400"
                      )}
                    >
                      <Home className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    
                    <Link 
                      href="/products" 
                      className={cn(
                        "text-gray-300 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer",
                        pathname === '/products' && "text-blue-400"
                      )}
                    >
                      <Package className="w-4 h-4" />
                      <span>My Products</span>
                    </Link>
                    
                    <Link 
                      href="/products/add" 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Product</span>
                    </Link>
                    
                    <Link 
                      href="/orders" 
                      className={cn(
                        "text-gray-300 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer",
                        pathname === '/orders' && "text-blue-400"
                      )}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Orders</span>
                    </Link>
                    
                    <Link 
                      href="/analytics" 
                      className={cn(
                        "text-gray-300 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer",
                        pathname === '/analytics' && "text-blue-400"
                      )}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Analytics</span>
                    </Link>
                  </>
                )}

                {/* Vendor Navigation */}
                {user?.userType?.type === 'vendor' && (
                  <>
                    <Link 
                      href="/dashboard" 
                      className={cn(
                        "text-gray-300 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer",
                        pathname === '/dashboard' && "text-blue-400"
                      )}
                    >
                      <Home className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    
                    <Link 
                      href="/marketplace" 
                      className={cn(
                        "text-gray-300 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer",
                        pathname === '/marketplace' && "text-blue-400"
                      )}
                    >
                      <Store className="w-4 h-4" />
                      <span>Marketplace</span>
                    </Link>
                    
                    <Link 
                      href="/orders" 
                      className={cn(
                        "text-gray-300 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer",
                        pathname === '/orders' && "text-blue-400"
                      )}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>
                    
                    <Link 
                      href="/suppliers" 
                      className={cn(
                        "text-gray-300 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer",
                        pathname === '/suppliers' && "text-blue-400"
                      )}
                    >
                      <Users className="w-4 h-4" />
                      <span>Suppliers</span>
                    </Link>
                  </>
                )}

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56"
                  />
                </div>

                {/* Notifications */}
                <NotificationDropdown />

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span>{user?.name}</span>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-white font-medium">{user?.name}</p>
                        <p className="text-gray-400 text-sm capitalize">{user?.userType?.type}</p>
                      </div>
                      
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/settings" 
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </div>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Unauthenticated Navigation
              <>
                <Link 
                  href="/" 
                  className={cn(
                    "text-gray-300 hover:text-white transition-colors cursor-pointer",
                    pathname === '/' && "text-blue-400"
                  )}
                >
                  Home
                </Link>
                
                <Link 
                  href="/marketplace" 
                  className={cn(
                    "text-gray-300 hover:text-white transition-colors cursor-pointer",
                    pathname === '/marketplace' && "text-blue-400"
                  )}
                >
                  Marketplace
                </Link>
                
                <Link 
                  href="/about" 
                  className={cn(
                    "text-gray-300 hover:text-white transition-colors cursor-pointer",
                    pathname === '/about' && "text-blue-400"
                  )}
                >
                  About
                </Link>
                
                <Link 
                  href="/contact" 
                  className={cn(
                    "text-gray-300 hover:text-white transition-colors cursor-pointer",
                    pathname === '/contact' && "text-blue-400"
                  )}
                >
                  Contact
                </Link>
                
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/login" 
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Tablet Navigation (Medium screens) */}
          <div className="hidden md:flex lg:hidden items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Supplier Navigation for Tablet */}
                {user?.userType?.type === 'supplier' && (
                  <>
                    <Link 
                      href="/dashboard" 
                      className={cn(
                        "text-gray-300 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer",
                        pathname === '/dashboard' && "text-blue-400"
                      )}
                    >
                      <Home className="w-4 h-4" />
                      <span className="text-sm">Dashboard</span>
                    </Link>
                    
                    <Link 
                      href="/products" 
                      className={cn(
                        "text-gray-300 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer",
                        pathname === '/products' && "text-blue-400"
                      )}
                    >
                      <Package className="w-4 h-4" />
                      <span className="text-sm">Products</span>
                    </Link>
                    
                    <Link 
                      href="/products/add" 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Add</span>
                    </Link>
                    
                    <Link 
                      href="/orders" 
                      className={cn(
                        "text-gray-300 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer",
                        pathname === '/orders' && "text-blue-400"
                      )}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-sm">Orders</span>
                    </Link>
                    
                    <Link 
                      href="/analytics" 
                      className={cn(
                        "text-gray-300 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer",
                        pathname === '/analytics' && "text-blue-400"
                      )}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-sm">Analytics</span>
                    </Link>
                  </>
                )}

                {/* Vendor Navigation for Tablet */}
                {user?.userType?.type === 'vendor' && (
                  <>
                    <Link 
                      href="/dashboard" 
                      className={cn(
                        "text-gray-300 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer",
                        pathname === '/dashboard' && "text-blue-400"
                      )}
                    >
                      <Home className="w-4 h-4" />
                      <span className="text-sm">Dashboard</span>
                    </Link>
                    
                    <Link 
                      href="/marketplace" 
                      className={cn(
                        "text-gray-300 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer",
                        pathname === '/marketplace' && "text-blue-400"
                      )}
                    >
                      <Store className="w-4 h-4" />
                      <span className="text-sm">Market</span>
                    </Link>
                    
                    <Link 
                      href="/orders" 
                      className={cn(
                        "text-gray-300 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer",
                        pathname === '/orders' && "text-blue-400"
                      )}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-sm">Orders</span>
                    </Link>
                    
                    <Link 
                      href="/suppliers" 
                      className={cn(
                        "text-gray-300 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer",
                        pathname === '/suppliers' && "text-blue-400"
                      )}
                    >
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Suppliers</span>
                    </Link>
                  </>
                )}

                {/* Search Bar for Tablet */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32"
                  />
                </div>

                {/* Notifications for Tablet */}
                <NotificationDropdown />

                {/* Profile for Tablet */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-white font-medium">{user?.name}</p>
                        <p className="text-gray-400 text-sm capitalize">{user?.userType?.type}</p>
                      </div>
                      
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/settings" 
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </div>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Unauthenticated Navigation for Tablet
              <>
                <Link 
                  href="/" 
                  className={cn(
                    "text-gray-300 hover:text-white transition-colors cursor-pointer",
                    pathname === '/' && "text-blue-400"
                  )}
                >
                  Home
                </Link>
                
                <Link 
                  href="/marketplace" 
                  className={cn(
                    "text-gray-300 hover:text-white transition-colors cursor-pointer",
                    pathname === '/marketplace' && "text-blue-400"
                  )}
                >
                  Marketplace
                </Link>
                
                <Link 
                  href="/login" 
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  {/* Mobile Supplier Navigation */}
                  {user?.userType?.type === 'supplier' && (
                    <>
                      <Link 
                        href="/dashboard" 
                        className={cn(
                          "block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors cursor-pointer",
                          pathname === '/dashboard' && "bg-gray-700 text-white"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Home className="w-4 h-4" />
                          <span>Dashboard</span>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/products" 
                        className={cn(
                          "block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors cursor-pointer",
                          pathname === '/products' && "bg-gray-700 text-white"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4" />
                          <span>My Products</span>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/products/add" 
                        className="block px-3 py-2 bg-blue-600 text-white rounded-md transition-colors cursor-pointer"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>Add Product</span>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/orders" 
                        className={cn(
                          "block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors cursor-pointer",
                          pathname === '/orders' && "bg-gray-700 text-white"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <ShoppingCart className="w-4 h-4" />
                          <span>Orders</span>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/analytics" 
                        className={cn(
                          "block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors cursor-pointer",
                          pathname === '/analytics' && "bg-gray-700 text-white"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4" />
                          <span>Analytics</span>
                        </div>
                      </Link>
                    </>
                  )}

                  {/* Mobile Vendor Navigation */}
                  {user?.userType?.type === 'vendor' && (
                    <>
                      <Link 
                        href="/dashboard" 
                        className={cn(
                          "block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors cursor-pointer",
                          pathname === '/dashboard' && "bg-gray-700 text-white"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Home className="w-4 h-4" />
                          <span>Dashboard</span>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/marketplace" 
                        className={cn(
                          "block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors cursor-pointer",
                          pathname === '/marketplace' && "bg-gray-700 text-white"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Store className="w-4 h-4" />
                          <span>Marketplace</span>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/orders" 
                        className={cn(
                          "block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors cursor-pointer",
                          pathname === '/orders' && "bg-gray-700 text-white"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <ShoppingCart className="w-4 h-4" />
                          <span>My Orders</span>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/suppliers" 
                        className={cn(
                          "block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors cursor-pointer",
                          pathname === '/suppliers' && "bg-gray-700 text-white"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>Suppliers</span>
                        </div>
                      </Link>
                    </>
                  )}

                  {/* Mobile Profile Section */}
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="px-3 py-2">
                      <p className="text-white font-medium">{user?.name}</p>
                      <p className="text-gray-400 text-sm capitalize">{user?.userType?.type}</p>
                    </div>
                    
                    <Link 
                      href="/profile" 
                      className="block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </div>
                    </Link>
                    
                    <Link 
                      href="/settings" 
                      className="block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </div>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                // Mobile Unauthenticated Navigation
                <>
                  <Link 
                    href="/" 
                    className={cn(
                      "block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors cursor-pointer",
                      pathname === '/' && "bg-gray-700 text-white"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  
                  <Link 
                    href="/marketplace" 
                    className={cn(
                      "block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors cursor-pointer",
                      pathname === '/marketplace' && "bg-gray-700 text-white"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Marketplace
                  </Link>
                  
                  <Link 
                    href="/about" 
                    className={cn(
                      "block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors cursor-pointer",
                      pathname === '/about' && "bg-gray-700 text-white"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  
                  <Link 
                    href="/contact" 
                    className={cn(
                      "block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors cursor-pointer",
                      pathname === '/contact' && "bg-gray-700 text-white"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  
                  <div className="border-t border-gray-700 pt-4 mt-4 space-y-2">
                    <Link 
                      href="/login" 
                      className="block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup" 
                      className="block px-3 py-2 bg-blue-600 text-white rounded-md transition-colors cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 