import { ShoppingCart, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../logo.webp";
import SearchBar from "./SearchBar";
import { Product } from "../types";
// Replace localStorage-based authService with Firebase auth service
import firebaseAuthService from "../services/firebaseAuthService";

interface HeaderProps {
  onNavigate: (page: string) => void;
  onToggleCart: () => void;
  cartItemCount?: number;
  products: Product[];
}

export default function Header({
  onNavigate,
  onToggleCart,
  cartItemCount = 0,
  products,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    setIsLoggedIn(firebaseAuthService.isAuthenticated());
  }, []);

  // Helper function to determine if a path is active
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate("/account");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[100px]">
            <Link
              to="/"
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img
                src={logo}
                alt="Delhi Selling logo"
                className="w-[100px] h-[100px] rounded-lg object-contain"
              />
            </Link>

            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <SearchBar products={products} />
            </div>

            <div className="flex items-center space-x-6">
              <button
                onClick={handleAccountClick}
                className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {isLoggedIn ? "Account" : "Login"}
                </span>
              </button>

              <button
                onClick={onToggleCart}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">
                  Cart
                </span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="md:hidden pb-3">
            <SearchBar products={products} isMobile />
          </div>
        </div>
      </div>

      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 h-12 overflow-x-auto scrollbar-hide">
            <Link
              to="/"
              className={`text-sm font-medium whitespace-nowrap transition-colors hover:text-blue-600 ${
                isActive("/") ? "text-blue-600" : "text-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`text-sm font-medium whitespace-nowrap transition-colors hover:text-blue-600 ${
                isActive("/products") ? "text-blue-600" : "text-gray-700"
              }`}
            >
              All Products
            </Link>
            <button
              onClick={() => onNavigate("categories")}
              className={`text-sm font-medium whitespace-nowrap transition-colors hover:text-blue-600 ${
                isActive("/categories") ? "text-blue-600" : "text-gray-700"
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => onNavigate("deals")}
              className={`text-sm font-medium whitespace-nowrap transition-colors hover:text-blue-600 ${
                isActive("/deals") ? "text-blue-600" : "text-gray-700"
              }`}
            >
              Bulk Deals
            </button>

            <Link
              to="/contact"
              className={`text-sm font-medium whitespace-nowrap transition-colors hover:text-blue-600 ${
                isActive("/contact") ? "text-blue-600" : "text-gray-700"
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 py-4">
          <div className="max-w-7xl mx-auto px-4 space-y-3">
            <button
              onClick={handleAccountClick}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors w-full"
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">
                {isLoggedIn ? "Account" : "Login"}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
