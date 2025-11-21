import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, productId?: string) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  isInWishlist: boolean;
}

export default function ProductCard({
  product,
  onNavigate,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
}: ProductCardProps) {
  // Removed the discountPercentage calculation since we're not showing the badge

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative overflow-hidden bg-gray-50">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
          />
        </Link>

        {/* Removed the discount badge */}

        {product.condition !== "new" && (
          <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded capitalize">
            {product.condition}
          </div>
        )}

        <button
          onClick={() => onToggleWishlist(product.id)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
            isInWishlist
              ? "bg-red-500 text-white"
              : "bg-white text-gray-600 hover:bg-red-500 hover:text-white"
          } ${product.condition !== "new" ? "top-12" : ""}`}
        >
          <Heart
            className="w-4 h-4"
            fill={isInWishlist ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="p-2 sm:p-3">
        <div className="mb-1">
          <span className="text-xs font-medium text-gray-500 uppercase">
            {product.brand}
          </span>
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors block leading-tight"
        >
          {product.name}
        </Link>

        <div className="flex items-center space-x-1 mb-1 sm:mb-2">
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-gray-900">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        <div className="flex items-baseline space-x-1 mb-1 sm:mb-2">
          <span className="text-sm sm:text-lg font-bold text-gray-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-500 line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {product.bulkPricing && product.bulkPricing.length > 0 && (
          <div className="mb-1 sm:mb-2">
            <p className="text-xs text-green-600 font-medium">
              Bulk: ₹{product.bulkPricing[0].price.toLocaleString("en-IN")}
            </p>
          </div>
        )}

        <div className="mb-2 sm:mb-3">
          <p className="text-xs text-blue-600 font-medium">
            Min: {product.minOrderQuantity} units
          </p>
        </div>

        <div className="flex space-x-1 sm:space-x-2">
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-blue-600 text-white py-1.5 sm:py-2 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 text-xs"
          >
            <ShoppingCart className="w-3 h-3" />
            <span>Quote</span>
          </button>
          <Link
            to={`/product/${product.slug}`}
            className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-colors text-xs"
          >
            View
          </Link>
        </div>

        {product.stockQuantity === 0 && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-md px-2 py-1.5">
            <p className="text-xs text-red-700 font-semibold flex items-center">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
              Out of Stock
            </p>
          </div>
        )}

        {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-md px-2 py-1.5">
            <p className="text-xs text-red-700 font-semibold flex items-center">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse"></span>
              Critical: Only {product.stockQuantity} left!
            </p>
          </div>
        )}

        {product.stockQuantity > 5 && product.stockQuantity <= 20 && (
          <div className="mt-2 bg-orange-50 border border-orange-200 rounded-md px-2 py-1.5">
            <p className="text-xs text-orange-700 font-medium flex items-center">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5"></span>
              Low Stock: {product.stockQuantity} available
            </p>
          </div>
        )}

        {product.stockQuantity > 20 && (
          <div className="mt-2 bg-green-50 border border-green-200 rounded-md px-2 py-1.5">
            <p className="text-xs text-green-700 font-medium flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
              In Stock: {product.stockQuantity} available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
