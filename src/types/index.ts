export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  model: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  material: string;
  size: string;
  condition: "new" | "used" | "refurbished";
  color: string;
  stockQuantity: number;
  minOrderQuantity: number;
  bulkPricing?: {
    quantity: number;
    price: number;
  }[];
  specifications: Record<string, string>;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  productCount?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  status:
    | "pending"
    | "processing"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: "pending" | "completed" | "failed";
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  returnRequested?: boolean;
  returnReason?: string;
  returnStatus?: "pending" | "approved" | "rejected" | "completed";
}

export interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  productId?: string;
  sellerId?: string;
  sellerEmail?: string;
  sellerName?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: "customer" | "admin";
  profileImage?: string;
  dateJoined: string;
}

export interface PaymentMethod {
  id: string;
  type: "credit" | "debit" | "upi" | "wallet";
  last4Digits?: string;
  cardHolderName?: string;
  expiryDate?: string;
  upiId?: string;
  walletName?: string;
  isDefault: boolean;
}

export interface NotificationPreferences {
  orderUpdates: boolean;
  promotionalEmails: boolean;
  smsNotifications: boolean;
  newArrivals: boolean;
  priceDropAlerts: boolean;
}

// Admin Panel Types
export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "super_admin";
  permissions: AdminPermission[];
  lastLogin: string;
  createdAt: string;
}

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  module:
    | "products"
    | "orders"
    | "users"
    | "analytics"
    | "homepage"
    | "categories"
    | "settings";
}

export interface AdminActivity {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
  timezone: string;
  maintenanceMode: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface HomepageContent {
  id: string;
  banners: BannerSlide[];
  marqueeNews: NewsItem[];
  featuredProductsCount: number;
  newArrivalsCount: number;
  showCategories: boolean;
  showFeatures: boolean;
  customSections: CustomSection[];
  updatedAt: string;
  updatedBy: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  order: number;
}

export interface NewsItem {
  id: string;
  text: string;
  icon: "sparkles" | "megaphone" | "star" | "bell";
  isActive: boolean;
  order: number;
}

export interface CustomSection {
  id: string;
  name: string;
  type: "text" | "products" | "categories" | "html";
  content: any;
  isActive: boolean;
  order: number;
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: Order[];
  topProducts: Product[];
  salesByCategory: {
    categoryId: string;
    categoryName: string;
    sales: number;
    revenue: number;
  }[];
  monthlyRevenue: { month: string; revenue: number }[];
  orderStatusDistribution: { status: string; count: number }[];
}

export interface AdminOrder extends Order {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  adminNotes?: string;
  internalStatus: "new" | "reviewed" | "processing" | "fulfilled" | "cancelled";
  assignedTo?: string;
  trackingNumber?: string;
  shippingProvider?: string;
  estimatedDelivery?: string;
}

export interface AdminProduct extends Product {
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  totalSold: number;
  totalRevenue: number;
  averageRating: number;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface AdminCategory extends Category {
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  productCount: number;
  isActive: boolean;
  showOnHomepage: boolean;
  parentId?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    totalOrders?: { min?: number; max?: number };
    totalSpent?: { min?: number; max?: number };
    lastOrderDate?: { before?: string; after?: string };
    location?: string[];
    preferences?: string[];
  };
  customerCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentActivities: AdminActivity[];
  systemHealth: {
    status: "healthy" | "warning" | "critical";
    uptime: string;
    lastBackup: string;
    storageUsed: number;
    storageTotal: number;
  };
  notifications: {
    id: string;
    type: "info" | "warning" | "error" | "success";
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
  }[];
}
