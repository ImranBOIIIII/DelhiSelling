import { useState } from "react";
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "../types";
import SEO from "../components/SEO";
import {
  getProductSEO,
  generateProductSchema,
  generateBreadcrumbSchema,
} from "../utils/seo";

interface ProductDetailPageProps {
  product: Product;
  relatedProducts: Product[];
  categories?: { id: string; name: string; slug: string }[];
  onNavigate: (page: string, id?: string) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  isInWishlist: boolean;
}

export default function ProductDetailPage({
  product,
  relatedProducts,
  categories = [],
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
}: ProductDetailPageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  // Find category name
  const category = categories.find((c) => c.id === product.categoryId);
  const categoryName = category?.name || "Products";

  // Generate SEO data
  const productSEO = getProductSEO(
    product.name,
    product.description,
    product.price,
    categoryName,
    product.images[0],
  );

  const productSchema = generateProductSchema({
    id: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.images[0],
    category: categoryName,
    inStock: product.stockQuantity > 0,
    rating: product.rating,
    reviewCount: product.reviewCount,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: product.name, url: `/product/${product.slug}` },
  ]);

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO {...productSEO} schemaData={[productSchema, breadcrumbSchema]} />

      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => window.history.back()}
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

      <div className="max-w-7xl mx-auto lg:px-4 lg:py-12">
        {/* Main Product Section */}
        <div className="bg-white lg:rounded-sm lg:shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0 lg:gap-12 lg:p-12">
            {/* Left - Image Gallery */}
            <div className="space-y-4 lg:space-y-4 px-0 lg:px-0">
              {/* Main Image */}
              <div className="relative bg-gray-50 lg:rounded-lg overflow-hidden aspect-square lg:border border-gray-200">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-lg p-3 shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-lg p-3 shadow-lg transition-all"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-800" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`absolute top-4 right-4 p-3 rounded-lg shadow-lg transition-all ${
                    isInWishlist
                      ? "bg-red-600 text-white"
                      : "bg-white/90 text-gray-600 hover:bg-white"
                  }`}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={isInWishlist ? "currentColor" : "none"}
                  />
                </button>
              </div>

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-4 gap-3 px-4 lg:px-0">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-blue-600"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Information */}
            <div className="space-y-6 px-4 py-6 lg:px-0 lg:py-0">
              {/* Brand */}
              <div className="border-b border-neutral-200 pb-4">
                <p className="text-sm uppercase tracking-wider text-neutral-500 mb-2">
                  {product.brand}
                </p>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-500 text-amber-500"
                          : "text-neutral-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="border-y border-neutral-200 py-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-neutral-400 line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm font-medium text-red-700 bg-red-50 px-2 py-1 rounded-sm">
                        Save {discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-neutral-500 mt-2">
                  Inclusive of all taxes
                </p>
              </div>

              {/* Description */}
              <div>
                <p className="text-neutral-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-neutral-500">
                    Condition
                  </p>
                  <p className="text-sm font-medium text-neutral-900 capitalize">
                    {product.condition}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-neutral-500">
                    Availability
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      product.stockQuantity > 0
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {product.stockQuantity > 0
                      ? `${product.stockQuantity} in stock`
                      : "Out of stock"}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.stockQuantity > 0 && (
                <div className="flex items-center gap-4 py-4">
                  <label className="text-sm font-medium text-neutral-700">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-neutral-300 rounded-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-neutral-50 transition-colors"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 border-x border-neutral-300 font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(product.stockQuantity, quantity + 1),
                        )
                      }
                      className="px-4 py-2 hover:bg-neutral-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4">
                {product.stockQuantity > 0 ? (
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-4 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Secure Payment</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mt-0 lg:mt-8 bg-white lg:rounded-sm lg:shadow-sm overflow-hidden">
          <div className="p-4 lg:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Product Specifications
            </h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex py-3 border-b border-neutral-100"
                >
                  <span className="text-sm text-neutral-600 w-1/2">{key}</span>
                  <span className="text-sm text-neutral-900 font-medium w-1/2">
                    {value}
                  </span>
                </div>
              ))}
              <div className="flex py-3 border-b border-neutral-100">
                <span className="text-sm text-neutral-600 w-1/2">Brand</span>
                <span className="text-sm text-neutral-900 font-medium w-1/2">
                  {product.brand}
                </span>
              </div>
              <div className="flex py-3 border-b border-neutral-100">
                <span className="text-sm text-neutral-600 w-1/2">Model</span>
                <span className="text-sm text-neutral-900 font-medium w-1/2">
                  {product.model}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 lg:mt-12 px-4 lg:px-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.slug}`}
                  className="bg-white rounded-sm shadow-sm hover:shadow-md transition-all group overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden bg-neutral-50">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
                      {relatedProduct.brand}
                    </p>
                    <h3 className="text-sm text-neutral-900 line-clamp-2 mb-2 leading-tight">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(relatedProduct.rating)
                              ? "fill-amber-500 text-amber-500"
                              : "text-neutral-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-neutral-500 ml-1">
                        ({relatedProduct.reviewCount})
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{relatedProduct.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
