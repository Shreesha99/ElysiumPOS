export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
}

const USERS_KEY = 'elysium_users_v2';
const CURRENT_USER_KEY = 'elysium_current_user_v2';

export const authService = {
  getCurrentUser: (): User | null => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn("Storage access denied. User session unavailable.");
      return null;
    }
  },

  login: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    let users: User[] = [];
    try {
      users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch (e) {
      console.warn("Storage access denied. Login fallback enabled.");
    }
    
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      try {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } catch (e) {}
      return user;
    }
    
    throw new Error("Credentials not found. Please sign up first.");
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    let users: User[] = [];
    try {
      users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch (e) {}
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("This email is already registered.");
    }
    
    const newUser: User = { 
      id: Math.random().toString(36).substring(2, 9), 
      email: email.toLowerCase(), 
      name, 
      role: 'admin' 
    };
    const updatedUsers = [...users, newUser];
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    } catch (e) {}
    return newUser;
  },

  logout: () => {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch (e) {}
  }
};