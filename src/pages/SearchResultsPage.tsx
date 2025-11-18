import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Product } from "../types";
import SEO from "../components/SEO";

interface SearchResultsPageProps {
  products: Product[];
  onNavigate?: (page: string, id?: string) => void;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (productId: string) => void;
  wishlistIds?: string[];
}

export default function SearchResultsPage({
  products,
}: SearchResultsPageProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [sortBy, setSortBy] = useState("relevance");

  const filteredProducts = products.filter((product) => {
    const searchLower = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower)
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      case "rating":
        return b.rating - a.rating;
      case "relevance":
      default:
        return 0;
    }
  });



  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`Search Results for "${query}"`}
        description={`Found ${sortedProducts.length} products matching "${query}". Browse wholesale bags at Delhi Selling.`}
        noindex={true}
      />

      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Results Header */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Search Results for "{query}"
            </h1>
            <p className="text-gray-600">
              {sortedProducts.length}{" "}
              {sortedProducts.length === 1 ? "product" : "products"} found
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 font-medium">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Products List */}
        <div className="border-t border-gray-200">
          {sortedProducts.length > 0 ? (
            <div className="bg-white divide-y divide-gray-200">
              {sortedProducts.map((product) => {
                const discountPercentage = product.originalPrice
                  ? Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100,
                    )
                  : 0;

                return (
                  <div
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors duration-150 group"
                  >
                    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 px-4 sm:px-6 lg:px-8">
                      {/* Product Image - Left Side */}
                      <Link
                        to={`/product/${product.slug}`}
                        className="w-20 sm:w-28 md:w-32 flex-shrink-0 bg-gray-50 rounded overflow-hidden"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Product Details - Right Side */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          {/* Brand */}
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {product.brand}
                          </p>

                          {/* Title */}
                          <Link
                            to={`/product/${product.slug}`}
                            className="text-sm sm:text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-1 leading-tight"
                          >
                            {product.name}
                          </Link>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(product.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "fill-gray-200 text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                              {product.rating}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({product.reviewCount})
                            </span>
                          </div>
                        </div>

                        {/* Price Section */}
                        <div>
                          <div className="flex items-baseline gap-1.5 mb-1">
                            <span className="text-lg sm:text-xl font-bold text-gray-900">
                              ₹{product.price.toLocaleString("en-IN")}
                            </span>
                            {product.originalPrice && (
                              <>
                                <span className="text-xs text-gray-400 line-through">
                                  ₹{product.originalPrice.toLocaleString("en-IN")}
                                </span>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                  {discountPercentage}% OFF
                                </span>
                              </>
                            )}
                          </div>

                          {/* Stock Status */}
                          <div className="flex items-center gap-1.5">
                            {product.stockQuantity > 0 ? (
                              <>
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                <p className="text-xs font-semibold text-green-600">
                                  In Stock
                                </p>
                              </>
                            ) : (
                              <>
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                <p className="text-xs font-semibold text-red-600">
                                  Out of Stock
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search to find what you're looking for.
              </p>
              <button
                onClick={() => navigate("/products")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse All Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
