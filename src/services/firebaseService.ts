import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import {
  AdminUser,
  AdminActivity,
  SiteSettings,
  HomepageContent,
  AdminOrder,
  AdminProduct,
  AdminCategory,
  User,
  BannerSlide,
  NewsItem,
} from "../types";
import { generateOrderNumber } from "../utils/orderUtils";

class FirebaseService {
  private static instance: FirebaseService;

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  private constructor() {}

  // Admin Users
  async getAdminUsers(): Promise<AdminUser[]> {
    try {
      const q = query(collection(db, "adminUsers"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as AdminUser,
      );
    } catch (error) {
      console.error("Error fetching admin users:", error);
      return [];
    }
  }

  async getAdminUserById(id: string): Promise<AdminUser | null> {
    try {
      const docRef = doc(db, "adminUsers", id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists()
        ? ({ id: docSnap.id, ...docSnap.data() } as AdminUser)
        : null;
    } catch (error) {
      console.error("Error fetching admin user:", error);
      return null;
    }
  }

  async updateAdminUser(user: AdminUser): Promise<void> {
    try {
      const docRef = doc(db, "adminUsers", user.id);
      await updateDoc(docRef, { ...user, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error("Error updating admin user:", error);
      throw error;
    }
  }

  async addAdminUser(user: Omit<AdminUser, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "adminUsers"), {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding admin user:", error);
      throw error;
    }
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings | null> {
    try {
      const q = query(collection(db, "siteSettings"), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as SiteSettings;
      }
      return null;
    } catch (error) {
      console.error("Error fetching site settings:", error);
      return null;
    }
  }

  async updateSiteSettings(settings: SiteSettings): Promise<void> {
    try {
      const docRef = doc(db, "siteSettings", settings.id);
      await updateDoc(docRef, { ...settings, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error("Error updating site settings:", error);
      throw error;
    }
  }

  // Homepage Content
  async getHomepageContent(): Promise<HomepageContent | null> {
    try {
      const q = query(collection(db, "homepageContent"), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as HomepageContent;
      }
      return null;
    } catch (error) {
      console.error("Error fetching homepage content:", error);
      return null;
    }
  }

  async updateHomepageContent(content: HomepageContent): Promise<void> {
    try {
      const docRef = doc(db, "homepageContent", content.id);
      await updateDoc(docRef, { ...content, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error("Error updating homepage content:", error);
      throw error;
    }
  }

  // Banners
  async addBanner(banner: Omit<BannerSlide, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "banners"), {
        ...banner,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding banner:", error);
      throw error;
    }
  }

  async updateBanner(id: string, banner: Partial<BannerSlide>): Promise<void> {
    try {
      const docRef = doc(db, "banners", id);
      await updateDoc(docRef, { ...banner, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error("Error updating banner:", error);
      throw error;
    }
  }

  async deleteBanner(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "banners", id));
    } catch (error) {
      console.error("Error deleting banner:", error);
      throw error;
    }
  }

  async getBanners(): Promise<BannerSlide[]> {
    try {
      const q = query(collection(db, "banners"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as BannerSlide,
      );
    } catch (error) {
      console.error("Error fetching banners:", error);
      return [];
    }
  }

  // News
  async addNews(news: Omit<NewsItem, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "news"), {
        ...news,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding news:", error);
      throw error;
    }
  }

  async updateNews(id: string, news: Partial<NewsItem>): Promise<void> {
    try {
      const docRef = doc(db, "news", id);
      await updateDoc(docRef, { ...news, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error("Error updating news:", error);
      throw error;
    }
  }

  async deleteNews(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "news", id));
    } catch (error) {
      console.error("Error deleting news:", error);
      throw error;
    }
  }

  async getNews(): Promise<NewsItem[]> {
    try {
      const q = query(collection(db, "news"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as NewsItem,
      );
    } catch (error) {
      console.error("Error fetching news:", error);
      return [];
    }
  }

  // Products
  async getProducts(): Promise<AdminProduct[]> {
    try {
      const q = query(collection(db, "products"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as AdminProduct,
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  async getProductById(id: string): Promise<AdminProduct | null> {
    try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists()
        ? ({ id: docSnap.id, ...docSnap.data() } as AdminProduct)
        : null;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  }

  async addProduct(product: Omit<AdminProduct, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "products"), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  }

  async updateProduct(
    id: string,
    product: Partial<AdminProduct>,
  ): Promise<void> {
    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, { ...product, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      // Validate that id is provided and not empty
      if (!id || id.trim() === "") {
        throw new Error("Invalid product ID provided for deletion");
      }
      await deleteDoc(doc(db, "products", id));
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  // Categories
  async getCategories(): Promise<AdminCategory[]> {
    try {
      const q = query(collection(db, "categories"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as AdminCategory,
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  async getCategoryById(id: string): Promise<AdminCategory | null> {
    try {
      const docRef = doc(db, "categories", id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists()
        ? ({ id: docSnap.id, ...docSnap.data() } as AdminCategory)
        : null;
    } catch (error) {
      console.error("Error fetching category:", error);
      return null;
    }
  }

  async addCategory(category: Omit<AdminCategory, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "categories"), {
        ...category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  }

  async updateCategory(
    id: string,
    category: Partial<AdminCategory>,
  ): Promise<void> {
    try {
      // Validate ID before attempting to update
      if (!id || id.trim() === "") {
        throw new Error("Invalid category ID: ID cannot be empty");
      }
      const docRef = doc(db, "categories", id);
      await updateDoc(docRef, { ...category, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      // Validate ID before attempting to delete
      if (!id || id.trim() === "") {
        throw new Error("Invalid category ID: ID cannot be empty");
      }
      await deleteDoc(doc(db, "categories", id));
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }

  // Orders
  async getOrders(): Promise<AdminOrder[]> {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as AdminOrder;
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }

  async getOrderById(id: string): Promise<AdminOrder | null> {
    try {
      const docRef = doc(db, "orders", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as AdminOrder;
      }
      return null;
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  }

  async addOrder(order: Omit<AdminOrder, "id">): Promise<string> {
    try {
      // Generate a unique order number if not provided
      const orderNumber = order.orderNumber || generateOrderNumber();
      
      const docRef = await addDoc(collection(db, "orders"), {
        ...order,
        orderNumber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding order:", error);
      throw error;
    }
  }

  async updateOrder(id: string, order: Partial<AdminOrder>): Promise<void> {
    try {
      const docRef = doc(db, "orders", id);
      await updateDoc(docRef, { ...order, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  }

  async deleteOrder(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "orders", id));
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }

  // Users
  async getUsers(): Promise<User[]> {
    try {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as User,
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists()
        ? ({ id: docSnap.id, ...docSnap.data() } as User)
        : null;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  async addUser(user: Omit<User, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        ...user,
        dateJoined: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }

  async updateUser(id: string, user: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, "users", id);
      await updateDoc(docRef, { ...user });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "users", id));
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  // Activities
  async getActivities(): Promise<AdminActivity[]> {
    try {
      const q = query(
        collection(db, "activities"),
        orderBy("timestamp", "desc"),
        limit(100),
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as AdminActivity,
      );
    } catch (error) {
      console.error("Error fetching activities:", error);
      return [];
    }
  }

  async addActivity(activity: Omit<AdminActivity, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "activities"), {
        ...activity,
        timestamp: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding activity:", error);
      throw error;
    }
  }

  // Real-time listeners
  onProductsChange(callback: (products: AdminProduct[]) => void) {
    const q = query(collection(db, "products"));
    return onSnapshot(q, (querySnapshot) => {
      const products = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as AdminProduct,
      );
      callback(products);
    });
  }

  onCategoriesChange(callback: (categories: AdminCategory[]) => void) {
    const q = query(collection(db, "categories"));
    return onSnapshot(q, (querySnapshot) => {
      const categories = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as AdminCategory,
      );
      callback(categories);
    });
  }

  onOrdersChange(callback: (orders: AdminOrder[]) => void) {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (querySnapshot) => {
      const orders = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as AdminOrder,
      );
      callback(orders);
    });
  }

  onHomepageContentChange(callback: (content: HomepageContent | null) => void) {
    const q = query(collection(db, "homepageContent"), limit(1));
    return onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const content = { id: doc.id, ...doc.data() } as HomepageContent;
        callback(content);
      } else {
        callback(null);
      }
    });
  }
}

export default FirebaseService.getInstance();
