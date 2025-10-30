import { X, Plus, Minus, Trash2, ShoppingBag, Shield, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
// Replace localStorage-based authService with Firebase auth service
import firebaseAuthService from '../services/firebaseAuthService';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onNavigate: (page: string, id?: string) => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate
}: CartSidebarProps) {
  const navigate = useNavigate();
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const handleProductClick = (productId: string) => {
    onNavigate('product', productId);
    onClose();
  };

  const handleCheckout = () => {
    // Check if user is authenticated before proceeding to checkout
    if (firebaseAuthService.isAuthenticated()) {
      navigate('/checkout');
    } else {
      // Redirect to login page if not authenticated
      navigate('/login');
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Quote Request ({cartItems.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 text-center mb-6">
                  Add some bags to get a bulk quote!
                </p>
                <button
                  onClick={() => {
                    onNavigate('products');
                    onClose();
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Browse Bags
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleProductClick(item.product.id)}
                    />

                    <div className="flex-1 min-w-0">
                      <h4
                        onClick={() => handleProductClick(item.product.id)}
                        className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer truncate"
                      >
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">{item.product.brand}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2 bg-white rounded-md p-1">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(item.product.minOrderQuantity || 1, item.quantity - (item.product.minOrderQuantity || 1)))}
                            className="w-6 h-6 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.id,
                                Math.min(item.product.stockQuantity, item.quantity + (item.product.minOrderQuantity || 1))
                              )
                            }
                            className="w-6 h-6 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-gray-900">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            ₹{(item.product.originalPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      {item.quantity >= item.product.stockQuantity && (
                        <p className="text-xs text-orange-600 mt-1">Maximum available quantity</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with totals and actions */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <div className="text-xs text-gray-500">
                    Add ₹{(50000 - subtotal).toLocaleString('en-IN')} more for free shipping
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Request Quote
                </button>
              </div>

              {/* Trust indicators */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Fast delivery</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}