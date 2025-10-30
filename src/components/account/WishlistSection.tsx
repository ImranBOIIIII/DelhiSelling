import { Heart, ShoppingCart, Star, Trash2 } from 'lucide-react';
import { products } from '../../data/mockData';

interface WishlistSectionProps {
  wishlistIds: string[];
  onNavigate: (page: string, id?: string) => void;
  onToggleWishlist: (productId: string) => void;
}

export default function WishlistSection({ wishlistIds, onNavigate, onToggleWishlist }: WishlistSectionProps) {
  const wishlistProducts = products.filter(product => wishlistIds.includes(product.id));

  const handleMoveToCart = (productId: string) => {
    // In a real app, this would add the item to cart
    alert(`Added product ${productId} to cart`);
  };

  const handleViewProduct = (productId: string) => {
    onNavigate('product', productId);
  };

  const handleClearWishlist = () => {
    if (wishlistProducts.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      wishlistProducts.forEach(product => onToggleWishlist(product.id));
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Wishlist</h2>
          <p className="text-gray-600 mt-2">{wishlistProducts.length} item(s) saved for later</p>
        </div>
        {wishlistProducts.length > 0 && (
          <button
            onClick={handleClearWishlist}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">Start adding products you love to your wishlist!</p>
          <button
            onClick={() => onNavigate('products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => {
            const discountPercentage = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => handleViewProduct(product.id)}
                  />
                  
                  {discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {discountPercentage}% OFF
                    </div>
                  )}

                  {product.condition !== 'new' && (
                    <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded capitalize">
                      {product.condition}
                    </div>
                  )}

                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    style={{ top: product.condition !== 'new' ? '50px' : '12px' }}
                  >
                    <Heart className="w-4 h-4" fill="currentColor" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase">{product.brand}</span>
                  </div>

                  <h3
                    onClick={() => handleViewProduct(product.id)}
                    className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({product.reviewCount})</span>
                  </div>

                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMoveToCart(product.id)}
                      className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      disabled={product.stockQuantity === 0}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                    </button>
                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className="px-4 py-2.5 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                    <p className="text-xs text-orange-600 mt-2 font-medium">
                      Only {product.stockQuantity} left in stock!
                    </p>
                  )}

                  {product.stockQuantity === 0 && (
                    <p className="text-xs text-red-600 mt-2 font-medium">
                      Out of stock
                    </p>
                  )}
                </div>

                {/* Added to wishlist date - mock data */}
                <div className="px-4 pb-4">
                  <p className="text-xs text-gray-500">
                    Added on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {wishlistProducts.length > 0 && (
        <div className="mt-8 p-6 bg-blue-50 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro Tip!</h3>
          <p className="text-gray-600 text-sm">
            Keep track of price drops on your wishlist items. We'll notify you when they go on sale!
          </p>
        </div>
      )}
    </div>
  );
}