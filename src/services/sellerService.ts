import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface Seller {
  id: string;
  email: string;
  ownerName: string;
  storeName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber?: string;
  panNumber?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  businessType: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface SellerProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  model?: string;
  images: string[];
  stockQuantity: number;
  minOrderQuantity: number;
  condition: "new" | "used" | "refurbished";
  material?: string;
  size?: string;
  color?: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  createdAt: string;
  updatedAt: string;
  sales: number;
  slug: string;
  categoryId: string;
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  specifications: Record<string, string>;
}

class SellerService {
  // Seller Authentication & Management
  async registerSeller(sellerData: Omit<Seller, "id" | "createdAt" | "updatedAt">): Promise<Seller> {
    try {
      // Check if seller already exists
      const existingSellerQuery = query(
        collection(db, "sellers"),
        where("email", "==", sellerData.email)
      );
      const existingSellerSnapshot = await getDocs(existingSellerQuery);

      if (!existingSellerSnapshot.empty) {
        throw new Error("Seller with this email already exists");
      }

      const timestamp = new Date().toISOString();
      const newSeller = {
        ...sellerData,
        createdAt: timestamp,
        updatedAt: timestamp,
        isActive: false,
        isVerified: false,
      };

      const docRef = await addDoc(collection(db, "sellers"), newSeller);
      const seller = { id: docRef.id, ...newSeller };

      // Also save to localStorage for quick access
      localStorage.setItem("currentSeller", JSON.stringify(seller));

      return seller;
    } catch (error) {
      console.error("Error registering seller:", error);
      throw error;
    }
  }

  async loginSeller(email: string, _password: string): Promise<Seller | null> {
    try {
      // Query seller by email
      const q = query(collection(db, "sellers"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Seller not found");
      }

      const sellerDoc = querySnapshot.docs[0];
      const seller = { id: sellerDoc.id, ...sellerDoc.data() } as Seller;

      // Check if seller is active - DO NOT save to localStorage if inactive
      if (!seller.isActive) {
        throw new Error("Your account has been deactivated. Please contact support.");
      }

      // Only save to localStorage if seller is active
      localStorage.setItem("currentSeller", JSON.stringify(seller));

      return seller;
    } catch (error) {
      console.error("Error logging in seller:", error);
      throw error;
    }
  }

  async getSellerByEmail(email: string): Promise<Seller | null> {
    try {
      const q = query(collection(db, "sellers"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const sellerDoc = querySnapshot.docs[0];
      return { id: sellerDoc.id, ...sellerDoc.data() } as Seller;
    } catch (error) {
      console.error("Error getting seller:", error);
      return null;
    }
  }

  async updateSeller(sellerId: string, updates: Partial<Seller>): Promise<void> {
    try {
      const sellerRef = doc(db, "sellers", sellerId);
      await updateDoc(sellerRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      // Update localStorage if it's the current seller
      const currentSeller = localStorage.getItem("currentSeller");
      if (currentSeller) {
        const seller = JSON.parse(currentSeller);
        if (seller.id === sellerId) {
          const updatedSeller = { ...seller, ...updates, updatedAt: new Date().toISOString() };
          localStorage.setItem("currentSeller", JSON.stringify(updatedSeller));
        }
      }
    } catch (error) {
      console.error("Error updating seller:", error);
      throw error;
    }
  }

  // Product Management
  async addProduct(product: Omit<SellerProduct, "id" | "createdAt" | "updatedAt">): Promise<SellerProduct> {
    try {
      const timestamp = new Date().toISOString();
      const newProduct = {
        ...product,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const docRef = await addDoc(collection(db, "products"), newProduct);
      return { id: docRef.id, ...newProduct };
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  }

  async updateProduct(productId: string, updates: Partial<SellerProduct>): Promise<void> {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      const productRef = doc(db, "products", productId);
      await deleteDoc(productRef);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  async getSellerProducts(sellerId: string): Promise<SellerProduct[]> {
    try {
      const q = query(
        collection(db, "products"),
        where("sellerId", "==", sellerId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as SellerProduct)
      );
    } catch (error) {
      console.error("Error getting seller products:", error);
      return [];
    }
  }

  async getProductById(productId: string): Promise<SellerProduct | null> {
    try {
      const productRef = doc(db, "products", productId);
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) {
        return null;
      }

      return { id: productDoc.id, ...productDoc.data() } as SellerProduct;
    } catch (error) {
      console.error("Error getting product:", error);
      return null;
    }
  }

  // Get all products (for homepage)
  async getAllProducts(): Promise<SellerProduct[]> {
    try {
      const q = query(
        collection(db, "products"),
        where("isActive", "==", true),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as SellerProduct)
      );
    } catch (error) {
      console.error("Error getting all products:", error);
      return [];
    }
  }

  // Logout
  logoutSeller(): void {
    localStorage.removeItem("currentSeller");
  }

  // Check if seller is logged in
  isSellerLoggedIn(): boolean {
    return localStorage.getItem("currentSeller") !== null;
  }

  // Get current seller from localStorage
  getCurrentSeller(): Seller | null {
    const seller = localStorage.getItem("currentSeller");
    return seller ? JSON.parse(seller) : null;
  }

  // Admin functions
  async getAllSellers(): Promise<Seller[]> {
    try {
      const q = query(collection(db, "sellers"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Seller)
      );
    } catch (error) {
      console.error("Error getting all sellers:", error);
      return [];
    }
  }

  async approveSeller(sellerId: string): Promise<void> {
    try {
      const sellerRef = doc(db, "sellers", sellerId);
      await updateDoc(sellerRef, {
        isVerified: true,
        isActive: true,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error approving seller:", error);
      throw error;
    }
  }

  async deactivateSeller(sellerId: string, reason?: string): Promise<void> {
    try {
      const sellerRef = doc(db, "sellers", sellerId);
      await updateDoc(sellerRef, {
        isActive: false,
        deactivationReason: reason || "Not specified",
        deactivatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error deactivating seller:", error);
      throw error;
    }
  }

  async activateSeller(sellerId: string): Promise<void> {
    try {
      const sellerRef = doc(db, "sellers", sellerId);
      await updateDoc(sellerRef, {
        isActive: true,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error activating seller:", error);
      throw error;
    }
  }

  async deleteSeller(sellerId: string): Promise<void> {
    try {
      const sellerRef = doc(db, "sellers", sellerId);
      await deleteDoc(sellerRef);
    } catch (error) {
      console.error("Error deleting seller:", error);
      throw error;
    }
  }
}

export const sellerService = new SellerService();
export default sellerService;
