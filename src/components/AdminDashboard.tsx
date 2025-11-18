import { useState, useEffect } from "react";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  ArrowUp,
  ArrowDown,
  Store,
  Clock,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalSellers: 0,
    totalRevenue: 0,
    pendingSellers: 0,
    lowStockProducts: 0,
    recentOrders: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load products
    const products = JSON.parse(localStorage.getItem("sellerProducts") || "[]");
    const lowStock = products.filter((p: any) => p.stockQuantity < 10).length;

    // Load sellers
    const sellers = JSON.parse(localStorage.getItem("sellers") || "[]");
    const pendingSellers = sellers.filter((s: any) => s.status === "pending").length;
    const approvedSellers = sellers.filter((s: any) => s.status === "approved").length;

    // Mock data for orders and revenue
    const totalOrders = 156;
    const totalRevenue = 124500;
    const recentOrders = 12;

    setStats({
      totalProducts: products.length,
      totalOrders,
      totalUsers: sellers.length,
      totalSellers: approvedSellers,
      totalRevenue,
      pendingSellers,
      lowStockProducts: lowStock,
      recentOrders,
    });
  };

  const statCards = [
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      label: "Total Products",
      value: stats.totalProducts.toString(),
      change: "+3",
      trend: "up",
      icon: Package,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      label: "Active Sellers",
      value: stats.totalSellers.toString(),
      change: "+5",
      trend: "up",
      icon: Store,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
  ];

  const alertCards = [
    {
      label: "Pending Sellers",
      value: stats.pendingSellers.toString(),
      icon: Clock,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      action: "Review Now",
      link: "/admin/users",
    },
    {
      label: "Low Stock Products",
      value: stats.lowStockProducts.toString(),
      icon: Package,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      action: "View Products",
      link: "/admin/products",
    },
    {
      label: "Recent Orders",
      value: stats.recentOrders.toString(),
      icon: ShoppingCart,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      action: "View Orders",
      link: "/admin/orders",
    },
    {
      label: "Total Users",
      value: stats.totalUsers.toString(),
      icon: Users,
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      action: "Manage Users",
      link: "/admin/users",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, Admin! 👋
        </h2>
        <p className="text-gray-600">
          Here's what's happening with your platform today.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 shadow-sm hover:shadow-lg transition-all p-6 group"
            style={{ borderColor: "#e5e7eb" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`${stat.color} p-3.5 rounded-xl shadow-md group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                {stat.trend === "up" ? (
                  <ArrowUp className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-bold ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-2">
              {stat.label}
            </h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <div
              className="mt-4 pt-4 border-t"
              style={{ borderColor: "#f3f4f6" }}
            >
              <p className="text-xs text-gray-500">vs last period</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts Section */}
        <div className="bg-white rounded-2xl border-2 shadow-sm p-6" style={{ borderColor: "#e5e7eb" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Quick Actions
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Important items requiring attention
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {alertCards.map((alert, index) => (
              <div
                key={index}
                className={`${alert.bgColor} p-4 rounded-xl border-2 hover:shadow-md transition-all`}
                style={{ borderColor: "#e5e7eb" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`${alert.color} p-2.5 rounded-lg`}>
                      <alert.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {alert.label}
                      </p>
                      <p className={`text-2xl font-bold ${alert.textColor}`}>
                        {alert.value}
                      </p>
                    </div>
                  </div>
                  <a
                    href={alert.link}
                    className={`px-4 py-2 ${alert.color} text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity`}
                  >
                    {alert.action}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Chart Placeholder */}
        <div className="bg-white rounded-2xl border-2 shadow-sm p-6" style={{ borderColor: "#e5e7eb" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Sales Overview
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Your sales performance this week
              </p>
            </div>
            <select className="px-4 py-2 border-2 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none" style={{ borderColor: "#e5e7eb" }}>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 relative">
            <svg
              className="w-full h-full"
              viewBox="0 0 400 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="salesGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#3b82f6", stopOpacity: 0.3 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#3b82f6", stopOpacity: 0.05 }}
                  />
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
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, i) => (
                  <span key={i} className="text-xs font-medium text-gray-500">
                    {day}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border-2 shadow-sm" style={{ borderColor: "#e5e7eb" }}>
        <div className="p-6 border-b" style={{ borderColor: "#f3f4f6" }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Recent Activity
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Latest platform activities
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-sm font-semibold transition-colors">
              View All →
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                action: "New seller registered",
                detail: "Awaiting approval",
                time: "5 min ago",
                icon: Store,
                color: "bg-green-100 text-green-600",
              },
              {
                action: "Product added",
                detail: "Leather Wallet by Seller A",
                time: "1 hour ago",
                icon: Package,
                color: "bg-blue-100 text-blue-600",
              },
              {
                action: "Order placed",
                detail: "Order #ORD-156",
                time: "2 hours ago",
                icon: ShoppingCart,
                color: "bg-purple-100 text-purple-600",
              },
              {
                action: "Low stock alert",
                detail: "Running Shoes - 5 units left",
                time: "3 hours ago",
                icon: Package,
                color: "bg-orange-100 text-orange-600",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className={`p-2.5 rounded-lg ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.detail}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
