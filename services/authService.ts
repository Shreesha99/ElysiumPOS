
export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: 'admin' | 'staff';
}

const USERS_KEY = 'elysium_users_v3';
const CURRENT_USER_KEY = 'elysium_current_user_v3';

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

  login: async (username: string, password: string): Promise<User> => {
    // Artificial latency for premium feel
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    let users: User[] = [];
    try {
      users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch (e) {
      console.warn("Storage access denied.");
    }
    
    // In a real app, we'd check password hash
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (user) {
      try {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } catch (e) {}
      return user;
    }
    
    throw new Error("Invalid username or access key. Please verify credentials.");
  },

  signup: async (name: string, email: string, username: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let users: User[] = [];
    try {
      users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch (e) {}
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("This email is already registered in our node network.");
    }

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error("This username is already claimed.");
    }
    
    const newUser: User = { 
      id: Math.random().toString(36).substring(2, 9), 
      email: email.toLowerCase(), 
      username: username.toLowerCase(),
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
