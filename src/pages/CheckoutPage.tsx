import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Truck,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  Package,
} from "lucide-react";
import { CartItem, Address } from "../types";
// Replace localStorage-based services with Firebase services
import firebaseAuthService from "../services/firebaseAuthService";
import firebaseAdminService from "../services/firebaseAdminService";
import { AdminOrder } from "../types";

interface CheckoutPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function CheckoutPage({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}: CheckoutPageProps) {
  const navigate = useNavigate();

  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // User addresses
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  // Form states
  const [activeStep, setActiveStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(false);

  // Customer information
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    gstNumber: "",
  });

  // Manual shipping address (for users without saved addresses or when adding new)
  const [manualShippingAddress, setManualShippingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // Billing address
  const [billingAddress, setBillingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState("bank-transfer");

  // Same as shipping checkbox
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Check authentication on component mount
  useEffect(() => {
    const user = firebaseAuthService.getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);

      // Pre-fill customer info with user data
      setCustomerInfo({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        company: "",
        gstNumber: "",
      });

      // In a real app, you would fetch user addresses from Firebase
      // For now, we'll use localStorage as a fallback
      const savedAddresses = localStorage.getItem("user_addresses");
      if (savedAddresses) {
        const addresses = JSON.parse(savedAddresses);
        setUserAddresses(addresses);
        // Select the default address if available
        const defaultAddress = addresses.find(
          (addr: Address) => addr.isDefault,
        );
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else if (addresses.length > 0) {
          setSelectedAddressId(addresses[0].id);
        }
      }
    } else {
      // Redirect to login if not authenticated
      navigate("/login");
    }
  }, [navigate]);

  // Handle form changes
  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualShippingAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setManualShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Handle same as shipping checkbox
  const handleSameAsShippingChange = () => {
    setSameAsShipping(!sameAsShipping);
    if (!sameAsShipping) {
      const selectedAddress = getSelectedShippingAddress();
      if (selectedAddress) {
        // Create a new object with all required fields
        setBillingAddress({
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2 || "",
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          country: "India", // Default country
        });
      } else {
        setBillingAddress(manualShippingAddress);
      }
    }
  };

  // Get the currently selected shipping address
  const getSelectedShippingAddress = (): Address | null => {
    if (selectedAddressId) {
      return (
        userAddresses.find((addr) => addr.id === selectedAddressId) || null
      );
    }
    return null;
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Get the shipping address (either selected or manual)
      let shippingAddr = getSelectedShippingAddress();
      if (!shippingAddr) {
        // Use manual address if no saved address is selected
        shippingAddr = {
          id: "manual_" + Date.now().toString(),
          fullName: customerInfo.fullName || currentUser?.fullName || "",
          phone: customerInfo.phone || currentUser?.phone || "",
          addressLine1: manualShippingAddress.addressLine1,
          addressLine2: manualShippingAddress.addressLine2 || "",
          city: manualShippingAddress.city,
          state: manualShippingAddress.state,
          pincode: manualShippingAddress.pincode,
          isDefault: true,
        };
      }

      // Build AdminOrder payload (fields auto-generated by service: id, orderNumber, timestamps)
      const orderItems = cartItems.map((item) => ({
        id: item.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        quantity: item.quantity,
        price: item.product.price,
        sellerId: item.product.sellerId || "",
        sellerName: item.product.sellerName || "",
        sellerEmail: item.product.sellerEmail || "",
      }));

      const newOrderInput = {
        status: "pending" as const,
        totalAmount: total,
        shippingAddress: shippingAddr,
        paymentMethod: "Bank Transfer",
        paymentStatus: "pending" as const,
        items: orderItems,
        // Customer fields for admin
        customerName: customerInfo.fullName || currentUser?.fullName || "",
        customerEmail: customerInfo.email || currentUser?.email || "",
        customerPhone: customerInfo.phone || currentUser?.phone || "",
        internalStatus: "new" as const,
        // These fields will be auto-generated by the service
        orderNumber: "",
        createdAt: "",
        updatedAt: "",
      };

      const saved = await firebaseAdminService.addOrder(newOrderInput);

      // Store the placed order details for display
      setPlacedOrder(saved);
      setOrderPlaced(true);
      setActiveStep(4);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    navigate("/products");
  };

  // If not authenticated, don't render anything (navigation will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // If order is placed, show confirmation
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 mb-2">
              Thank you for your order. We our team will contact you shortly.{" "}
              <span className="font-semibold">{customerInfo.email}</span>.
            </p>
            <p className="text-gray-600 mb-8">
              Our team will contact you shortly to discuss bulk pricing and
              delivery.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-mono font-bold text-blue-600">
                    {placedOrder?.orderNumber || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-medium">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items</span>
                  <span className="font-medium">{cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleContinueShopping}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/account")}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                View Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get the currently selected address for display
  const selectedAddress = getSelectedShippingAddress();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activeStep >= step
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step}
                    </div>
                    <div className="ml-2 hidden md:block">
                      <span
                        className={`text-sm font-medium ${
                          activeStep >= step ? "text-blue-600" : "text-gray-500"
                        }`}
                      >
                        {step === 1 && "Customer Info"}
                        {step === 2 && "Shipping"}
                        {step === 3 && "Review"}
                      </span>
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-16 h-1 mx-4 ${
                          activeStep > step ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            {activeStep === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={customerInfo.fullName}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+91 XXXXXXXXXX"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={customerInfo.company}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number (if applicable)
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={customerInfo.gstNumber}
                      onChange={handleCustomerInfoChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter GST number"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setActiveStep(2)}
                    disabled={
                      !customerInfo.fullName ||
                      !customerInfo.email ||
                      !customerInfo.phone
                    }
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Shipping
                  </button>
                </div>
              </div>
            )}

            {/* Shipping Information */}
            {activeStep === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipping Information
                </h2>

                {/* Address Selection */}
                {userAddresses.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Select Shipping Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userAddresses.map((address) => (
                        <div
                          key={address.id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedAddressId === address.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedAddressId(address.id)}
                        >
                          <div className="flex items-start">
                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={selectedAddressId === address.id}
                              onChange={() => setSelectedAddressId(address.id)}
                              className="mt-1 mr-3"
                            />
                            <div>
                              <div className="flex justify-between">
                                <h4 className="font-semibold text-gray-900">
                                  {address.fullName}
                                </h4>
                                {address.isDefault && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm">
                                {address.phone}
                              </p>
                              <div className="text-gray-700 mt-2 text-sm">
                                <p>{address.addressLine1}</p>
                                {address.addressLine2 && (
                                  <p>{address.addressLine2}</p>
                                )}
                                <p>
                                  {address.city}, {address.state}{" "}
                                  {address.pincode}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div
                        className={`border-2 border-dashed rounded-lg p-4 cursor-pointer flex items-center justify-center ${
                          selectedAddressId === null
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedAddressId(null)}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === null}
                          onChange={() => setSelectedAddressId(null)}
                          className="mr-3"
                        />
                        <span className="text-blue-600 font-medium">
                          Add New Address
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Form (shown when no addresses exist or when adding new) */}
                {userAddresses.length === 0 || selectedAddressId === null ? (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {userAddresses.length === 0
                        ? "Add Shipping Address"
                        : "New Shipping Address"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 1 *
                        </label>
                        <input
                          type="text"
                          name="addressLine1"
                          value={manualShippingAddress.addressLine1}
                          onChange={handleManualShippingAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Street address"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          name="addressLine2"
                          value={manualShippingAddress.addressLine2}
                          onChange={handleManualShippingAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Apartment, suite, etc. (optional)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={manualShippingAddress.city}
                          onChange={handleManualShippingAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="City"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={manualShippingAddress.state}
                          onChange={handleManualShippingAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="State"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={manualShippingAddress.pincode}
                          onChange={handleManualShippingAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="PIN code"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={manualShippingAddress.country}
                          onChange={handleManualShippingAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Country"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="mt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={handleSameAsShippingChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Billing address is same as shipping address
                    </span>
                  </label>
                </div>

                {/* Billing Address (only shown if different from shipping) */}
                {!sameAsShipping && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Billing Address
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 1 *
                        </label>
                        <input
                          type="text"
                          name="addressLine1"
                          value={billingAddress.addressLine1}
                          onChange={handleBillingAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Street address"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          name="addressLine2"
                          value={billingAddress.addressLine2}
                          onChange={handleBillingAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Apartment, suite, etc. (optional)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={billingAddress.city}
                          onChange={handleBillingAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="City"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={billingAddress.state}
                          onChange={handleBillingAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="State"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={billingAddress.pincode}
                          onChange={handleBillingAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="PIN code"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={billingAddress.country}
                          onChange={handleBillingAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Country"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            )}

            {/* Order Review */}
            {activeStep === 3 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Review Your Order
                </h2>

                {/* Order Summary */}
                <div className="border border-gray-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />

                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {item.product.brand}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <div>
                              <span className="text-sm text-gray-600">
                                Qty: {item.quantity}
                              </span>
                              {item.product.minOrderQuantity > 1 && (
                                <span className="text-xs text-blue-600 ml-2">
                                  (Min: {item.product.minOrderQuantity})
                                </span>
                              )}
                            </div>
                            <span className="font-semibold text-gray-900">
                              ₹
                              {(
                                item.product.price * item.quantity
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            ₹{item.product.price.toLocaleString("en-IN")} per
                            piece
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0
                          ? "Free"
                          : `₹${shipping.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-gray-900">
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="border border-gray-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Customer Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{customerInfo.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{customerInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{customerInfo.phone}</p>
                    </div>
                    {customerInfo.company && (
                      <div>
                        <p className="text-sm text-gray-600">Company</p>
                        <p className="font-medium">{customerInfo.company}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="border border-gray-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Shipping Information
                  </h3>

                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      {selectedAddress ? (
                        <>
                          <p className="font-medium">
                            {selectedAddress.fullName}
                          </p>
                          <p>{selectedAddress.phone}</p>
                          <p className="mt-2">{selectedAddress.addressLine1}</p>
                          {selectedAddress.addressLine2 && (
                            <p>{selectedAddress.addressLine2}</p>
                          )}
                          <p>
                            {selectedAddress.city}, {selectedAddress.state}{" "}
                            {selectedAddress.pincode}
                          </p>
                          <p>India</p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">{customerInfo.fullName}</p>
                          <p>{manualShippingAddress.addressLine1}</p>
                          {manualShippingAddress.addressLine2 && (
                            <p>{manualShippingAddress.addressLine2}</p>
                          )}
                          <p>
                            {manualShippingAddress.city},{" "}
                            {manualShippingAddress.state}{" "}
                            {manualShippingAddress.pincode}
                          </p>
                          <p>{manualShippingAddress.country}</p>
                          <p className="mt-2">{customerInfo.phone}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="border border-gray-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Payment Method
                  </h3>

                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-gray-600">
                        You will receive bank details after order confirmation
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setActiveStep(2)}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </div>
            )}

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {item.product.brand}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <div>
                            <span className="text-xs text-gray-600">
                              Qty: {item.quantity}
                            </span>
                            {item.product.minOrderQuantity > 1 && (
                              <span className="text-xs text-blue-600 block">
                                (Min: {item.product.minOrderQuantity})
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            ₹
                            {(
                              item.product.price * item.quantity
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0
                        ? "Free"
                        : `₹${shipping.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Note:</span> This is a bulk
                    order request. Our team will contact you within 24 hours to
                    discuss pricing and delivery options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
