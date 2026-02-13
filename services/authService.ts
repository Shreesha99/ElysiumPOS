
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
}

const USERS_KEY = 'elysium_users';
const CURRENT_USER_KEY = 'elysium_current_user';

export const authService = {
  getCurrentUser: (): User | null => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  },

  login: async (email: string, password: string): Promise<User> => {
    // Simulated delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.email === email);
    
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    
    throw new Error("Invalid credentials. Try signing up!");
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.some(u => u.email === email)) {
      throw new Error("Email already registered.");
    }
    
    const newUser: User = { id: Math.random().toString(36).substr(2, 9), email, name, role: 'admin' };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
