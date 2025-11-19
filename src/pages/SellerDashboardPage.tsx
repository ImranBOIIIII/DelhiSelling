import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Package, ShoppingCart, TrendingUp, Users, 
  LogOut, Menu, X, Search, DollarSign, Bell,
  Eye, Edit, Trash2, Plus, BarChart3, Headphones,
  MessageSquare, Send, CheckCircle, Clock
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import sellerService from "../services/sellerService";

export default function SellerDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { tab } = useParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState(tab || "home");
  const [currentSeller, setCurrentSeller] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount] = useState(3);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    brand: "",
    model: "",
    description: "",
    category: "",
    price: 0,
    originalPrice: 0,
    material: "",
    size: "",
    color: "",
    stockQuantity: 0,
    minOrderQuantity: 1,
    condition: "new" as "new" | "used" | "refurbished",
    images: [] as string[]
  });
  const [imageUrl, setImageUrl] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const navigate = useNavigate();

  // Check if seller is logged in
  useEffect(() => {
    const seller = localStorage.getItem("currentSeller");
    if (!seller) {
      navigate("/seller-login");
    } else {
      setCurrentSeller(JSON.parse(seller));
    }
  }, [navigate]);

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab("home");
    }
  }, [tab]);

  const handleLogout = () => {
    localStorage.removeItem("currentSeller");
    navigate("/");
  };

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { label: "Total Revenue", value: "₹0", change: "+0%", icon: DollarSign, color: "bg-green-500" },
    { label: "Total Orders", value: "0", change: "+0%", icon: ShoppingCart, color: "bg-blue-500" },
    { label: "Products", value: "0", change: "+0", icon: Package, color: "bg-purple-500" },
    { label: "Customers", value: "0", change: "+0%", icon: Users, color: "bg-orange-500" },
  ]);

  // Load products and orders from Firebase on mount
  useEffect(() => {
    if (!currentSeller) return;

    const loadData = async () => {
      try {
        // Load products from Firebase
        const sellerProducts = await sellerService.getSellerProducts(currentSeller.email);
        
        if (sellerProducts.length > 0) {
          // Format products to match the display format
          const formattedProducts = sellerProducts.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: `₹${p.price}`,
            stock: p.stockQuantity,
            sales: p.sales || 0,
            image: p.images[0] || "https://via.placeholder.com/100",
            rawPrice: p.price
          }));
          setProducts(formattedProducts);
        }

        // Load orders from localStorage (keeping this for now)
        const savedOrders = localStorage.getItem("admin_orders");
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          // Filter orders for current seller's products
          const sellerOrders = parsedOrders.filter((order: any) => {
            // Check if any item in the order belongs to this seller
            return order.items?.some((item: any) => item.sellerId === currentSeller?.email);
          });
          setOrders(sellerOrders);

          // Calculate stats
          const totalRevenue = sellerOrders.reduce((sum: number, order: any) => {
            const sellerItems = order.items?.filter((item: any) => item.sellerId === currentSeller?.email) || [];
            const orderTotal = sellerItems.reduce((itemSum: number, item: any) => 
              itemSum + (item.price * item.quantity), 0);
            return sum + orderTotal;
          }, 0);

          const uniqueCustomers = new Set(sellerOrders.map((order: any) => order.userId)).size;

          setStats([
            { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString('en-IN')}`, change: "+12.5%", icon: DollarSign, color: "bg-green-500" },
            { label: "Total Orders", value: sellerOrders.length.toString(), change: "+8.2%", icon: ShoppingCart, color: "bg-blue-500" },
            { label: "Products", value: sellerProducts.length.toString(), change: `+${sellerProducts.length}`, icon: Package, color: "bg-purple-500" },
            { label: "Customers", value: uniqueCustomers.toString(), change: "+15.3%", icon: Users, color: "bg-orange-500" },
          ]);
        }
      } catch (error) {
        console.error("Error loading seller data:", error);
      }
    };

    loadData();
  }, [currentSeller]);

  const menuItems = [
    { id: "home", label: "Home", icon: LayoutDashboard, color: "#f87171" },
    { id: "products", label: "Products", icon: Package, color: "#a78bfa" },
    { id: "orders", label: "Orders", icon: ShoppingCart, color: "#d4a574" },
    { id: "returns", label: "Returns", icon: TrendingUp, color: "#ef4444" },
    { id: "analytics", label: "Analytics", icon: BarChart3, color: "#60a5fa" },
    { id: "inventory", label: "Inventory", icon: Package, color: "#f59e0b" },
    { id: "payments", label: "Payments", icon: DollarSign, color: "#10b981" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-800";
      case "Shipped": return "bg-blue-100 text-blue-800";
      case "Processing": return "bg-yellow-100 text-yellow-800";
      case "Pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!productForm.name || !productForm.brand || !productForm.category || !productForm.description) {
      alert("Please fill in all required fields");
      return;
    }

    if (productForm.price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    if (productForm.stockQuantity <= 0) {
      alert("Please enter a valid stock quantity");
      return;
    }

    if (selectedProduct) {
      // Edit existing product in Firebase
      try {
        await sellerService.updateProduct(selectedProduct.id, {
          name: productForm.name,
          description: productForm.description,
          price: productForm.price,
          originalPrice: productForm.originalPrice || productForm.price,
          category: productForm.category,
          brand: productForm.brand,
          model: productForm.model || "",
          images: productForm.images,
          stockQuantity: productForm.stockQuantity,
          minOrderQuantity: productForm.minOrderQuantity,
          condition: productForm.condition,
          material: productForm.material || "",
          size: productForm.size || "",
          color: productForm.color || "",
        });
        
        // Update display
        const formattedProduct = {
          id: selectedProduct.id,
          name: productForm.name,
          category: productForm.category,
          price: `₹${productForm.price}`,
          stock: productForm.stockQuantity,
          sales: selectedProduct.sales || 0,
          image: productForm.images[0] || "https://via.placeholder.com/100"
        };
        
        setProducts(products.map(p => p.id === selectedProduct.id ? formattedProduct : p));
        alert("Product updated successfully!");
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product. Please try again.");
      }
    } else {
      // Create new product in Firebase
      try {
        const newProduct = await sellerService.addProduct({
          name: productForm.name,
          description: productForm.description,
          price: productForm.price,
          originalPrice: productForm.originalPrice || productForm.price,
          category: productForm.category,
          brand: productForm.brand,
          model: productForm.model || "",
          images: productForm.images,
          stockQuantity: productForm.stockQuantity,
          minOrderQuantity: productForm.minOrderQuantity,
          condition: productForm.condition,
          material: productForm.material || "",
          size: productForm.size || "",
          color: productForm.color || "",
          sellerId: currentSeller?.email || "unknown",
          sellerName: currentSeller?.storeName || currentSeller?.ownerName || "Seller",
          sellerEmail: currentSeller?.email || "",
          sales: 0,
          slug: productForm.name.toLowerCase().replace(/\s+/g, '-'),
          categoryId: productForm.category,
          isFeatured: false,
          isActive: true,
          rating: 0,
          reviewCount: 0,
          specifications: {}
        });

        // Update the products display
        const formattedProduct = {
          id: newProduct.id,
          name: newProduct.name,
          category: newProduct.category,
          price: `₹${newProduct.price}`,
          stock: newProduct.stockQuantity,
          sales: 0,
          image: newProduct.images[0] || "https://via.placeholder.com/100"
        };
        setProducts([...products, formattedProduct]);
        alert("Product added successfully and is now visible on the homepage!");
      } catch (error) {
        console.error("Error adding product:", error);
        alert("Failed to add product. Please try again.");
      }
    }

    // Reset form
    setProductForm({
      name: "",
      brand: "",
      model: "",
      description: "",
      category: "",
      price: 0,
      originalPrice: 0,
      material: "",
      size: "",
      color: "",
      stockQuantity: 0,
      minOrderQuantity: 1,
      condition: "new",
      images: []
    });
    setImageUrl("");
    setSelectedProduct(null);

    // Close modal
    setShowProductModal(false);
    
    // Switch to products tab to see the product
    navigate("/seller/dashboard/products");
  };

  const handleViewProduct = async (product: any) => {
    try {
      // Get full product details from Firebase
      const fullProduct = await sellerService.getProductById(product.id);
      setSelectedProduct(fullProduct || product);
      setShowViewModal(true);
    } catch (error) {
      console.error("Error loading product:", error);
      setSelectedProduct(product);
      setShowViewModal(true);
    }
  };

  const handleEditProduct = async (product: any) => {
    try {
      // Get full product details from Firebase
      const fullProduct = await sellerService.getProductById(product.id);
      
      if (fullProduct) {
        // Populate the form with existing product data
        setProductForm({
          name: fullProduct.name,
          brand: fullProduct.brand,
          model: fullProduct.model || "",
          description: fullProduct.description,
          category: fullProduct.category,
          price: fullProduct.price,
          originalPrice: fullProduct.originalPrice || 0,
          material: fullProduct.material || "",
          size: fullProduct.size || "",
          color: fullProduct.color || "",
          stockQuantity: fullProduct.stockQuantity,
          minOrderQuantity: fullProduct.minOrderQuantity,
          condition: fullProduct.condition,
          images: fullProduct.images || []
        });
        setSelectedProduct(fullProduct);
        setShowProductModal(true);
      }
    } catch (error) {
      console.error("Error loading product:", error);
      alert("Failed to load product details.");
    }
  };

  const handleDeleteProduct = async (product: any) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        // Remove from Firebase
        await sellerService.deleteProduct(product.id);
        
        // Update state
        setProducts(products.filter(p => p.id !== product.id));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`} style={{ backgroundColor: '#1a1a1a' }}>
        {/* Profile Section */}
        <div className="flex items-center space-x-3 h-16 px-4 border-b" style={{ borderColor: '#2a2a2a' }}>
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
            {currentSeller?.ownerName?.charAt(0).toUpperCase() || "S"}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-white font-medium block truncate">{currentSeller?.storeName || "Seller"}</span>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border z-50" style={{ borderColor: '#e5e7eb' }}>
                <div className="p-4 border-b" style={{ borderColor: '#f3f4f6' }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Mark all read</button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[
                    { id: 1, title: 'New Order Received', message: 'Order #ORD-156 has been placed', time: '5 min ago', unread: true, icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
                    { id: 2, title: 'Payment Received', message: 'Payment of ₹2,499 credited', time: '1 hour ago', unread: true, icon: DollarSign, color: 'bg-green-100 text-green-600' },
                    { id: 3, title: 'Low Stock Alert', message: 'Running Shoes stock is low', time: '3 hours ago', unread: true, icon: Package, color: 'bg-orange-100 text-orange-600' },
                  ].map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${notification.unread ? 'bg-blue-50' : ''}`}
                      style={{ borderColor: '#f3f4f6' }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${notification.color}`}>
                          <notification.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t text-center" style={{ borderColor: '#f3f4f6' }}>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all notifications</button>
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-3 py-3 border-b" style={{ borderColor: '#2a2a2a' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              style={{ backgroundColor: '#252525', paddingLeft: '2.25rem' }}
              className="w-full pr-3 py-2 text-sm border-0 rounded-lg text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <nav className="py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/seller/dashboard/${item.id}`)}
              className={`w-full flex items-center space-x-3 px-6 py-2.5 transition-colors ${
                activeTab === item.id
                  ? "text-white bg-[#252525] border-l-4"
                  : "text-gray-400 hover:text-white hover:bg-[#252525]"
              }`}
              style={activeTab === item.id ? { borderLeftColor: item.color } : {}}
            >
              <item.icon className="w-5 h-5" style={{ color: item.color }} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full py-4 border-t space-y-1" style={{ borderColor: '#2a2a2a' }}>
          <button
            onClick={() => navigate("/seller/dashboard/support")}
            className={`w-full flex items-center space-x-3 px-6 py-2.5 transition-colors ${
              activeTab === "support"
                ? "text-white bg-[#252525] border-l-4 border-l-[#6366f1]"
                : "text-gray-400 hover:text-white hover:bg-[#252525]"
            }`}
          >
            <Headphones className="w-5 h-5" style={{ color: '#6366f1' }} />
            <span className="text-sm">Support</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-6 py-2.5 text-gray-400 hover:text-white hover:bg-[#252525] transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md text-gray-700"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {activeTab === "home" && (
            <>
              {/* Welcome Header */}
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, {currentSeller?.ownerName || "Seller"}! 👋
                  </h2>
                  <p className="text-gray-600">Here's what's happening with your store today.</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2.5 bg-white border-2 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm" style={{ borderColor: '#e5e7eb' }}>
                    <span className="text-gray-700">Last 7 Days</span>
                  </button>
                  <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium text-sm">
                    Download Report
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 shadow-sm hover:shadow-lg transition-all p-6 group" style={{ borderColor: '#e5e7eb' }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.color} p-3.5 rounded-xl shadow-md group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-bold text-green-600">{stat.change}</span>
                      </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium mb-2">{stat.label}</h3>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: '#f3f4f6' }}>
                      <p className="text-xs text-gray-500">vs last period</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts & Activity Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border-2 shadow-sm p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Sales Overview</h3>
                      <p className="text-sm text-gray-500 mt-1">Your sales performance this week</p>
                    </div>
                    <select className="px-4 py-2 border-2 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none" style={{ borderColor: '#e5e7eb' }}>
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>This Year</option>
                    </select>
                  </div>
                  <div className="h-64 relative">
                    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                          <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.05 }} />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0,140 L 50,120 L 100,90 L 150,110 L 200,70 L 250,85 L 300,60 L 350,80 L 400,50 L 400,200 L 0,200 Z"
                        fill="url(#salesGradient)"
                      />
                      <path
                        d="M 0,140 L 50,120 L 100,90 L 150,110 L 200,70 L 250,85 L 300,60 L 350,80 L 400,50"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="absolute bottom-0 w-full flex justify-between px-2 pb-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                        <span key={i} className="text-xs font-medium text-gray-500">{day}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 shadow-sm p-6" style={{ borderColor: '#e5e7eb' }}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Add Product', icon: Plus, color: 'bg-blue-500', action: () => { navigate('/seller/dashboard/products'); setShowProductModal(true); } },
                      { label: 'View Orders', icon: ShoppingCart, color: 'bg-green-500', action: () => navigate('/seller/dashboard/orders') },
                      { label: 'Analytics', icon: BarChart3, color: 'bg-purple-500', action: () => navigate('/seller/dashboard/analytics') },
                      { label: 'Support', icon: Headphones, color: 'bg-orange-500', action: () => navigate('/seller/dashboard/support') }
                    ].map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className="w-full flex items-center space-x-3 p-4 bg-white border-2 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group"
                        style={{ borderColor: '#e5e7eb' }}
                      >
                        <div className={`${action.color} p-2.5 rounded-lg group-hover:scale-110 transition-transform`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl border-2 shadow-sm mb-8" style={{ borderColor: '#e5e7eb' }}>
                <div className="p-6 border-b" style={{ borderColor: '#f3f4f6' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
                      <p className="text-sm text-gray-500 mt-1">Latest transactions from your store</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-sm font-semibold transition-colors">
                      View All Orders →
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.slice(0, 4).map((order) => {
                        const sellerItems = order.items?.filter((item: any) => item.sellerId === currentSeller?.email) || [];
                        const orderTotal = sellerItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
                        const productNames = sellerItems.map((item: any) => item.name).join(", ");
                        
                        return (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-gray-900">#{order.id}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                  {order.userName?.charAt(0) || 'U'}
                                </div>
                                <span className="text-sm font-medium text-gray-900">{order.userName || 'Customer'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-700">{productNames || 'N/A'}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-gray-900">₹{orderTotal.toLocaleString('en-IN')}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full ${getStatusColor(order.status || 'Pending')}`}>
                                {order.status || 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end space-x-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center mb-4">
                                <ShoppingCart className="w-10 h-10 text-blue-500" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                              <p className="text-sm text-gray-500 max-w-md">
                                You haven't received any orders yet. Once customers start purchasing your products, orders will appear here.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Row - Top Products & Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-2xl border-2 shadow-sm p-6" style={{ borderColor: '#e5e7eb' }}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Top Selling Products</h3>
                  <div className="space-y-4">
                    {products.slice(0, 3).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border-2"
                            style={{ borderColor: '#e5e7eb' }}
                          />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{product.sales} sales</p>
                          <p className="text-xs text-gray-500">{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border-2 shadow-sm p-6" style={{ borderColor: '#e5e7eb' }}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      { action: 'New order received', detail: 'Order #ORD-001', time: '5 min ago', icon: ShoppingCart, color: 'bg-green-100 text-green-600' },
                      { action: 'Product added', detail: 'Leather Wallet', time: '1 hour ago', icon: Package, color: 'bg-blue-100 text-blue-600' },
                      { action: 'Payment received', detail: '₹2,499', time: '2 hours ago', icon: DollarSign, color: 'bg-purple-100 text-purple-600' },
                      { action: 'Order shipped', detail: 'Order #ORD-003', time: '3 hours ago', icon: TrendingUp, color: 'bg-orange-100 text-orange-600' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <div className={`p-2.5 rounded-lg ${activity.color}`}>
                          <activity.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.detail}</p>
                        </div>
                        <span className="text-xs text-gray-400">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "products" && (
            <>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Products</h2>
                  <p className="text-sm text-gray-500">Manage your product inventory and track performance</p>
                </div>
                <button 
                  onClick={() => setShowProductModal(true)}
                  className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sales</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover border"
                                style={{ borderColor: '#e5e7eb' }}
                              />
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500">ID: #{product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-900">{product.price}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-semibold ${product.stock < 30 ? 'text-red-600' : 'text-gray-900'}`}>
                                {product.stock}
                              </span>
                              {product.stock < 30 && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">Low</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{product.sales} units</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              product.stock > 50 ? 'bg-green-100 text-green-700' : 
                              product.stock > 20 ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-red-100 text-red-700'
                            }`}>
                              {product.stock > 50 ? 'In Stock' : product.stock > 20 ? 'Low Stock' : 'Critical'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => handleViewProduct(product)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleEditProduct(product)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No products yet</p>
                            <p className="text-sm text-gray-400 mt-1">Click "Add Product" to get started</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer */}
                <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: '#f3f4f6', backgroundColor: '#fafafa' }}>
                  <p className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">{products.length}</span> of <span className="font-semibold text-gray-900">{products.length}</span> products</p>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition-colors" style={{ borderColor: '#e5e7eb' }}>
                      Previous
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "orders" && (
            <>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Orders</h2>
                  <p className="text-sm text-gray-500">Manage and track all your customer orders</p>
                </div>
                <div className="flex items-center space-x-2">
                  <select className="px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" style={{ borderColor: '#e5e7eb' }}>
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((order) => {
                        const sellerItems = order.items?.filter((item: any) => item.sellerId === currentSeller?.email) || [];
                        const orderTotal = sellerItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
                        const productNames = sellerItems.map((item: any) => item.name).join(", ");
                        
                        return (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-gray-900">#{order.id}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{order.userName || 'Customer'}</p>
                                <p className="text-xs text-gray-500">Customer</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-700">{productNames || 'N/A'}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-gray-900">₹{orderTotal.toLocaleString('en-IN')}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm text-gray-700">
                                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {order.createdAt ? new Date(order.createdAt).getFullYear() : ''}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status || 'Pending')}`}>
                                {order.status || 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end space-x-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Edit Order">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center mb-4">
                                <ShoppingCart className="w-10 h-10 text-blue-500" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                              <p className="text-sm text-gray-500 max-w-md">
                                You haven't received any orders yet. Once customers start purchasing your products, orders will appear here.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer */}
                <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: '#f3f4f6', backgroundColor: '#fafafa' }}>
                  <p className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">{orders.length}</span> of <span className="font-semibold text-gray-900">{orders.length}</span> orders</p>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition-colors" style={{ borderColor: '#e5e7eb' }}>
                      Previous
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "analytics" && (
            <>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Analytics</h2>
                  <p className="text-sm text-gray-500">Track your business performance and insights</p>
                </div>
                <select className="px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" style={{ borderColor: '#e5e7eb' }}>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                  <option>Last Year</option>
                </select>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-green-600">+12.5%</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{stats[0].value}</p>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-600">+8.2%</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats[1].value}</p>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-50 text-purple-600">+15.3%</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{orders.length > 0 ? Math.round(
                      orders.reduce((sum, order) => {
                        const sellerItems = order.items?.filter((item: any) => item.sellerId === currentSeller?.email) || [];
                        return sum + sellerItems.reduce((itemSum: number, item: any) => itemSum + (item.price * item.quantity), 0);
                      }, 0) / orders.length
                    ).toLocaleString('en-IN') : '0'}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-50 text-orange-600">+23.1%</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats[3].value}</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
                    <span className="text-xs text-gray-500">Last 7 days</span>
                  </div>
                  <div className="h-64 relative">
                    {/* Area Chart */}
                    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#5eead4', stopOpacity: 0.6 }} />
                          <stop offset="100%" style={{ stopColor: '#5eead4', stopOpacity: 0.05 }} />
                        </linearGradient>
                      </defs>
                      {/* Sharp area fill */}
                      <path
                        d="M 0,140 L 30,80 L 60,100 L 90,70 L 120,90 L 150,60 L 180,50 L 210,75 L 240,55 L 270,85 L 300,70 L 330,95 L 360,80 L 400,110 L 400,200 L 0,200 Z"
                        fill="url(#areaGradient)"
                      />
                      {/* Sharp line */}
                      <path
                        d="M 0,140 L 30,80 L 60,100 L 90,70 L 120,90 L 150,60 L 180,50 L 210,75 L 240,55 L 270,85 L 300,70 L 330,95 L 360,80 L 400,110"
                        fill="none"
                        stroke="#5eead4"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="miter"
                      />
                    </svg>
                    {/* X-axis labels */}
                    <div className="absolute bottom-0 w-full flex justify-between px-2 pb-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                        <span key={i} className="text-xs text-gray-500">{day}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Sales by Category</h3>
                    <span className="text-xs text-gray-500">This month</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'Clothing', value: 45, color: '#a78bfa' },
                      { name: 'Footwear', value: 30, color: '#60a5fa' },
                      { name: 'Accessories', value: 25, color: '#34d399' }
                    ].map((category, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{category.name}</span>
                          <span className="text-sm font-bold text-gray-900">{category.value}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div 
                            className="h-3 rounded-full transition-all"
                            style={{ width: `${category.value}%`, backgroundColor: category.color }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t" style={{ borderColor: '#f3f4f6' }}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Sales</span>
                      <span className="font-bold text-gray-900">₹1,24,500</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-2xl border" style={{ borderColor: '#e5e7eb' }}>
                <div className="p-6 border-b" style={{ borderColor: '#f3f4f6' }}>
                  <h3 className="text-lg font-bold text-gray-900">Top Selling Products</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {products.map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border"
                            style={{ borderColor: '#e5e7eb' }}
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{product.sales} sales</p>
                          <p className="text-xs text-gray-500">{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "returns" && (
            <>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Returns & Refunds</h2>
                  <p className="text-sm text-gray-500">Manage product returns and refund requests</p>
                </div>
                <select className="px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" style={{ borderColor: '#e5e7eb' }}>
                  <option>All Returns</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Completed</option>
                </select>
              </div>

              {/* Returns Table */}
              <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Return ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td colSpan={8} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mb-4">
                              <TrendingUp className="w-10 h-10 text-orange-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Returns Yet</h3>
                            <p className="text-sm text-gray-500 max-w-md">
                              You don't have any return requests at the moment. When customers request returns, they'll appear here.
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer */}
                <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: '#f3f4f6', backgroundColor: '#fafafa' }}>
                  <p className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">0</span> of <span className="font-semibold text-gray-900">0</span> returns</p>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition-colors" style={{ borderColor: '#e5e7eb' }}>
                      Previous
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "inventory" && (
            <>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Inventory Management</h2>
                  <p className="text-sm text-gray-500">Track and manage your product stock levels</p>
                </div>
                <div className="flex items-center space-x-2">
                  <select className="px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" style={{ borderColor: '#e5e7eb' }}>
                    <option>All Products</option>
                    <option>Low Stock</option>
                    <option>Out of Stock</option>
                    <option>In Stock</option>
                  </select>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add Stock</span>
                  </button>
                </div>
              </div>

              {/* Inventory Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{products.reduce((sum, p) => sum + p.stock, 0)}</p>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <Package className="w-5 h-5 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.stock > 0 && p.stock <= 20).length}</p>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <Package className="w-5 h-5 text-red-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Out of Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.stock === 0).length}</p>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Current Stock</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reserved</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Available</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover border"
                                style={{ borderColor: '#e5e7eb' }}
                              />
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500">ID: #{product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">SKU-{product.id}00{product.stock}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-900">{product.stock}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{Math.floor(product.stock * 0.1)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-gray-900">{product.stock - Math.floor(product.stock * 0.1)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              product.stock > 50 ? 'bg-green-100 text-green-700' : 
                              product.stock > 20 ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-red-100 text-red-700'
                            }`}>
                              {product.stock > 50 ? 'In Stock' : product.stock > 20 ? 'Low Stock' : 'Critical'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Update Stock">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Add Stock">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer */}
                <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: '#f3f4f6', backgroundColor: '#fafafa' }}>
                  <p className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">{products.length}</span> of <span className="font-semibold text-gray-900">{products.length}</span> items</p>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition-colors" style={{ borderColor: '#e5e7eb' }}>
                      Previous
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "payments" && (
            <>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Payments & Transactions</h2>
                  <p className="text-sm text-gray-500">Track your earnings and payment history</p>
                </div>
                <select className="px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" style={{ borderColor: '#e5e7eb' }}>
                  <option>All Transactions</option>
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>Failed</option>
                </select>
              </div>

              {/* Payment Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-6">
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats[0].value}</p>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{orders.filter(o => o.status === 'Processing' || o.status === 'Pending').reduce((sum, order) => {
                      const sellerItems = order.items?.filter((item: any) => item.sellerId === currentSeller?.email) || [];
                      return sum + sellerItems.reduce((itemSum: number, item: any) => itemSum + (item.price * item.quantity), 0);
                    }, 0).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{orders.filter(o => o.status === 'Delivered').reduce((sum, order) => {
                      const sellerItems = order.items?.filter((item: any) => item.sellerId === currentSeller?.email) || [];
                      return sum + sellerItems.reduce((itemSum: number, item: any) => itemSum + (item.price * item.quantity), 0);
                    }, 0).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">In Transit</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{orders.filter(o => o.status === 'Shipped').reduce((sum, order) => {
                      const sellerItems = order.items?.filter((item: any) => item.sellerId === currentSeller?.email) || [];
                      return sum + sellerItems.reduce((itemSum: number, item: any) => itemSum + (item.price * item.quantity), 0);
                    }, 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Transaction ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((order) => {
                        const sellerItems = order.items?.filter((item: any) => item.sellerId === currentSeller?.email) || [];
                        const orderTotal = sellerItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
                        
                        return (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-gray-900">#TXN-{order.id}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700">
                                Sale
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-700">#{order.id}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-green-600">
                                +₹{orderTotal.toLocaleString('en-IN')}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm text-gray-700">
                                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {order.createdAt ? new Date(order.createdAt).getFullYear() : ''}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {order.status || 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end space-x-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mb-4">
                                <DollarSign className="w-10 h-10 text-green-500" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
                              <p className="text-sm text-gray-500 max-w-md">
                                Your payment transactions will appear here once you start receiving orders and payments.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer */}
                <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: '#f3f4f6', backgroundColor: '#fafafa' }}>
                  <p className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">{orders.length}</span> of <span className="font-semibold text-gray-900">{orders.length}</span> transactions</p>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition-colors" style={{ borderColor: '#e5e7eb' }}>
                      Previous
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "support" && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Support Center</h2>
                <p className="text-sm text-gray-500">Get help and raise support tickets</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create New Ticket */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6" style={{ borderColor: '#e5e7eb' }}>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2.5 bg-blue-50 rounded-xl">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Create Support Ticket</h3>
                        <p className="text-sm text-gray-500">We'll get back to you within 24 hours</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                        <input
                          type="text"
                          placeholder="Brief description of your issue"
                          className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          style={{ borderColor: '#e5e7eb' }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                        <select className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" style={{ borderColor: '#e5e7eb' }}>
                          <option>Select a category</option>
                          <option>Account Issues</option>
                          <option>Payment Problems</option>
                          <option>Product Listing</option>
                          <option>Order Management</option>
                          <option>Technical Support</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: 'Low', color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' },
                            { label: 'Medium', color: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100' },
                            { label: 'High', color: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' }
                          ].map((priority) => (
                            <button
                              key={priority.label}
                              className={`px-4 py-2.5 border-2 rounded-xl font-medium text-sm transition-all ${priority.color}`}
                            >
                              {priority.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea
                          rows={6}
                          placeholder="Please describe your issue in detail..."
                          className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
                          style={{ borderColor: '#e5e7eb' }}
                        />
                      </div>

                      <button className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium">
                        <Send className="w-5 h-5" />
                        <span>Submit Ticket</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Help & Stats */}
                <div className="space-y-6">
                  {/* Support Stats */}
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border shadow-sm p-6" style={{ borderColor: '#e5e7eb' }}>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Your Support Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border" style={{ borderColor: '#e5e7eb' }}>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Resolved</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">12</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border" style={{ borderColor: '#e5e7eb' }}>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Pending</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">2</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border" style={{ borderColor: '#e5e7eb' }}>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Total Tickets</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">14</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Help */}
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border shadow-sm p-6" style={{ borderColor: '#e5e7eb' }}>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Help</h3>
                    <div className="space-y-3">
                      {[
                        { title: 'How to add products?', icon: Package },
                        { title: 'Payment setup guide', icon: DollarSign },
                        { title: 'Order management', icon: ShoppingCart },
                        { title: 'Account settings', icon: Users }
                      ].map((item, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center space-x-3 p-3 bg-white rounded-lg border hover:border-purple-300 hover:bg-purple-50 transition-all text-left"
                          style={{ borderColor: '#e5e7eb' }}
                        >
                          <item.icon className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-medium text-gray-700">{item.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Tickets */}
              <div className="mt-6 bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
                <div className="p-6 border-b" style={{ borderColor: '#f3f4f6' }}>
                  <h3 className="text-lg font-bold text-gray-900">Recent Tickets</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ticket ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td colSpan={7} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center mb-4">
                              <Headphones className="w-10 h-10 text-purple-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Support Tickets</h3>
                            <p className="text-sm text-gray-500 max-w-md mb-4">
                              You haven't created any support tickets yet. If you need help, create a ticket above.
                            </p>
                            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                              Create Your First Ticket
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Add Product Form */}
      {showProductModal && (
        <div className="fixed inset-0 bg-white z-40 lg:ml-64 overflow-y-auto">
          {/* Header */}
          <div className="bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => {
                  setShowProductModal(false);
                  setSelectedProduct(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowProductModal(false);
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                style={{ borderColor: '#e5e7eb' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="product-form"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                {selectedProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-50 p-6">
            <form id="product-form" onSubmit={handleProductSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Product Details Card */}
                <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center space-x-2 mb-6">
                    <h3 className="text-base font-semibold text-gray-900">Product Details</h3>
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-500">?</span>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        placeholder="Enter product name"
                        className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        style={{ borderColor: '#e5e7eb' }}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
                        <input
                          type="text"
                          value={productForm.brand}
                          onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                          placeholder="e.g., Nike, Apple"
                          className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          style={{ borderColor: '#e5e7eb' }}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
                        <input
                          type="text"
                          value={productForm.model}
                          onChange={(e) => setProductForm({...productForm, model: e.target.value})}
                          placeholder="Model number"
                          className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          style={{ borderColor: '#e5e7eb' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        style={{ borderColor: '#e5e7eb' }}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Footwear">Footwear</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Home & Kitchen">Home & Kitchen</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        rows={5}
                        placeholder="Describe your product in detail..."
                        className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
                        style={{ borderColor: '#e5e7eb' }}
                        required
                      />
                      <p className="mt-2 text-xs text-gray-500">Provide detailed information about features, specifications, and benefits</p>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-xl border shadow-sm p-6" style={{ borderColor: '#e5e7eb' }}>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b" style={{ borderColor: '#f3f4f6' }}>Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      style={{ borderColor: '#e5e7eb' }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({...productForm, originalPrice: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>
                </div>
              </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Product Images */}
                <div className="bg-white rounded-xl border p-6bmake the quick actions working in dashboard tab" style={{ borderColor: '#e5e7eb' }}>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Product Images</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                      <div className="flex space-x-2">
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="flex-1 px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          style={{ borderColor: '#e5e7eb' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (imageUrl.trim()) {
                              setProductForm({...productForm, images: [...productForm.images, imageUrl.trim()]});
                              setImageUrl("");
                            }
                          }}
                          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Add
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">Add image URLs one at a time</p>
                    </div>

                    {/* Image Preview Grid */}
                    {productForm.images.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Added Images ({productForm.images.length})
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {productForm.images.map((img, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={img}
                                alt={`Product ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border-2"
                                style={{ borderColor: '#e5e7eb' }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setProductForm({
                                    ...productForm,
                                    images: productForm.images.filter((_, i) => i !== index)
                                  });
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              {index === 0 && (
                                <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded">
                                  Primary
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {productForm.images.length === 0 && (
                      <div className="border-2 border-dashed rounded-lg p-8 text-center" style={{ borderColor: '#e5e7eb' }}>
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No images added yet</p>
                        <p className="text-xs text-gray-400 mt-1">Add product images using URLs above</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Product Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                      <input
                        type="text"
                        value={productForm.material}
                        onChange={(e) => setProductForm({...productForm, material: e.target.value})}
                        placeholder="e.g., Leather, Cotton"
                        className="w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        style={{ borderColor: '#e5e7eb' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                      <input
                        type="text"
                        value={productForm.size}
                        onChange={(e) => setProductForm({...productForm, size: e.target.value})}
                        placeholder="e.g., Medium, Large"
                        className="w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        style={{ borderColor: '#e5e7eb' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      <input
                        type="text"
                        value={productForm.color}
                        onChange={(e) => setProductForm({...productForm, color: e.target.value})}
                        placeholder="e.g., Black, Blue"
                        className="w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        style={{ borderColor: '#e5e7eb' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Inventory</h3>
                  <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                    <input
                      type="number"
                      min="0"
                      value={productForm.stockQuantity}
                      onChange={(e) => setProductForm({...productForm, stockQuantity: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      style={{ borderColor: '#e5e7eb' }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Order Quantity *</label>
                    <input
                      type="number"
                      min="1"
                      value={productForm.minOrderQuantity}
                      onChange={(e) => setProductForm({...productForm, minOrderQuantity: parseInt(e.target.value) || 1})}
                      className="w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      style={{ borderColor: '#e5e7eb' }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                    <select
                      value={productForm.condition}
                      onChange={(e) => setProductForm({...productForm, condition: e.target.value as any})}
                      className="w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="refurbished">Refurbished</option>
                    </select>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: '#e5e7eb' }}>
              <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
              <button 
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Product Images */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Product Images</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {selectedProduct.images.map((img: string, index: number) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${selectedProduct.name} ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2"
                        style={{ borderColor: '#e5e7eb' }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Product Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Product Name</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedProduct.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Brand</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedProduct.brand}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedProduct.category}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Model</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedProduct.model || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Price</label>
                  <p className="text-sm font-bold text-gray-900 mt-1">₹{selectedProduct.price}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Original Price</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedProduct.originalPrice ? `₹${selectedProduct.originalPrice}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Stock Quantity</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedProduct.stockQuantity || 0}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Min Order Quantity</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedProduct.minOrderQuantity}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Condition</label>
                  <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{selectedProduct.condition}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Material</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedProduct.material || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Size</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedProduct.size || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Color</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedProduct.color || 'N/A'}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditProduct(selectedProduct);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Edit Product
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  style={{ borderColor: '#e5e7eb' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}