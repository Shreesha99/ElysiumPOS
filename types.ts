
export type Category = 'Starters' | 'Mains' | 'Desserts' | 'Drinks' | 'Specials';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Waiter {
  id: string;
  name: string;
  status: 'Active' | 'On Break' | 'Offline';
  assignedTables: string[]; // Table IDs
  shiftStart: string;
}

export interface Floor {
  id: string;
  name: string;
  width: number; // in grid units
  height: number; // in grid units
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'Available' | 'Occupied' | 'Reserved' | 'Dirty';
  currentOrderId?: string;
  floorId: string; // reference to Floor
  // Spatial data for 3D floor map (grid units)
  x: number; 
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export interface Order {
  id: string;
  tableId?: string;
  items: CartItem[];
  status: 'Pending' | 'In Preparation' | 'Served' | 'Paid';
  timestamp: string;
  total: number;
  subtotal: number;
  tax: number;
}

export interface BusinessInsight {
  title: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}
