import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { User } from '../types';

class FirebaseAuthService {
  private static instance: FirebaseAuthService;
  private currentUser: User | null = null;
  
  static getInstance(): FirebaseAuthService {
    if (!FirebaseAuthService.instance) {
      FirebaseAuthService.instance = new FirebaseAuthService();
    }
    return FirebaseAuthService.instance;
  }

  private constructor() {
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        this.syncUserData(user);
      } else {
        // User is signed out
        this.currentUser = null;
        localStorage.removeItem('current_user');
      }
    });
  }

  // Sync user data from Firestore
  private async syncUserData(firebaseUser: FirebaseUser): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        this.currentUser = { id: userDoc.id, ...userDoc.data() } as User;
        localStorage.setItem('current_user', JSON.stringify(this.currentUser));
      }
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }

  // Set current user in localStorage
  setCurrentUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  // Login user
  async login(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const user = { id: userDoc.id, ...userDoc.data() } as User;
        this.setCurrentUser(user);
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  // Signup new user
  async signup(fullName: string, email: string, phone: string, password: string): Promise<User | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user document in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        email,
        fullName,
        phone,
        role: 'customer',
        dateJoined: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      
      this.setCurrentUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Signup error:', error);
      return null;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      this.currentUser = null;
      localStorage.removeItem('current_user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Initialize default users if needed
  async initializeDefaultUsers(): Promise<void> {
    // In Firebase implementation, this is handled by the database
    // We don't need to initialize default users as they'll be created on signup
  }
}

export default FirebaseAuthService.getInstance();