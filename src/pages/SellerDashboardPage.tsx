import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Package, ShoppingCart, TrendingUp, Users, 
  LogOut, Menu, X, Search, DollarSign,
  Eye, Edit, Trash2, Plus, BarChart3, Headphones,
  MessageSquare, Send, CheckCircle, Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SellerDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentSeller, setCurrentSeller] = useState<any>(null);
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

  const handleLogout = () => {
    localStorage.removeItem("currentSeller");
    navigate("/");
  };

  const stats = [
    { label: "Total Revenue", value: "₹1,24,500", change: "+12.5%", icon: DollarSign, color: "bg-green-500" },
    { label: "Total Orders", value: "156", change: "+8.2%", icon: ShoppingCart, color: "bg-blue-500" },
    { label: "Products", value: "48", change: "+3", icon: Package, color: "bg-purple-500" },
    { label: "Customers", value: "892", change: "+15.3%", icon: Users, color: "bg-orange-500" },
  ];

  const recentOrders = [
    { id: "#ORD-001", customer: "Rahul Sharma", product: "Leather Bag", amount: "₹2,499", status: "Delivered", date: "2024-01-15" },
    { id: "#ORD-002", customer: "Priya Singh", product: "Cotton Shirt", amount: "₹899", status: "Processing", date: "2024-01-14" },
    { id: "#ORD-003", customer: "Amit Kumar", product: "Sports Shoes", amount: "₹3,299", status: "Shipped", date: "2024-01-14" },
    { id: "#ORD-004", customer: "Sneha Patel", product: "Handbag", amount: "₹1,799", status: "Pending", date: "2024-01-13" },
  ];

  const products = [
    { id: 1, name: "Leather Wallet", category: "Accessories", price: "₹799", stock: 45, sales: 128, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop" },
    { id: 2, name: "Cotton T-Shirt", category: "Clothing", price: "₹599", stock: 89, sales: 256, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop" },
    { id: 3, name: "Running Shoes", category: "Footwear", price: "₹2,999", stock: 23, sales: 67, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop" },
  ];

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "#f87171" },
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`} style={{ backgroundColor: '#1a1a1a' }}>
        {/* Profile Section */}
        <div className="flex items-center space-x-3 h-16 px-4 border-b" style={{ borderColor: '#2a2a2a' }}>
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
            {currentSeller?.ownerName?.charAt(0).toUpperCase() || "S"}
          </div>
          <span className="text-white font-medium">{currentSeller?.storeName || "Seller"}</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-gray-400 hover:text-white">
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
              onClick={() => setActiveTab(item.id)}
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
            onClick={() => setActiveTab("support")}
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
          {activeTab === "dashboard" && (
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
                      { label: 'Add Product', icon: Plus, color: 'bg-blue-500' },
                      { label: 'View Orders', icon: ShoppingCart, color: 'bg-green-500' },
                      { label: 'Analytics', icon: BarChart3, color: 'bg-purple-500' },
                      { label: 'Support', icon: Headphones, color: 'bg-orange-500' }
                    ].map((action, index) => (
                      <button
                        key={index}
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
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-900">{order.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                {order.customer.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{order.customer}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{order.product}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-900">{order.amount}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{order.date}</span>
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
                      ))}
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
                <button className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md font-medium">
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
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
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
                  <p className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">3</span> of <span className="font-semibold text-gray-900">48</span> products</p>
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
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-900">{order.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{order.customer}</p>
                              <p className="text-xs text-gray-500">Customer</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{order.product}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-900">{order.amount}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm text-gray-700">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                              <p className="text-xs text-gray-500">{new Date(order.date).getFullYear()}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status}
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
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer */}
                <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: '#f3f4f6', backgroundColor: '#fafafa' }}>
                  <p className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">4</span> of <span className="font-semibold text-gray-900">156</span> orders</p>
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
                  <p className="text-2xl font-bold text-gray-900">₹1,24,500</p>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-600">+8.2%</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-50 text-purple-600">+15.3%</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">3.2%</p>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-50 text-orange-600">+23.1%</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">New Customers</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
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
                      {[
                        { id: "#RET-001", customer: "Amit Kumar", product: "Running Shoes", reason: "Size Issue", amount: "₹2,999", date: "2024-01-14", status: "Pending" },
                        { id: "#RET-002", customer: "Priya Singh", product: "Cotton Shirt", reason: "Damaged", amount: "₹899", date: "2024-01-13", status: "Approved" },
                        { id: "#RET-003", customer: "Rahul Sharma", product: "Leather Bag", reason: "Wrong Item", amount: "₹2,499", date: "2024-01-12", status: "Completed" },
                      ].map((returnItem) => (
                        <tr key={returnItem.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-900">{returnItem.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{returnItem.customer}</p>
                              <p className="text-xs text-gray-500">Customer</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{returnItem.product}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{returnItem.reason}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-900">{returnItem.amount}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm text-gray-700">{new Date(returnItem.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                              <p className="text-xs text-gray-500">{new Date(returnItem.date).getFullYear()}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              returnItem.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              returnItem.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                              returnItem.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {returnItem.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                                <Edit className="w-4 h-4" />
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
                  <p className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">3</span> of <span className="font-semibold text-gray-900">12</span> returns</p>
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
                  <p className="text-2xl font-bold text-gray-900">162</p>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <Package className="w-5 h-5 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <Package className="w-5 h-5 text-red-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Out of Stock</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
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
                  <p className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">3</span> of <span className="font-semibold text-gray-900">48</span> items</p>
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
                  <p className="text-2xl font-bold text-gray-900">₹1,24,500</p>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">₹18,750</p>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Withdrawn</p>
                  <p className="text-2xl font-bold text-gray-900">₹95,200</p>
                </div>

                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Available</p>
                  <p className="text-2xl font-bold text-gray-900">₹10,550</p>
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
                      {[
                        { id: "#TXN-001", type: "Sale", orderId: "#ORD-001", amount: "₹2,499", date: "2024-01-15", status: "Completed" },
                        { id: "#TXN-002", type: "Sale", orderId: "#ORD-002", amount: "₹899", date: "2024-01-14", status: "Completed" },
                        { id: "#TXN-003", type: "Withdrawal", orderId: "-", amount: "₹15,000", date: "2024-01-14", status: "Processing" },
                        { id: "#TXN-004", type: "Refund", orderId: "#ORD-003", amount: "₹3,299", date: "2024-01-13", status: "Completed" },
                      ].map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-900">{transaction.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                              transaction.type === 'Sale' ? 'bg-green-50 text-green-700' :
                              transaction.type === 'Withdrawal' ? 'bg-blue-50 text-blue-700' :
                              'bg-red-50 text-red-700'
                            }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{transaction.orderId}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-bold ${
                              transaction.type === 'Sale' ? 'text-green-600' :
                              transaction.type === 'Refund' ? 'text-red-600' :
                              'text-gray-900'
                            }`}>
                              {transaction.type === 'Refund' ? '-' : '+'}{transaction.amount}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm text-gray-700">{new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                              <p className="text-xs text-gray-500">{new Date(transaction.date).getFullYear()}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              transaction.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              transaction.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {transaction.status}
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
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer */}
                <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: '#f3f4f6', backgroundColor: '#fafafa' }}>
                  <p className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">4</span> of <span className="font-semibold text-gray-900">156</span> transactions</p>
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
                      {[
                        { id: "#TKT-001", subject: "Payment not received", category: "Payment", priority: "High", date: "2024-01-15", status: "Pending" },
                        { id: "#TKT-002", subject: "Product listing issue", category: "Technical", priority: "Medium", date: "2024-01-14", status: "In Progress" },
                        { id: "#TKT-003", subject: "Account verification", category: "Account", priority: "Low", date: "2024-01-13", status: "Resolved" },
                      ].map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-900">{ticket.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{ticket.subject}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700">
                              {ticket.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              ticket.priority === 'High' ? 'bg-red-100 text-red-700' :
                              ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{ticket.date}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                              ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Reply">
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}