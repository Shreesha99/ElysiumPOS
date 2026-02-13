
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
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  },

  login: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    // For POC, we just check email. In reality, use password hashing.
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    
    throw new Error("Credentials not found. Please sign up first.");
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
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
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
