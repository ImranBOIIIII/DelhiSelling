import { 
  AdminUser, 
  AdminActivity, 
  SiteSettings, 
  HomepageContent, 
  AdminStats, 
  AdminOrder, 
  AdminProduct, 
  AdminCategory,
  CustomerSegment,
  AdminDashboardData,
  Product,
  Category,
  Order,
  User,
  BannerSlide,
  NewsItem,
  CustomSection
} from '../types';
import { products as initialProducts, categories as initialCategories } from '../data/mockData';

class AdminService {
  private static instance: AdminService;
  
  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  private constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData(): void {
    // Initialize default admin user if not exists
    if (!localStorage.getItem('admin_users')) {
      const defaultAdmin: AdminUser = {
        id: 'admin_1',
        email: 'admin@delhiselling.com',
        fullName: 'Super Admin',
        role: 'super_admin',
        permissions: [
          { id: 'p1', name: 'manage_products', description: 'Manage all products', module: 'products' },
          { id: 'p2', name: 'manage_orders', description: 'Manage all orders', module: 'orders' },
          { id: 'p3', name: 'manage_users', description: 'Manage all users', module: 'users' },
          { id: 'p4', name: 'view_analytics', description: 'View analytics and reports', module: 'analytics' },
          { id: 'p5', name: 'manage_homepage', description: 'Manage homepage content', module: 'homepage' },
          { id: 'p6', name: 'manage_categories', description: 'Manage categories', module: 'categories' },
          { id: 'p7', name: 'manage_settings', description: 'Manage site settings', module: 'settings' }
        ],
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('admin_users', JSON.stringify([defaultAdmin]));
    }

    // Initialize site settings
    if (!localStorage.getItem('site_settings')) {
      const defaultSettings: SiteSettings = {
        id: 'settings_1',
        siteName: 'Delhi Selling',
        siteDescription: 'Premium wholesale bags for retailers',
        contactEmail: 'contact@delhiselling.com',
        contactPhone: '+91-XXXXXXXXXX',
        address: 'Delhi, India',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        maintenanceMode: false,
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin_1'
      };
      localStorage.setItem('site_settings', JSON.stringify(defaultSettings));
    }

    // Initialize homepage content
    if (!localStorage.getItem('homepage_content')) {
      const defaultHomepage: HomepageContent = {
        id: 'homepage_1',
        banners: [
          {
            id: 'banner_1',
            title: 'Quality Bags in',
            subtitle: 'Bulk Quantities',
            description: 'Wholesale bags for retailers. School bags, office bags, travel gear and more.',
            image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1920',
            buttonText: 'Browse Bags',
            buttonLink: '/products',
            isActive: true,
            order: 1
          },
          {
            id: 'banner_2',
            title: 'Premium School',
            subtitle: 'Backpacks',
            description: 'Durable school bags with bulk pricing. Perfect for educational institutions.',
            image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=1920',
            buttonText: 'Shop Now',
            buttonLink: '/products',
            isActive: true,
            order: 2
          }
        ],
        marqueeNews: [
          {
            id: 'news_1',
            text: 'New winter collection just dropped — bulk discounts available',
            icon: 'sparkles',
            isActive: true,
            order: 1
          },
          {
            id: 'news_2',
            text: 'Free delivery on bulk orders above ₹50,000 across India',
            icon: 'megaphone',
            isActive: true,
            order: 2
          }
        ],
        featuredProductsCount: 6,
        newArrivalsCount: 4,
        showCategories: true,
        showFeatures: true,
        customSections: [],
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin_1'
      };
      localStorage.setItem('homepage_content', JSON.stringify(defaultHomepage));
    }

    // Initialize products with admin data
    if (!localStorage.getItem('admin_products')) {
      const adminProducts: AdminProduct[] = initialProducts.map(product => ({
        ...product,
        createdBy: 'admin_1',
        updatedBy: 'admin_1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalSold: Math.floor(Math.random() * 500),
        totalRevenue: Math.floor(Math.random() * 100000),
        averageRating: product.rating,
        tags: ['wholesale', 'bulk', product.material.toLowerCase()],
        seoTitle: `${product.name} - Wholesale Bulk Purchase`,
        seoDescription: `Buy ${product.name} in bulk quantities. ${product.description}`,
        seoKeywords: [product.name, product.brand, product.material, 'wholesale', 'bulk']
      }));
      localStorage.setItem('admin_products', JSON.stringify(adminProducts));
    }

    // Initialize categories with admin data
    if (!localStorage.getItem('admin_categories')) {
      const adminCategories: AdminCategory[] = initialCategories.map(category => ({
        ...category,
        createdBy: 'admin_1',
        updatedBy: 'admin_1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        productCount: 0,
        isActive: true,
        showOnHomepage: true,
        seoTitle: `${category.name} - Wholesale Collection`,
        seoDescription: `${category.description} - Available in bulk quantities for retailers.`
      }));
      localStorage.setItem('admin_categories', JSON.stringify(adminCategories));
    }

    // Initialize orders store without seeding samples
    if (!localStorage.getItem('admin_orders')) {
      localStorage.setItem('admin_orders', JSON.stringify([]));
    } else {
      // Purge legacy dummy/sample orders if present
      this.purgeSampleOrders();
    }

    // Initialize sample users
    if (!localStorage.getItem('admin_customers')) {
      const sampleUsers: User[] = this.generateSampleUsers();
      localStorage.setItem('admin_customers', JSON.stringify(sampleUsers));
    }

    // Initialize activities
    if (!localStorage.getItem('admin_activities')) {
      localStorage.setItem('admin_activities', JSON.stringify([]));
    }

    // Initialize order logs storage
    if (!localStorage.getItem('admin_order_logs')) {
      localStorage.setItem('admin_order_logs', JSON.stringify({}));
    }
  }

  private generateSampleOrders(): AdminOrder[] {
    const orders: AdminOrder[] = [];
    const statuses: AdminOrder['status'][] = ['pending', 'processing', 'confirmed', 'shipped', 'delivered'];
    const internalStatuses: AdminOrder['internalStatus'][] = ['new', 'reviewed', 'processing', 'fulfilled'];

    for (let i = 1; i <= 50; i++) {
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomInternalStatus = internalStatuses[Math.floor(Math.random() * internalStatuses.length)];
      const orderDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      orders.push({
        id: `order_${i}`,
        orderNumber: `ORD-${String(i).padStart(6, '0')}`,
        status: randomStatus,
        totalAmount: Math.floor(Math.random() * 50000) + 5000,
        customerName: `Customer ${i}`,
        customerEmail: `customer${i}@example.com`,
        customerPhone: `+91-98765432${String(i).padStart(2, '0')}`,
        shippingAddress: {
          id: `addr_${i}`,
          fullName: `Customer ${i}`,
          phone: `+91-98765432${String(i).padStart(2, '0')}`,
          addressLine1: `Address Line 1 - ${i}`,
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          isDefault: true
        },
        paymentMethod: 'UPI',
        paymentStatus: Math.random() > 0.2 ? 'completed' : 'pending',
        items: [
          {
            id: `item_${i}`,
            productName: initialProducts[Math.floor(Math.random() * initialProducts.length)].name,
            productImage: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
            quantity: Math.floor(Math.random() * 100) + 10,
            price: Math.floor(Math.random() * 2000) + 500
          }
        ],
        createdAt: orderDate.toISOString(),
        updatedAt: orderDate.toISOString(),
        adminNotes: Math.random() > 0.7 ? `Note for order ${i}` : undefined,
        internalStatus: randomInternalStatus,
        assignedTo: Math.random() > 0.5 ? 'admin_1' : undefined,
        trackingNumber: randomStatus === 'shipped' || randomStatus === 'delivered' ? `TRK${String(i).padStart(8, '0')}` : undefined,
        shippingProvider: randomStatus === 'shipped' || randomStatus === 'delivered' ? ['FedEx', 'DHL', 'Blue Dart'][Math.floor(Math.random() * 3)] : undefined
      });
    }

    return orders;
  }

  private generateSampleUsers(): User[] {
    const users: User[] = [];
    
    for (let i = 1; i <= 100; i++) {
      users.push({
        id: `user_${i}`,
        email: `user${i}@example.com`,
        fullName: `User ${i}`,
        phone: `+91-98765432${String(i).padStart(2, '0')}`,
        role: 'customer',
        profileImage: `https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=200`,
        dateJoined: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    return users;
  }

  // Authentication
  login(email: string, password: string): AdminUser | null {
    const users = this.getAdminUsers();
    const user = users.find(u => u.email === email);
    
    if (user && password === 'Imran@23') { // Validate against the required password
      user.lastLogin = new Date().toISOString();
      this.updateAdminUser(user);
      this.logActivity('admin_login', 'authentication', `Admin ${user.fullName} logged in`);
      return user;
    }
    
    return null;
  }

  getCurrentAdmin(): AdminUser | null {
    const currentAdminData = localStorage.getItem('current_admin');
    return currentAdminData ? JSON.parse(currentAdminData) : null;
  }

  setCurrentAdmin(admin: AdminUser): void {
    localStorage.setItem('current_admin', JSON.stringify(admin));
  }

  logout(): void {
    const currentAdmin = this.getCurrentAdmin();
    if (currentAdmin) {
      this.logActivity('admin_logout', 'authentication', `Admin ${currentAdmin.fullName} logged out`);
    }
    localStorage.removeItem('current_admin');
  }

  // Admin Users
  getAdminUsers(): AdminUser[] {
    const data = localStorage.getItem('admin_users');
    return data ? JSON.parse(data) : [];
  }

  updateAdminUser(user: AdminUser): void {
    const users = this.getAdminUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem('admin_users', JSON.stringify(users));
    }
  }

  // Site Settings
  getSiteSettings(): SiteSettings | null {
    const data = localStorage.getItem('site_settings');
    return data ? JSON.parse(data) : null;
  }

  updateSiteSettings(settings: SiteSettings): void {
    localStorage.setItem('site_settings', JSON.stringify(settings));
    this.logActivity('settings_update', 'settings', 'Site settings updated');
  }

  // Homepage Content
  getHomepageContent(): HomepageContent | null {
    const data = localStorage.getItem('homepage_content');
    return data ? JSON.parse(data) : null;
  }

  updateHomepageContent(content: HomepageContent): void {
    localStorage.setItem('homepage_content', JSON.stringify(content));
    this.logActivity('homepage_update', 'homepage', 'Homepage content updated');
  }

  // Banner Management
  addBanner(bannerData: any): void {
    const content = this.getHomepageContent();
    if (content) {
      const newBanner = {
        ...bannerData,
        id: crypto.randomUUID(),
        order: (content.banners?.length || 0) + 1
      };
      content.banners = [...(content.banners || []), newBanner];
      content.updatedAt = new Date().toISOString();
      content.updatedBy = this.getCurrentAdmin()?.id || 'admin';
      this.updateHomepageContent(content);
      this.logActivity('banner_create', 'homepage', `Banner "${bannerData.title}" created`);
    }
  }

  updateBanner(bannerId: string, bannerData: any): void {
    const content = this.getHomepageContent();
    if (content && content.banners) {
      const bannerIndex = content.banners.findIndex(b => b.id === bannerId);
      if (bannerIndex !== -1) {
        content.banners[bannerIndex] = {
          ...content.banners[bannerIndex],
          ...bannerData,
          id: bannerId
        };
        content.updatedAt = new Date().toISOString();
        content.updatedBy = this.getCurrentAdmin()?.id || 'admin';
        this.updateHomepageContent(content);
        this.logActivity('banner_update', 'homepage', `Banner "${bannerData.title}" updated`);
      }
    }
  }

  deleteBanner(bannerId: string): void {
    const content = this.getHomepageContent();
    if (content && content.banners) {
      const banner = content.banners.find(b => b.id === bannerId);
      content.banners = content.banners.filter(b => b.id !== bannerId);
      content.updatedAt = new Date().toISOString();
      content.updatedBy = this.getCurrentAdmin()?.id || 'admin';
      this.updateHomepageContent(content);
      if (banner) {
        this.logActivity('banner_delete', 'homepage', `Banner "${banner.title}" deleted`);
      }
    }
  }

  // News Management
  addNews(newsData: any): void {
    const content = this.getHomepageContent();
    if (content) {
      const newNews = {
        ...newsData,
        id: crypto.randomUUID(),
        order: (content.marqueeNews?.length || 0) + 1
      };
      content.marqueeNews = [...(content.marqueeNews || []), newNews];
      content.updatedAt = new Date().toISOString();
      content.updatedBy = this.getCurrentAdmin()?.id || 'admin';
      this.updateHomepageContent(content);
      this.logActivity('news_create', 'homepage', `News "${newsData.text}" created`);
    }
  }

  updateNews(newsId: string, newsData: any): void {
    const content = this.getHomepageContent();
    if (content && content.marqueeNews) {
      const newsIndex = content.marqueeNews.findIndex(n => n.id === newsId);
      if (newsIndex !== -1) {
        content.marqueeNews[newsIndex] = {
          ...content.marqueeNews[newsIndex],
          ...newsData,
          id: newsId
        };
        content.updatedAt = new Date().toISOString();
        content.updatedBy = this.getCurrentAdmin()?.id || 'admin';
        this.updateHomepageContent(content);
        this.logActivity('news_update', 'homepage', `News "${newsData.text}" updated`);
      }
    }
  }

  deleteNews(newsId: string): void {
    const content = this.getHomepageContent();
    if (content && content.marqueeNews) {
      const news = content.marqueeNews.find(n => n.id === newsId);
      content.marqueeNews = content.marqueeNews.filter(n => n.id !== newsId);
      content.updatedAt = new Date().toISOString();
      content.updatedBy = this.getCurrentAdmin()?.id || 'admin';
      this.updateHomepageContent(content);
      if (news) {
        this.logActivity('news_delete', 'homepage', `News "${news.text}" deleted`);
      }
    }
  }

  // Homepage Settings
  updateHomepageSettings(settings: any): void {
    const content = this.getHomepageContent();
    if (content) {
      const updatedContent = {
        ...content,
        ...settings,
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentAdmin()?.id || 'admin'
      };
      this.updateHomepageContent(updatedContent);
      this.logActivity('homepage_settings_update', 'homepage', 'Homepage settings updated');
    }
  }

  // Products
  getAdminProducts(): AdminProduct[] {
    const data = localStorage.getItem('admin_products');
    return data ? JSON.parse(data) : [];
  }

  addProduct(product: AdminProduct): void {
    const products = this.getAdminProducts();
    products.push(product);
    localStorage.setItem('admin_products', JSON.stringify(products));
    this.logActivity('product_create', 'products', `Product "${product.name}" created`);
  }

  updateProduct(product: AdminProduct): void {
    const products = this.getAdminProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
      localStorage.setItem('admin_products', JSON.stringify(products));
      this.logActivity('product_update', 'products', `Product "${product.name}" updated`);
    }
  }

  deleteProduct(productId: string): void {
    const products = this.getAdminProducts();
    const product = products.find(p => p.id === productId);
    const filteredProducts = products.filter(p => p.id !== productId);
    localStorage.setItem('admin_products', JSON.stringify(filteredProducts));
    if (product) {
      this.logActivity('product_delete', 'products', `Product "${product.name}" deleted`);
    }
  }

  // Categories
  getAdminCategories(): AdminCategory[] {
    const data = localStorage.getItem('admin_categories');
    return data ? JSON.parse(data) : [];
  }

  // Get categories for frontend use (converts admin categories to Category type)
  getCategories(): Category[] {
    const adminCategories = this.getAdminCategories();
    return adminCategories
      .filter(cat => cat.isActive && cat.showOnHomepage)
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
        description: cat.description,
        imageUrl: cat.imageUrl,
        productCount: cat.productCount || 0
      }));
  }

  // Get all active categories for the categories page
  getAllActiveCategories(): Category[] {
    const adminCategories = this.getAdminCategories();
    return adminCategories
      .filter(cat => cat.isActive)
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
        description: cat.description,
        imageUrl: cat.imageUrl,
        productCount: cat.productCount || 0
      }));
  }

  addCategory(category: AdminCategory): void {
    const categories = this.getAdminCategories();
    categories.push(category);
    localStorage.setItem('admin_categories', JSON.stringify(categories));
    this.logActivity('category_create', 'categories', `Category "${category.name}" created`);
  }

  updateCategory(category: AdminCategory): void {
    const categories = this.getAdminCategories();
    const index = categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      categories[index] = category;
      localStorage.setItem('admin_categories', JSON.stringify(categories));
      this.logActivity('category_update', 'categories', `Category "${category.name}" updated`);
    }
  }

  deleteCategory(categoryId: string): void {
    const categories = this.getAdminCategories();
    const category = categories.find(c => c.id === categoryId);
    const filteredCategories = categories.filter(c => c.id !== categoryId);
    localStorage.setItem('admin_categories', JSON.stringify(filteredCategories));
    if (category) {
      this.logActivity('category_delete', 'categories', `Category "${category.name}" deleted`);
    }
  }

  // Orders
  getAdminOrders(): AdminOrder[] {
    const data = localStorage.getItem('admin_orders');
    return data ? JSON.parse(data) : [];
  }

  private purgeSampleOrders(): void {
    try {
      const orders = this.getAdminOrders();
      const filtered = orders.filter(o => !(String(o.id).startsWith('order_') && (o as any).customerEmail?.endsWith('@example.com')));
      if (filtered.length !== orders.length) {
        localStorage.setItem('admin_orders', JSON.stringify(filtered));
      }
    } catch (_) {
      // no-op
    }
  }

  addOrder(order: Omit<AdminOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): AdminOrder {
    const orders = this.getAdminOrders();
    const nextNumber = orders.length + 1;
    const nowIso = new Date().toISOString();
    const newOrder: AdminOrder = {
      ...order,
      id: crypto.randomUUID(),
      orderNumber: `ORD-${String(nextNumber).padStart(6, '0')}`,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    orders.unshift(newOrder);
    localStorage.setItem('admin_orders', JSON.stringify(orders));
    // Optional: log activity if an admin is logged in
    this.logActivity('order_create', 'orders', `Order ${newOrder.orderNumber} created`);
    return newOrder;
  }

  updateOrder(order: AdminOrder): void {
    const orders = this.getAdminOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index !== -1) {
      orders[index] = order;
      localStorage.setItem('admin_orders', JSON.stringify(orders));
      this.logActivity('order_update', 'orders', `Order ${order.orderNumber} updated`);
    }
  }

  deleteOrder(orderId: string): void {
    const orders = this.getAdminOrders();
    const order = orders.find(o => o.id === orderId);
    const filtered = orders.filter(o => o.id !== orderId);
    localStorage.setItem('admin_orders', JSON.stringify(filtered));
    if (order) {
      this.logActivity('order_delete', 'orders', `Order ${order.orderNumber} deleted`);
    }
    // Remove any stored logs for this order
    const allLogs = this.getAllOrderLogs();
    if (allLogs[orderId]) {
      delete allLogs[orderId];
      localStorage.setItem('admin_order_logs', JSON.stringify(allLogs));
    }
  }

  // Order Logs
  private getAllOrderLogs(): Record<string, { label: string; time: string }[]> {
    const data = localStorage.getItem('admin_order_logs');
    return data ? JSON.parse(data) : {};
  }

  getOrderLogs(orderId: string): { label: string; time: string }[] {
    const all = this.getAllOrderLogs();
    return all[orderId] || [];
  }

  addOrderLog(orderId: string, label: string): { label: string; time: string } {
    const all = this.getAllOrderLogs();
    const entry = { label, time: new Date().toISOString() };
    all[orderId] = [...(all[orderId] || []), entry];
    localStorage.setItem('admin_order_logs', JSON.stringify(all));
    this.logActivity('order_log_add', 'orders', `Log added to order ${orderId}: ${label}`);
    return entry;
  }

  // Customers
  getCustomers(): User[] {
    const data = localStorage.getItem('admin_customers');
    return data ? JSON.parse(data) : [];
  }

  updateCustomer(customer: User): void {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      customers[index] = customer;
      localStorage.setItem('admin_customers', JSON.stringify(customers));
      this.logActivity('customer_update', 'users', `Customer ${customer.fullName} updated`);
    }
  }

  // Activities & Logging
  logActivity(action: string, module: string, details: string): void {
    const currentAdmin = this.getCurrentAdmin();
    if (!currentAdmin) return;

    const activities = this.getActivities();
    const newActivity: AdminActivity = {
      id: crypto.randomUUID(),
      adminId: currentAdmin.id,
      adminName: currentAdmin.fullName,
      action,
      module,
      details,
      timestamp: new Date().toISOString()
    };
    
    activities.unshift(newActivity);
    // Keep only last 1000 activities
    if (activities.length > 1000) {
      activities.splice(1000);
    }
    
    localStorage.setItem('admin_activities', JSON.stringify(activities));
  }

  getActivities(): AdminActivity[] {
    const data = localStorage.getItem('admin_activities');
    return data ? JSON.parse(data) : [];
  }

  // Dashboard & Analytics
  getDashboardData(): AdminDashboardData {
    const products = this.getAdminProducts();
    const orders = this.getAdminOrders();
    const customers = this.getCustomers();
    const activities = this.getActivities();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
    const pendingOrders = orders.filter(o => o.status === 'pending');
    const lowStockProducts = products.filter(p => p.stockQuantity < 10);

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
      topProducts: products.sort((a, b) => b.totalSold - a.totalSold).slice(0, 5),
      salesByCategory: this.getSalesByCategory(),
      monthlyRevenue: this.getMonthlyRevenue(),
      orderStatusDistribution: this.getOrderStatusDistribution()
    };

    return {
      stats,
      recentActivities: activities.slice(0, 10),
      systemHealth: {
        status: 'healthy',
        uptime: '99.9%',
        lastBackup: new Date().toISOString(),
        storageUsed: 45,
        storageTotal: 100
      },
      notifications: []
    };
  }

  private getSalesByCategory(): { categoryId: string; categoryName: string; sales: number; revenue: number }[] {
    const categories = this.getAdminCategories();
    const products = this.getAdminProducts();
    
    return categories.map(category => {
      const categoryProducts = products.filter(p => p.categoryId === category.id);
      const sales = categoryProducts.reduce((sum, p) => sum + p.totalSold, 0);
      const revenue = categoryProducts.reduce((sum, p) => sum + p.totalRevenue, 0);
      
      return {
        categoryId: category.id,
        categoryName: category.name,
        sales,
        revenue
      };
    });
  }

  private getMonthlyRevenue(): { month: string; revenue: number }[] {
    const orders = this.getAdminOrders();
    const monthlyData: { [key: string]: number } = {};
    
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + order.totalAmount;
    });
    
    return Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue }));
  }

  private getOrderStatusDistribution(): { status: string; count: number }[] {
    const orders = this.getAdminOrders();
    const statusCount: { [key: string]: number } = {};
    
    orders.forEach(order => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });
    
    return Object.entries(statusCount).map(([status, count]) => ({ status, count }));
  }
}

export default AdminService.getInstance();