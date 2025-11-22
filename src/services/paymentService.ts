import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface Payment {
  id: string;
  sellerId: string;
  sellerEmail: string;
  sellerName: string;
  amount: number;
  paymentMethod: "bank_transfer" | "upi" | "cash" | "cheque";
  transactionId?: string;
  notes?: string;
  status: "pending" | "completed" | "failed";
  paidBy: string; // Admin who made the payment
  paidAt: string;
  createdAt: string;
  updatedAt: string;
}

class PaymentService {
  // Add a new payment
  async addPayment(
    paymentData: Omit<Payment, "id" | "createdAt" | "updatedAt" | "status">
  ): Promise<Payment> {
    try {
      const timestamp = new Date().toISOString();
      
      // Build payment object without undefined values
      const newPayment: any = {
        sellerId: paymentData.sellerId,
        sellerEmail: paymentData.sellerEmail,
        sellerName: paymentData.sellerName,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        paidBy: paymentData.paidBy,
        paidAt: paymentData.paidAt,
        status: "completed" as const,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      // Only add optional fields if they have values
      if (paymentData.transactionId) {
        newPayment.transactionId = paymentData.transactionId;
      }
      if (paymentData.notes) {
        newPayment.notes = paymentData.notes;
      }

      const docRef = await addDoc(collection(db, "payments"), newPayment);
      return { id: docRef.id, ...newPayment };
    } catch (error) {
      console.error("Error adding payment:", error);
      throw error;
    }
  }

  // Get all payments for a specific seller
  async getSellerPayments(sellerEmail: string): Promise<Payment[]> {
    try {
      const q = query(
        collection(db, "payments"),
        where("sellerEmail", "==", sellerEmail),
        orderBy("paidAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Payment)
      );
    } catch (error) {
      console.error("Error getting seller payments:", error);
      return [];
    }
  }

  // Get all payments (for admin)
  async getAllPayments(): Promise<Payment[]> {
    try {
      const q = query(collection(db, "payments"), orderBy("paidAt", "desc"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Payment)
      );
    } catch (error) {
      console.error("Error getting all payments:", error);
      return [];
    }
  }

  // Update payment status
  async updatePaymentStatus(
    paymentId: string,
    status: "pending" | "completed" | "failed"
  ): Promise<void> {
    try {
      const paymentRef = doc(db, "payments", paymentId);
      await updateDoc(paymentRef, {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  }

  // Real-time listener for seller payments
  subscribeToSellerPayments(
    sellerEmail: string,
    callback: (payments: Payment[]) => void
  ): () => void {
    // Query without orderBy to avoid composite index requirement
    const q = query(
      collection(db, "payments"),
      where("sellerEmail", "==", sellerEmail)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const payments = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Payment)
      );
      
      // Sort in memory by paidAt descending
      payments.sort((a, b) => {
        const dateA = new Date(a.paidAt).getTime();
        const dateB = new Date(b.paidAt).getTime();
        return dateB - dateA;
      });
      
      callback(payments);
    });

    return unsubscribe;
  }

  // Calculate total payments for a seller
  async getSellerTotalPayments(sellerEmail: string): Promise<number> {
    try {
      const payments = await this.getSellerPayments(sellerEmail);
      return payments
        .filter((p) => p.status === "completed")
        .reduce((total, payment) => total + payment.amount, 0);
    } catch (error) {
      console.error("Error calculating total payments:", error);
      return 0;
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
