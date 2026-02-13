
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

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'Available' | 'Occupied' | 'Reserved' | 'Dirty';
  currentOrderId?: string;
}

export interface Order {
  id: string;
  tableId?: string;
  items: CartItem[];
  status: 'Pending' | 'In Preparation' | 'Served' | 'Paid';
  timestamp: Date;
  total: number;
}

export interface BusinessInsight {
  title: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}
