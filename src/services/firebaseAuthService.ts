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
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Throw user-friendly error messages
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later.');
      } else if (error.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled.');
      } else {
        throw new Error('Failed to sign in. Please try again.');
      }
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
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Throw user-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please sign in instead.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address. Please check and try again.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use at least 6 characters.');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password accounts are not enabled. Please contact support.');
      } else {
        throw new Error('Failed to create account. Please try again.');
      }
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