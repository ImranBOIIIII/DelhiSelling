import firebaseService from "./firebaseService";
import {
  AdminUser,
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

  // Authentication - Code-based (no Firebase)
  async login(email: string, password: string): Promise<AdminUser | null> {
    // Hardcoded admin credentials
    const validEmail = "admin@delhiselling.com";
    const validPassword = "Imran@23";

    // Validate credentials
    if (email === validEmail && password === validPassword) {
      // Create admin user object
      const adminUser: AdminUser = {
        id: "admin-1",
        email: email,
        fullName: "Admin User",
        role: "admin",
        lastLogin: new Date().toISOString(),
      };

      // Return the admin user without any Firebase calls
      return adminUser;
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
  }

  // Banner Management
  async addBanner(bannerData: Omit<BannerSlide, "id">): Promise<void> {
    await firebaseService.addBanner(bannerData);
  }

  async updateBanner(
    bannerId: string,
    bannerData: Partial<BannerSlide>,
  ): Promise<void> {
    await firebaseService.updateBanner(bannerId, bannerData);
  }

  async deleteBanner(bannerId: string): Promise<void> {
    await firebaseService.deleteBanner(bannerId);
  }

  // News Management
  async addNews(newsData: Omit<NewsItem, "id">): Promise<void> {
    await firebaseService.addNews(newsData);
  }

  async updateNews(newsId: string, newsData: Partial<NewsItem>): Promise<void> {
    await firebaseService.updateNews(newsId, newsData);
  }

  async deleteNews(newsId: string): Promise<void> {
    await firebaseService.deleteNews(newsId);
  }

  // Homepage Settings
  async updateHomepageSettings(
    settings: Partial<HomepageContent>,
  ): Promise<void> {
    const content = await this.getHomepageContent();
    if (content) {
      const updatedContent = { ...content, ...settings };
      await firebaseService.updateHomepageContent(updatedContent);
    }
  }

  // Products
  async getAdminProducts(): Promise<AdminProduct[]> {
    return await firebaseService.getProducts();
  }

  async addProduct(product: Omit<AdminProduct, "id">): Promise<string> {
    const productId = await firebaseService.addProduct(product);
    return productId;
  }

  async updateProduct(
    productId: string,
    product: Partial<AdminProduct>,
  ): Promise<void> {
    await firebaseService.updateProduct(productId, product);
  }

  async deleteProduct(productId: string): Promise<void> {
    // Validate that productId is provided and not empty
    if (!productId || productId.trim() === "") {
      throw new Error("Invalid product ID provided for deletion");
    }

    await firebaseService.deleteProduct(productId);
  }

  // Categories
  async getAdminCategories(): Promise<AdminCategory[]> {
    return await firebaseService.getCategories();
  }

  // Get categories for frontend use (converts admin categories to Category type)
  async getCategories(): Promise<
    Array<{
      id: string;
      name: string;
      slug: string;
      description: string;
      imageUrl: string;
    }>
  > {
    const adminCategories = await this.getAdminCategories();
    return adminCategories
      .filter((cat) => cat.isActive && cat.showOnHomepage)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-"),
        description: cat.description,
        imageUrl: cat.imageUrl,
      }));
  }

  // Get all active categories for the categories page
  async getAllActiveCategories(): Promise<
    Array<{
      id: string;
      name: string;
      slug: string;
      description: string;
      imageUrl: string;
    }>
  > {
    const adminCategories = await this.getAdminCategories();
    return adminCategories
      .filter((cat) => cat.isActive)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-"),
        description: cat.description,
        imageUrl: cat.imageUrl,
      }));
  }

  async addCategory(category: Omit<AdminCategory, "id">): Promise<void> {
    await firebaseService.addCategory(category);
  }

  async updateCategory(
    categoryId: string,
    category: Partial<AdminCategory>,
  ): Promise<void> {
    await firebaseService.updateCategory(categoryId, category);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await firebaseService.deleteCategory(categoryId);
  }

  // Orders
  async getAdminOrders(): Promise<AdminOrder[]> {
    return await firebaseService.getOrders();
  }

  async addOrder(order: Omit<AdminOrder, "id">): Promise<AdminOrder> {
    const orderId = await firebaseService.addOrder(order);
    const newOrder = await firebaseService.getOrderById(orderId);

    if (newOrder) {
      return newOrder;
    }

    throw new Error("Failed to create order");
  }

  async updateOrder(order: AdminOrder): Promise<void> {
    await firebaseService.updateOrder(order.id, order);
  }

  async deleteOrder(orderId: string): Promise<void> {
    await firebaseService.deleteOrder(orderId);
  }

  // Customers
  async getCustomers(): Promise<User[]> {
    return await firebaseService.getUsers();
  }

  async updateCustomer(customer: User): Promise<void> {
    await firebaseService.updateUser(customer.id, customer);
  }

  // Dashboard & Analytics
  async getDashboardData(): Promise<{
    stats: AdminStats;
    systemHealth: {
      status: "healthy" | "warning" | "critical";
      storageUsed: number;
      storageTotal: number;
    };
  }> {
    const products = await this.getAdminProducts();
    const orders = await this.getAdminOrders();
    const customers = await this.getCustomers();

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
        .sort((a, b) => (b.stockQuantity || 0) - (a.stockQuantity || 0))
        .slice(0, 5),
      salesByCategory: await this.getSalesByCategory(),
      monthlyRevenue: this.getMonthlyRevenue(orders),
      orderStatusDistribution: this.getOrderStatusDistribution(orders),
    };

    return {
      stats,
      systemHealth: {
        status: "healthy",
        storageUsed: 45,
        storageTotal: 100,
      },
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

      return {
        categoryId: category.id,
        categoryName: category.name,
        sales: categoryProducts.length,
        revenue: 0,
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
