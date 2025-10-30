import { User } from '../types';

class AuthService {
  private static instance: AuthService;
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private constructor() {}

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }

  // Set current user in localStorage
  setCurrentUser(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  // Login user
  login(email: string, password: string): User | null {
    // Get all users from localStorage
    const users = this.getUsers();
    
    // Find user by email
    const user = users.find(u => u.email === email);
    
    // For demo purposes, we'll accept any password
    // In a real app, you would validate the password properly
    if (user) {
      this.setCurrentUser(user);
      return user;
    }
    
    return null;
  }

  // Signup new user
  signup(fullName: string, email: string, phone: string, password: string): User | null {
    // Check if user already exists
    const users = this.getUsers();
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      return null; // User already exists
    }
    
    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      fullName,
      phone,
      role: 'customer',
      dateJoined: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set as current user
    this.setCurrentUser(newUser);
    
    return newUser;
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('current_user');
  }

  // Get all users
  private getUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  // Initialize default users if needed
  initializeDefaultUsers(): void {
    if (!localStorage.getItem('users')) {
      const defaultUsers: User[] = [
        {
          id: 'user_1',
          email: 'john.doe@example.com',
          fullName: 'John Doe',
          phone: '+91 98765 43210',
          role: 'customer',
          dateJoined: '2023-01-15'
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
  }
}

export default AuthService.getInstance();