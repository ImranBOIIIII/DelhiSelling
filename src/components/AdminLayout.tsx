import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Home,
  Folder,
  User,
  LogOut,
  Menu,
  X,
  Trash2,
  Edit2,
  Copy,
} from "lucide-react";
// Replace localStorage-based adminService with Firebase admin service
import firebaseAdminService from "../services/firebaseAdminService";
import { AdminOrder, AdminUser } from "../types";

interface AdminLayoutProps {
  onNavigateToSite?: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onNavigateToSite }) => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const admin = firebaseAdminService.getCurrentAdmin();
    if (admin) setCurrentAdmin(admin);

    // Check screen size and set initial sidebar state
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = async () => {
    try {
      // Validate password
      const admin = await firebaseAdminService.login(
        "admin@delhiselling.com",
        password,
      );
      if (admin) {
        setCurrentAdmin(admin);
        firebaseAdminService.setCurrentAdmin(admin);
      } else {
        setError("Invalid password. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };

  const handleLogout = () => {
    firebaseAdminService.logout();
    setCurrentAdmin(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Homepage", href: "/admin/homepage", icon: Home },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Folder },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <LayoutDashboard className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-600 mt-2">Access the admin dashboard</p>
          </div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter admin password"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-indigo-700 transition-colors"
            >
              Login as Admin
            </button>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Enter the admin password to access the panel</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile header with menu button */}
      <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center">
          <LayoutDashboard className="h-8 w-8 text-indigo-600" />
          <h1 className="ml-3 text-xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-20 inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white shadow-lg flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200 hidden md:block">
          <div className="flex items-center">
            <LayoutDashboard className="h-8 w-8 text-indigo-600" />
            <h1 className="ml-3 text-xl font-bold text-gray-900">
              Admin Panel
            </h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon
                  className={`h-5 w-5 mr-3 ${isActive ? "text-indigo-500" : "text-gray-400"}`}
                />
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-gray-500" />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">
                  {currentAdmin.fullName}
                </p>
                <p className="text-xs text-gray-500">{currentAdmin.role}</p>
              </div>
            </div>
            <div className="flex space-x-1">
              {onNavigateToSite && (
                <button
                  onClick={onNavigateToSite}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="View Site"
                >
                  <Home className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-10 bg-black bg-opacity-50"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-100">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/homepage" element={<AdminHomepage />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/categories" element={<AdminCategories />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/analytics" element={<AdminAnalytics />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Categories Management Component
const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const firebaseCategories =
        await firebaseAdminService.getAdminCategories();
      // Filter out categories with empty or invalid IDs
      const validCategories = firebaseCategories.filter(
        (cat) => cat.id && cat.id.trim() !== "",
      );
      setCategories(validCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search categories
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "created":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "products":
        return (b.productCount || 0) - (a.productCount || 0);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = sortedCategories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const saveCategory = async (categoryData: any) => {
    try {
      if (
        editingCategory &&
        editingCategory.id &&
        editingCategory.id.trim() !== ""
      ) {
        // Update existing category
        const updatedCategory = {
          ...categoryData,
          updatedAt: new Date().toISOString(),
          updatedBy: firebaseAdminService.getCurrentAdmin()?.id || "admin",
        };
        await firebaseAdminService.updateCategory(
          editingCategory.id,
          updatedCategory,
        );
      } else {
        // Add new category
        const newCategory = {
          ...categoryData,
          slug: categoryData.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: firebaseAdminService.getCurrentAdmin()?.id || "admin",
          updatedBy: firebaseAdminService.getCurrentAdmin()?.id || "admin",
          productCount: 0,
          isActive: true,
          showOnHomepage: categoryData.showOnHomepage ?? true,
        };
        await firebaseAdminService.addCategory(newCategory);
      }

      // Refresh categories list
      await loadCategories();
      setEditingCategory(null);
      setShowCategoryForm(false);
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category. Please try again.");
    }
  };

  const deleteCategory = async (categoryId: string) => {
    // Validate categoryId
    if (!categoryId || categoryId.trim() === "") {
      alert("Invalid category ID. Cannot delete this category.");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete this category? This action cannot be undone.",
      )
    )
      return;

    try {
      await firebaseAdminService.deleteCategory(categoryId);
      await loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Categories Management
            </h3>
            <p className="text-gray-600 mt-1">
              Manage your product categories and organization
            </p>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              setShowCategoryForm(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add Category</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Categories
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="name">Name</option>
              <option value="created">Date Created</option>
              <option value="products">Product Count</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing {paginatedCategories.length} of{" "}
              {filteredCategories.length} categories
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Homepage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCategories.map((category, index) => {
                const hasValidId = category.id && category.id.trim() !== "";
                return (
                  <tr
                    key={category.id || `category-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {category.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {category.productCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          category.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          category.showOnHomepage
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {category.showOnHomepage ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.createdAt
                        ? new Date(category.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setShowCategoryForm(true);
                        }}
                        disabled={!hasValidId}
                        className={`${
                          hasValidId
                            ? "text-indigo-600 hover:text-indigo-900"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                        title={
                          hasValidId ? "Edit category" : "Invalid category ID"
                        }
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        disabled={!hasValidId}
                        className={`${
                          hasValidId
                            ? "text-red-600 hover:text-red-900"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                        title={
                          hasValidId ? "Delete category" : "Invalid category ID"
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredCategories.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredCategories.length}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onSave={saveCategory}
          onCancel={() => {
            setEditingCategory(null);
            setShowCategoryForm(false);
          }}
        />
      )}
    </div>
  );
};

// CategoryForm Component
const CategoryForm = ({
  category,
  onSave,
  onCancel,
}: {
  category: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    imageUrl: category?.imageUrl || "",
    isActive: category?.isActive ?? true,
    showOnHomepage: category?.showOnHomepage ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-6">
            {category ? "Edit Category" : "Add New Category"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL *
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Active Category
                </span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.showOnHomepage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      showOnHomepage: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Show on Homepage
                </span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {category ? "Update" : "Create"} Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await firebaseAdminService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading dashboard...
      </div>
    );
  }

  const stats = dashboardData?.stats || {};

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Dashboard Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900">Total Products</h4>
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalProducts || 0}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900">Total Orders</h4>
            <p className="text-2xl font-bold text-green-600">
              {stats.totalOrders || 0}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900">Total Users</h4>
            <p className="text-2xl font-bold text-purple-600">
              {stats.totalUsers || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Add more dashboard components here */}
    </div>
  );
};

// Homepage Component with full functionality
const AdminHomepage = () => {
  const [homepageContent, setHomepageContent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("banners");
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomepageContent();
  }, []);

  const loadHomepageContent = async () => {
    try {
      setLoading(true);
      const content = await firebaseAdminService.getHomepageContent();
      setHomepageContent(content);
    } catch (error) {
      console.error("Error loading homepage content:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveBanner = async (bannerData: any) => {
    try {
      if (editingBanner) {
        await firebaseAdminService.updateBanner(editingBanner.id, bannerData);
      } else {
        const newBanner = {
          ...bannerData,
          order: (homepageContent?.banners?.length || 0) + 1,
        };
        await firebaseAdminService.addBanner(newBanner);
      }
      await loadHomepageContent();
      setEditingBanner(null);
      setShowBannerForm(false);
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Failed to save banner. Please try again.");
    }
  };

  const deleteBanner = async (bannerId: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await firebaseAdminService.deleteBanner(bannerId);
      await loadHomepageContent();
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Failed to delete banner. Please try again.");
    }
  };

  const saveNews = async (newsData: any) => {
    try {
      if (editingNews) {
        await firebaseAdminService.updateNews(editingNews.id, newsData);
      } else {
        const newNews = {
          ...newsData,
          order: (homepageContent?.marqueeNews?.length || 0) + 1,
        };
        await firebaseAdminService.addNews(newNews);
      }
      await loadHomepageContent();
      setEditingNews(null);
      setShowNewsForm(false);
    } catch (error) {
      console.error("Error saving news:", error);
      alert("Failed to save news. Please try again.");
    }
  };

  const deleteNews = async (newsId: string) => {
    if (!confirm("Are you sure you want to delete this news item?")) return;
    try {
      await firebaseAdminService.deleteNews(newsId);
      await loadHomepageContent();
    } catch (error) {
      console.error("Error deleting news:", error);
      alert("Failed to delete news. Please try again.");
    }
  };

  const saveSettings = async (settings: any) => {
    try {
      await firebaseAdminService.updateHomepageSettings(settings);
      await loadHomepageContent();
      setShowSettings(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  const tabs = [
    { id: "banners", name: "Hero Banners", icon: "🖼️" },
    { id: "news", name: "Marquee News", icon: "📢" },
    { id: "settings", name: "Layout Settings", icon: "⚙️" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading homepage content...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "banners" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Hero Banners</h3>
                  <p className="text-gray-600">
                    Manage the main banner carousel on your homepage
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingBanner(null);
                    setShowBannerForm(true);
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Add Banner
                </button>
              </div>

              <div className="grid gap-4">
                {homepageContent?.banners?.map((banner: any) => (
                  <div
                    key={banner.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium">
                          {banner.title} {banner.subtitle}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {banner.description}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded ${
                            banner.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {banner.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingBanner(banner);
                          setShowBannerForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteBanner(banner.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "news" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Marquee News</h3>
                  <p className="text-gray-600">
                    Manage the scrolling news ticker on your homepage
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingNews(null);
                    setShowNewsForm(true);
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Add News
                </button>
              </div>

              <div className="grid gap-4">
                {homepageContent?.marqueeNews?.map(
                  (news: any, index: number) => (
                    <div
                      key={news.id || `news-${index}`}
                      className="border rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">
                          {news.icon === "megaphone" ? "📢" : "✨"}
                        </span>
                        <div>
                          <p className="font-medium">{news.text}</p>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded ${
                              news.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {news.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingNews(news);
                            setShowNewsForm(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteNews(news.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Layout Settings</h3>
                  <p className="text-gray-600">
                    Configure homepage layout and display options
                  </p>
                </div>
                <button
                  onClick={() => setShowSettings(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Edit Settings
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Product Display</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      Featured Products:{" "}
                      {homepageContent?.featuredProductsCount || 6}
                    </p>
                    <p>
                      New Arrivals: {homepageContent?.newArrivalsCount || 4}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Section Visibility</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      Categories:{" "}
                      {homepageContent?.showCategories ? "Visible" : "Hidden"}
                    </p>
                    <p>
                      Features:{" "}
                      {homepageContent?.showFeatures ? "Visible" : "Hidden"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Banner Form Modal */}
      {showBannerForm && (
        <BannerForm
          banner={editingBanner}
          onSave={saveBanner}
          onCancel={() => {
            setEditingBanner(null);
            setShowBannerForm(false);
          }}
        />
      )}

      {/* News Form Modal */}
      {showNewsForm && (
        <NewsForm
          news={editingNews}
          onSave={saveNews}
          onCancel={() => {
            setEditingNews(null);
            setShowNewsForm(false);
          }}
        />
      )}

      {/* Settings Form Modal */}
      {showSettings && (
        <SettingsForm
          settings={homepageContent}
          onSave={saveSettings}
          onCancel={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

// Banner Form Component
const BannerForm = ({
  banner,
  onSave,
  onCancel,
}: {
  banner: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: banner?.title || "",
    subtitle: banner?.subtitle || "",
    description: banner?.description || "",
    image: banner?.image || "",
    ctaText: banner?.ctaText || "Shop Now",
    ctaLink: banner?.ctaLink || "/products",
    isActive: banner?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-6">
            {banner ? "Edit Banner" : "Add New Banner"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL *
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CTA Text
              </label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={(e) =>
                  setFormData({ ...formData, ctaText: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CTA Link
              </label>
              <input
                type="text"
                value={formData.ctaLink}
                onChange={(e) =>
                  setFormData({ ...formData, ctaLink: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Active Banner
                </span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {banner ? "Update" : "Create"} Banner
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// News Form Component
const NewsForm = ({
  news,
  onSave,
  onCancel,
}: {
  news: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    text: news?.text || "",
    icon: news?.icon || "megaphone",
    link: news?.link || "",
    isActive: news?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-6">
            {news ? "Edit News" : "Add New News"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                News Text *
              </label>
              <textarea
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="megaphone">Megaphone</option>
                <option value="star">Star</option>
                <option value="bell">Bell</option>
                <option value="info">Info</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link (Optional)
              </label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="/products"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active News</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {news ? "Update" : "Create"} News
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Settings Form Component
const SettingsForm = ({
  settings,
  onSave,
  onCancel,
}: {
  settings: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    featuredProductsCount: settings?.featuredProductsCount || 6,
    newArrivalsCount: settings?.newArrivalsCount || 4,
    showCategories: settings?.showCategories ?? true,
    showFeatures: settings?.showFeatures ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-6">Homepage Settings</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Featured Products Count
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.featuredProductsCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featuredProductsCount: parseInt(e.target.value) || 6,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Arrivals Count
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.newArrivalsCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    newArrivalsCount: parseInt(e.target.value) || 4,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.showCategories}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      showCategories: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Show Categories Section
                </span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.showFeatures}
                  onChange={(e) =>
                    setFormData({ ...formData, showFeatures: e.target.checked })
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Show Features Section
                </span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Products Management Component
const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductsAndCategories();
  }, []);

  const loadProductsAndCategories = async () => {
    try {
      setLoading(true);
      const [firebaseProducts, firebaseCategories] = await Promise.all([
        firebaseAdminService.getAdminProducts(),
        firebaseAdminService.getAdminCategories(),
      ]);
      setProducts(firebaseProducts);
      setCategories(firebaseCategories);

      // Log for debugging
      console.log("Loaded categories:", firebaseCategories);
    } catch (error) {
      console.error("Error loading products and categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price":
        return a.price - b.price;
      case "stock":
        return a.stockQuantity - b.stockQuantity;
      case "created":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const saveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        // Update existing product
        const updatedProduct = {
          ...productData,
          id: editingProduct.id,
          updatedAt: new Date().toISOString(),
          updatedBy: firebaseAdminService.getCurrentAdmin()?.id || "admin",
        };
        await firebaseAdminService.updateProduct(
          editingProduct.id,
          updatedProduct,
        );
      } else {
        // Add new product with random slug
        const newProduct = {
          ...productData,
          slug: generateRandomSlug(10), // Generate random slug
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: firebaseAdminService.getCurrentAdmin()?.id || "admin",
          updatedBy: firebaseAdminService.getCurrentAdmin()?.id || "admin",
          totalSold: 0,
          totalRevenue: 0,
          tags: [
            productData.material?.toLowerCase(),
            "wholesale",
            "bulk",
          ].filter(Boolean),
        };
        await firebaseAdminService.addProduct(newProduct);
      }

      // Refresh products list
      await loadProductsAndCategories();
      setEditingProduct(null);
      setShowProductForm(false);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    }
  };

  const deleteProduct = async (productId: string) => {
    // Validate that productId is provided and not empty
    if (!productId || productId.trim() === "") {
      console.error("Invalid product ID provided for deletion");
      alert("Failed to delete product: Invalid product ID.");
      return;
    }

    // Check if it's a temporary ID
    if (productId.startsWith("temp-")) {
      console.error("Cannot delete product with temporary ID");
      alert(
        "Cannot delete this product. It hasn't been saved to the database yet. Please refresh the page and try again.",
      );
      return;
    }

    // Find the product to get its name for the confirmation dialog
    const product = products.find((p) => p.id === productId);
    const productName = product ? product.name : "this product";

    if (
      !confirm(
        `Are you sure you want to delete "${productName}"?\n\nThis action cannot be undone and will permanently remove this product from your inventory.`,
      )
    )
      return;

    try {
      await firebaseAdminService.deleteProduct(productId);
      alert(`Product "${productName}" has been successfully deleted!`);
      await loadProductsAndCategories();
    } catch (error) {
      console.error("Error deleting product:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to delete product: ${errorMessage}. Please try again.`);
    }
  };

  const duplicateProduct = async (product: any) => {
    try {
      // Generate a random slug for the duplicated product
      const baseName = `${product.name} (Copy)`;
      const newSlug = generateRandomSlug(10); // Generate random slug

      const duplicatedProduct = {
        ...product,
        id: undefined, // Let Firebase generate the ID
        name: baseName,
        slug: newSlug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: firebaseAdminService.getCurrentAdmin()?.id || "admin",
        updatedBy: firebaseAdminService.getCurrentAdmin()?.id || "admin",
      };

      // Remove the id field before sending to Firebase
      const { id, ...productWithoutId } = duplicatedProduct;

      await firebaseAdminService.addProduct(productWithoutId as any);
      await loadProductsAndCategories();
    } catch (error) {
      console.error("Error duplicating product:", error);
      alert("Failed to duplicate product. Please try again.");
    }
  };

  // Helper function to generate random slugs
  const generateRandomSlug = (length: number): string => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading products...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Products Management
            </h3>
            <p className="text-gray-600 mt-1">
              Manage your product catalog, inventory, and pricing
            </p>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowProductForm(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add Product</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Products
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, brand, or model..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
              <option value="created">Date Created</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
              products
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts
                .filter((product) => product.id && product.id.trim() !== "")
                .map((product) => {
                  const category = categories.find(
                    (c) => c.id === product.categoryId,
                  );
                  const isLowStock = product.stockQuantity < 10;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.brand} - {product.model}
                            </div>
                            {product.isFeatured && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </div>
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <div className="text-xs text-gray-500 line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </div>
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm ${isLowStock ? "text-red-600 font-medium" : "text-gray-900"}`}
                        >
                          {product.stockQuantity} units
                        </div>
                        <div className="text-xs text-gray-500">
                          MOQ: {product.minOrderQuantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              product.condition === "new"
                                ? "bg-green-100 text-green-800"
                                : product.condition === "used"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {product.condition}
                          </span>
                          {isLowStock && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Low Stock
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowProductForm(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-600 rounded-md transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => duplicateProduct(product)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 hover:text-white hover:bg-green-600 border border-green-600 rounded-md transition-colors"
                            title="Duplicate product"
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-600"
                            disabled={product.id.startsWith("temp-")}
                            title={
                              product.id.startsWith("temp-")
                                ? "Cannot delete unsaved product"
                                : "Delete product"
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredProducts.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredProducts.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          key={editingProduct ? `edit-${editingProduct.id}` : "new"}
          product={editingProduct}
          categories={categories}
          onSave={saveProduct}
          onCancel={() => {
            setEditingProduct(null);
            setShowProductForm(false);
          }}
        />
      )}
    </div>
  );
};

// ProductForm Component
const ProductForm = ({
  product,
  categories,
  onSave,
  onCancel,
}: {
  product: any;
  categories: any[];
  onSave: (data: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    brand: product?.brand || "",
    model: product?.model || "",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    description: product?.description || "",
    material: product?.material || "",
    size: product?.size || "",
    condition: product?.condition || "new",
    color: product?.color || "",
    stockQuantity: product?.stockQuantity || 0,
    minOrderQuantity: product?.minOrderQuantity || 1,
    isFeatured: product?.isFeatured || false,
    categoryId: product?.categoryId || "",
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Update form data when product or categories change
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        brand: product.brand || "",
        model: product.model || "",
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        description: product.description || "",
        material: product.material || "",
        size: product.size || "",
        condition: product.condition || "new",
        color: product.color || "",
        stockQuantity: product.stockQuantity || 0,
        minOrderQuantity: product.minOrderQuantity || 1,
        isFeatured: product.isFeatured || false,
        categoryId: product.categoryId || "",
      });
    } else {
      // Reset form for new product
      setFormData({
        name: "",
        slug: "",
        brand: "",
        model: "",
        price: 0,
        originalPrice: 0,
        description: "",
        material: "",
        size: "",
        condition: "new",
        color: "",
        stockQuantity: 0,
        minOrderQuantity: 1,
        isFeatured: false,
        categoryId: "",
      });
    }
  }, [product, categories]);

  // For displaying existing images
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    product?.images || [],
  );
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState<string>(""); // New state for image URL

  // Handle file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);

      // Create previews for new images
      const previews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target?.result as string);
          if (previews.length === files.length) {
            setNewImagePreviews((prev) => [...prev, ...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle URL input for images
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  // Add image URL to previews
  const addImageUrl = () => {
    if (imageUrl.trim() && isValidUrl(imageUrl.trim())) {
      setNewImagePreviews((prev) => [...prev, imageUrl.trim()]);
      setImageUrl(""); // Clear the input
    }
  };

  // Validate URL
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Process images - handle both data URLs and regular URLs
    const processImages = async () => {
      const imageDataUrls: string[] = [];

      // Add existing image URLs (these are already processed)
      imageDataUrls.push(...imagePreviews);

      // Process new images
      for (let i = 0; i < newImagePreviews.length; i++) {
        const preview = newImagePreviews[i];

        // Check if it's a data URL (from file upload) or a regular URL
        if (preview.startsWith("data:")) {
          // It's a data URL from file upload, add as is
          imageDataUrls.push(preview);
        } else if (isValidUrl(preview)) {
          // It's a regular URL, add as is
          imageDataUrls.push(preview);
        }
      }

      const processedData = {
        ...formData,
        images: imageDataUrls,
        specifications: {
          Material: formData.material,
          Size: formData.size,
          Color: formData.color,
          Condition: formData.condition,
        },
        rating: product?.rating || 4.5,
        reviewCount: product?.reviewCount || 0,
      };

      onSave(processedData);
    };

    processImages();
  };

  // Helper function to convert File to Data URL
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-6">
            {product ? "Edit Product" : "Add New Product"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2"
                >
                  <span>Select Category</span>
                </button>
                {formData.categoryId && (
                  <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-2 rounded-md">
                    <span className="text-sm text-indigo-900">
                      {categories.find((c) => c.id === formData.categoryId)?.name || "Unknown Category"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, categoryId: "" })}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              {!formData.categoryId && (
                <p className="mt-1 text-sm text-red-600">Please select a category for this product</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      originalPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material
                </label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) =>
                    setFormData({ ...formData, material: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Leather, Canvas, Nylon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) =>
                    setFormData({ ...formData, size: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Medium, Large, 15 inch"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Black, Brown, Blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stockQuantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Order Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.minOrderQuantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minOrderQuantity: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      condition: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images
              </label>
              <div className="mb-4">
                {(imagePreviews.length > 0 || newImagePreviews.length > 0) && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Current Images:
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {imagePreviews.map((img, index) => (
                        <img
                          key={`existing-${index}`}
                          src={img}
                          alt={`Preview ${index}`}
                          className="h-20 w-20 object-cover rounded border"
                        />
                      ))}
                      {newImagePreviews.map((img, index) => (
                        <img
                          key={`new-${index}`}
                          src={img}
                          alt={`New Preview ${index}`}
                          className="h-20 w-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* URL input for images */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Image by URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Enter image URL and click "Add" to include it.
                </p>
              </div>

              {/* File upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Select images from your computer. Hold Ctrl to select multiple
                  images.
                </p>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Featured Product
                </span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                disabled={!formData.categoryId}
              >
                {product ? "Update" : "Create"} Product
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Category Selection Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Select Category</h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, categoryId: category.id });
                      setShowCategoryModal(false);
                    }}
                    className={`p-4 border-2 rounded-lg text-left transition-all hover:border-indigo-500 hover:bg-indigo-50 ${
                      formData.categoryId === category.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {category.imageUrl && (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-600 line-clamp-1">{category.description}</p>
                      </div>
                      {formData.categoryId === category.id && (
                        <div className="text-indigo-600">✓</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {categories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No categories available. Please create categories first.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Orders Management Component
const AdminOrders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | AdminOrder["status"]
  >("all");
  const [internalFilter, setInternalFilter] = useState<
    "all" | AdminOrder["internalStatus"]
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "total" | "status">("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTrack, setShowTrack] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const firebaseOrders = await firebaseAdminService.getAdminOrders();
      setOrders(firebaseOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter((o) => {
    const hay =
      `${o.orderNumber} ${o.customerName} ${o.customerEmail} ${o.customerPhone}`.toLowerCase();
    const passSearch = hay.includes(search.toLowerCase());
    const passStatus = statusFilter === "all" || o.status === statusFilter;
    const passInternal =
      internalFilter === "all" || o.internalStatus === internalFilter;
    return passSearch && passStatus && passInternal;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "total":
        return b.totalAmount - a.totalAmount;
      case "status":
        return a.status.localeCompare(b.status);
      case "date":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = sorted.slice(startIndex, startIndex + itemsPerPage);

  const updateStatus = async (
    order: AdminOrder,
    updates: Partial<AdminOrder>,
  ) => {
    try {
      const updated: AdminOrder = {
        ...order,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await firebaseAdminService.updateOrder(updated);
      await loadOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order. Please try again.");
    }
  };

  const openDetails = (order: AdminOrder) => {
    setSelected(order);
    setShowDetails(true);
  };
  const openTrack = (order: AdminOrder) => {
    setSelected(order);
    setShowTrack(true);
  };
  const openStatusModal = (order: AdminOrder) => {
    setSelected(order);
    setShowStatusModal(true);
  };
  const requestDelete = (orderId: string) => {
    setConfirmDeleteId(orderId);
  };

  const doDelete = async (orderId: string) => {
    try {
      await firebaseAdminService.deleteOrder(orderId);
      await loadOrders();
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Orders Management
        </h3>
        <p className="text-gray-600 mt-1">
          Manage customer orders and track fulfillment
        </p>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Orders
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order number, customer..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date">Date (Newest First)</option>
              <option value="total">Total Amount</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageItems.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.orderNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.items.length} items
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{order.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        {
                          pending: "bg-yellow-100 text-yellow-800",
                          processing: "bg-blue-100 text-blue-800",
                          confirmed: "bg-indigo-100 text-indigo-800",
                          shipped: "bg-purple-100 text-purple-800",
                          delivered: "bg-green-100 text-green-800",
                          cancelled: "bg-red-100 text-red-800",
                        }[order.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openDetails(order)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openStatusModal(order)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Update Status
                      </button>
                      <button
                        onClick={() => requestDelete(order.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetails && selected && (
        <OrderDetailsModal
          order={selected}
          onClose={() => setShowDetails(false)}
          onStatusUpdate={(newStatus) => {
            updateStatus(selected, { status: newStatus });
            setShowDetails(false);
          }}
        />
      )}

      {/* Status Update Modal */}
      {showStatusModal && selected && (
        <OrderStatusModal
          order={selected}
          onClose={() => setShowStatusModal(false)}
          onUpdate={(newStatus) => {
            updateStatus(selected, { status: newStatus });
            setShowStatusModal(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this order? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => doDelete(confirmDeleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({
  order,
  onClose,
  onStatusUpdate,
}: {
  order: AdminOrder;
  onClose: () => void;
  onStatusUpdate: (status: AdminOrder["status"]) => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Order #{order.orderNumber}
            </h3>
            <p className="text-sm text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-xs text-blue-600 font-medium">Order Number</div>
              <div className="text-lg font-mono font-bold text-blue-900">{order.orderNumber}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 font-medium">Order Date</div>
              <div className="text-sm font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 font-medium">Total Amount</div>
              <div className="text-lg font-bold text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Order Status
                </h4>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    {
                      pending: "bg-yellow-100 text-yellow-800",
                      processing: "bg-blue-100 text-blue-800",
                      confirmed: "bg-indigo-100 text-indigo-800",
                      shipped: "bg-purple-100 text-purple-800",
                      delivered: "bg-green-100 text-green-800",
                      cancelled: "bg-red-100 text-red-800",
                    }[order.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => onStatusUpdate(order.status)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Change Status →
              </button>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Customer Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{order.customerPhone}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-medium capitalize">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Shipping Address
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-gray-700 mt-1">
                {order.shippingAddress.addressLine1}
              </p>
              {order.shippingAddress.addressLine2 && (
                <p className="text-gray-700">
                  {order.shippingAddress.addressLine2}
                </p>
              )}
              <p className="text-gray-700">
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.pincode}
              </p>
              <p className="text-gray-700 mt-2">
                Phone: {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ₹{item.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">× {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ₹
                  {order.items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Status Update Modal Component
const OrderStatusModal = ({
  order,
  onClose,
  onUpdate,
}: {
  order: AdminOrder;
  onClose: () => void;
  onUpdate: (status: AdminOrder["status"]) => void;
}) => {
  const [selectedStatus, setSelectedStatus] = useState<AdminOrder["status"]>(
    order.status,
  );

  const statusOptions: Array<{
    value: AdminOrder["status"];
    label: string;
    description: string;
    color: string;
  }> = [
    {
      value: "pending",
      label: "Pending",
      description: "Order received, awaiting confirmation",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "processing",
      label: "Processing",
      description: "Order is being prepared",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "confirmed",
      label: "Confirmed",
      description: "Order confirmed and ready to ship",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      value: "shipped",
      label: "Shipped",
      description: "Order has been shipped",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "delivered",
      label: "Delivered",
      description: "Order delivered to customer",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      description: "Order has been cancelled",
      color: "bg-red-100 text-red-800",
    },
  ];

  const handleUpdate = () => {
    onUpdate(selectedStatus);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Update Order Status
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Order #{order.orderNumber}
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {statusOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedStatus === option.value
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={selectedStatus === option.value}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as AdminOrder["status"])
                  }
                  className="mt-1 mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {option.label}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${option.color}`}
                    >
                      {option.value.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {option.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

// Users Management Component
const AdminUsers = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Users Management
        </h3>
        <p className="text-gray-600 mt-1">
          Manage registered users and their accounts
        </p>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <p className="text-gray-600">
            User management functionality will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
};

// Analytics Component
const AdminAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Analytics Dashboard
        </h3>
        <p className="text-gray-600 mt-1">
          View sales reports and business analytics
        </p>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <p className="text-gray-600">
            Analytics functionality will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
};

// Settings Component
const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900">System Settings</h3>
        <p className="text-gray-600 mt-1">
          Configure application settings and preferences
        </p>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <p className="text-gray-600">
            Settings functionality will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
