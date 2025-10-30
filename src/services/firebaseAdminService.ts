import firebaseService from "./firebaseService";
import {
  AdminUser,
  AdminActivity,
  SiteSettings,
  HomepageContent,
  AdminStats,
  AdminOrder,
  AdminProduct,
  AdminCategory,
  User,
  BannerSlide,
  NewsItem,
} from "../types";

class FirebaseAdminService {
  private static instance: FirebaseAdminService;

  static getInstance(): FirebaseAdminService {
    if (!FirebaseAdminService.instance) {
      FirebaseAdminService.instance = new FirebaseAdminService();
    }
    return FirebaseAdminService.instance;
  }

  private constructor() {}

  // Authentication
  async login(email: string, password: string): Promise<AdminUser | null> {
    // In a real implementation, you would use Firebase Authentication
    // For now, we'll simulate with a default admin user
    // Accept both 'Imran@23' and 'admin123' as valid passwords for flexibility
    if (password === "Imran@23" || password === "admin123") {
      const users = await firebaseService.getAdminUsers();
      const user = users.find((u) => u.email === email);

      if (user) {
        // Update last login
        const updatedUser = { ...user, lastLogin: new Date().toISOString() };
        await firebaseService.updateAdminUser(updatedUser);
        this.logActivity(
          "admin_login",
          "authentication",
          `Admin ${user.fullName} logged in`,
        );
        return updatedUser;
      } else {
        // Create a default admin user if none exists
        const defaultAdmin: AdminUser = {
          id: "admin-1",
          email: email,
          fullName: "Admin User",
          role: "admin",
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Try to save the default admin user
        try {
          await firebaseService.addAdminUser(defaultAdmin);
          this.logActivity(
            "admin_login",
            "authentication",
            `Default admin ${defaultAdmin.fullName} created and logged in`,
          );
          return defaultAdmin;
        } catch (error) {
          console.error("Error creating default admin user:", error);
          // Return the default admin user even if we can't save it
          return defaultAdmin;
        }
      }
    }

    return null;
  }

  getCurrentAdmin(): AdminUser | null {
    const currentAdminData = localStorage.getItem("current_admin");
    return currentAdminData ? JSON.parse(currentAdminData) : null;
  }

  setCurrentAdmin(admin: AdminUser): void {
    localStorage.setItem("current_admin", JSON.stringify(admin));
  }

  logout(): void {
    const currentAdmin = this.getCurrentAdmin();
    if (currentAdmin) {
      this.logActivity(
        "admin_logout",
        "authentication",
        `Admin ${currentAdmin.fullName} logged out`,
      );
    }
    localStorage.removeItem("current_admin");
  }

  // Admin Users
  async getAdminUsers(): Promise<AdminUser[]> {
    return await firebaseService.getAdminUsers();
  }

  async updateAdminUser(user: AdminUser): Promise<void> {
    await firebaseService.updateAdminUser(user);
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings | null> {
    return await firebaseService.getSiteSettings();
  }

  async updateSiteSettings(settings: SiteSettings): Promise<void> {
    await firebaseService.updateSiteSettings(settings);
    this.logActivity("settings_update", "settings", "Site settings updated");
  }

  // Homepage Content
  async getHomepageContent(): Promise<HomepageContent | null> {
    try {
      // Fetch homepage settings
      const settings = await firebaseService.getHomepageContent();

      // Fetch banners and news from separate collections
      const banners = await firebaseService.getBanners();
      const marqueeNews = await firebaseService.getNews();

      // Combine into homepage content
      return {
        id: settings?.id || "default",
        banners: banners,
        marqueeNews: marqueeNews,
        featuredProductsCount: settings?.featuredProductsCount || 6,
        newArrivalsCount: settings?.newArrivalsCount || 4,
        showCategories: settings?.showCategories !== false,
        showFeatures: settings?.showFeatures !== false,
      };
    } catch (error) {
      console.error("Error fetching homepage content:", error);
      return null;
    }
  }

  async updateHomepageContent(content: HomepageContent): Promise<void> {
    await firebaseService.updateHomepageContent(content);
    this.logActivity("homepage_update", "homepage", "Homepage content updated");
  }

  // Banner Management
  async addBanner(bannerData: Omit<BannerSlide, "id">): Promise<void> {
    await firebaseService.addBanner(bannerData);
    this.logActivity(
      "banner_create",
      "homepage",
      `Banner "${bannerData.title}" created`,
    );
  }

  async updateBanner(
    bannerId: string,
    bannerData: Partial<BannerSlide>,
  ): Promise<void> {
    await firebaseService.updateBanner(bannerId, bannerData);
    this.logActivity("banner_update", "homepage", `Banner updated`);
  }

  async deleteBanner(bannerId: string): Promise<void> {
    // Get banner for logging before deletion
    const banners = await firebaseService.getBanners();
    const banner = banners.find((b) => b.id === bannerId);

    await firebaseService.deleteBanner(bannerId);

    if (banner) {
      this.logActivity(
        "banner_delete",
        "homepage",
        `Banner "${banner.title}" deleted`,
      );
    }
  }

  // News Management
  async addNews(newsData: Omit<NewsItem, "id">): Promise<void> {
    await firebaseService.addNews(newsData);
    this.logActivity(
      "news_create",
      "homepage",
      `News "${newsData.text}" created`,
    );
  }

  async updateNews(newsId: string, newsData: Partial<NewsItem>): Promise<void> {
    await firebaseService.updateNews(newsId, newsData);
    this.logActivity("news_update", "homepage", `News updated`);
  }

  async deleteNews(newsId: string): Promise<void> {
    // Get news for logging before deletion
    const newsItems = await firebaseService.getNews();
    const news = newsItems.find((n) => n.id === newsId);

    await firebaseService.deleteNews(newsId);

    if (news) {
      this.logActivity(
        "news_delete",
        "homepage",
        `News "${news.text}" deleted`,
      );
    }
  }

  // Homepage Settings
  async updateHomepageSettings(
    settings: Partial<HomepageContent>,
  ): Promise<void> {
    const content = await this.getHomepageContent();
    if (content) {
      const updatedContent = { ...content, ...settings };
      await firebaseService.updateHomepageContent(updatedContent);
      this.logActivity(
        "homepage_settings_update",
        "homepage",
        "Homepage settings updated",
      );
    }
  }

  // Products
  async getAdminProducts(): Promise<AdminProduct[]> {
    return await firebaseService.getProducts();
  }

  async addProduct(product: Omit<AdminProduct, "id">): Promise<string> {
    const productId = await firebaseService.addProduct(product);
    this.logActivity(
      "product_create",
      "products",
      `Product "${product.name}" created`,
    );
    return productId;
  }

  async updateProduct(
    productId: string,
    product: Partial<AdminProduct>,
  ): Promise<void> {
    await firebaseService.updateProduct(productId, product);
    this.logActivity("product_update", "products", `Product updated`);
  }

  async deleteProduct(productId: string): Promise<void> {
    // Validate that productId is provided and not empty
    if (!productId || productId.trim() === "") {
      throw new Error("Invalid product ID provided for deletion");
    }

    // Get product for logging before deletion
    const product = await firebaseService.getProductById(productId);

    await firebaseService.deleteProduct(productId);

    if (product) {
      this.logActivity(
        "product_delete",
        "products",
        `Product "${product.name}" deleted`,
      );
    }
  }

  // Categories
  async getAdminCategories(): Promise<AdminCategory[]> {
    return await firebaseService.getCategories();
  }

  // Get categories for frontend use (converts admin categories to Category type)
  async getCategories(): Promise<any[]> {
    const adminCategories = await this.getAdminCategories();
    return adminCategories
      .filter((cat) => cat.isActive && cat.showOnHomepage)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-"),
        description: cat.description,
        imageUrl: cat.imageUrl,
        productCount: cat.productCount || 0,
      }));
  }

  // Get all active categories for the categories page
  async getAllActiveCategories(): Promise<any[]> {
    const adminCategories = await this.getAdminCategories();
    return adminCategories
      .filter((cat) => cat.isActive)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-"),
        description: cat.description,
        imageUrl: cat.imageUrl,
        productCount: cat.productCount || 0,
      }));
  }

  async addCategory(category: Omit<AdminCategory, "id">): Promise<void> {
    await firebaseService.addCategory(category);
    this.logActivity(
      "category_create",
      "categories",
      `Category "${category.name}" created`,
    );
  }

  async updateCategory(
    categoryId: string,
    category: Partial<AdminCategory>,
  ): Promise<void> {
    await firebaseService.updateCategory(categoryId, category);
    this.logActivity("category_update", "categories", `Category updated`);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    // Get category for logging before deletion
    const category = await firebaseService.getCategoryById(categoryId);

    await firebaseService.deleteCategory(categoryId);

    if (category) {
      this.logActivity(
        "category_delete",
        "categories",
        `Category "${category.name}" deleted`,
      );
    }
  }

  // Orders
  async getAdminOrders(): Promise<AdminOrder[]> {
    return await firebaseService.getOrders();
  }

  async addOrder(order: Omit<AdminOrder, "id">): Promise<AdminOrder> {
    const orderId = await firebaseService.addOrder(order);
    const newOrder = await firebaseService.getOrderById(orderId);

    if (newOrder) {
      this.logActivity(
        "order_create",
        "orders",
        `Order ${newOrder.orderNumber} created`,
      );
      return newOrder;
    }

    throw new Error("Failed to create order");
  }

  async updateOrder(order: AdminOrder): Promise<void> {
    await firebaseService.updateOrder(order.id, order);
    this.logActivity(
      "order_update",
      "orders",
      `Order ${order.orderNumber} updated`,
    );
  }

  async deleteOrder(orderId: string): Promise<void> {
    // Get order for logging before deletion
    const order = await firebaseService.getOrderById(orderId);

    await firebaseService.deleteOrder(orderId);

    if (order) {
      this.logActivity(
        "order_delete",
        "orders",
        `Order ${order.orderNumber} deleted`,
      );
    }
  }

  // Customers
  async getCustomers(): Promise<User[]> {
    return await firebaseService.getUsers();
  }

  async updateCustomer(customer: User): Promise<void> {
    await firebaseService.updateUser(customer.id, customer);
    this.logActivity(
      "customer_update",
      "users",
      `Customer ${customer.fullName} updated`,
    );
  }

  // Activities & Logging
  async logActivity(
    action: string,
    module: string,
    details: string,
  ): Promise<void> {
    const currentAdmin = this.getCurrentAdmin();
    if (!currentAdmin) return;

    const activity: Omit<AdminActivity, "id"> = {
      adminId: currentAdmin.id,
      adminName: currentAdmin.fullName,
      action,
      module,
      details,
      timestamp: new Date().toISOString(),
    };

    await firebaseService.addActivity(activity);
  }

  async getActivities(): Promise<AdminActivity[]> {
    return await firebaseService.getActivities();
  }

  // Dashboard & Analytics
  async getDashboardData(): Promise<any> {
    const products = await this.getAdminProducts();
    const orders = await this.getAdminOrders();
    const customers = await this.getCustomers();
    const activities = await this.getActivities();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter((o) => new Date(o.createdAt) >= today);
    const pendingOrders = orders.filter((o) => o.status === "pending");
    const lowStockProducts = products.filter((p) => p.stockQuantity < 10);

    const stats: AdminStats = {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: customers.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      pendingOrders: pendingOrders.length,
      lowStockProducts: lowStockProducts.length,
      recentOrders: orders.slice(0, 5),
      topProducts: products
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 5),
      salesByCategory: await this.getSalesByCategory(),
      monthlyRevenue: this.getMonthlyRevenue(orders),
      orderStatusDistribution: this.getOrderStatusDistribution(orders),
    };

    return {
      stats,
      recentActivities: activities.slice(0, 10),
      systemHealth: {
        status: "healthy",
        uptime: "99.9%",
        lastBackup: new Date().toISOString(),
        storageUsed: 45,
        storageTotal: 100,
      },
      notifications: [],
    };
  }

  private async getSalesByCategory(): Promise<
    {
      categoryId: string;
      categoryName: string;
      sales: number;
      revenue: number;
    }[]
  > {
    const categories = await this.getAdminCategories();
    const products = await this.getAdminProducts();

    return categories.map((category) => {
      const categoryProducts = products.filter(
        (p) => p.categoryId === category.id,
      );
      const sales = categoryProducts.reduce((sum, p) => sum + p.totalSold, 0);
      const revenue = categoryProducts.reduce(
        (sum, p) => sum + p.totalRevenue,
        0,
      );

      return {
        categoryId: category.id,
        categoryName: category.name,
        sales,
        revenue,
      };
    });
  }

  private getMonthlyRevenue(
    orders: AdminOrder[],
  ): { month: string; revenue: number }[] {
    const monthlyData: { [key: string]: number } = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + order.totalAmount;
    });

    return Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  }

  private getOrderStatusDistribution(
    orders: AdminOrder[],
  ): { status: string; count: number }[] {
    const statusCount: { [key: string]: number } = {};

    orders.forEach((order) => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });

    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
    }));
  }
}

export default FirebaseAdminService.getInstance();
