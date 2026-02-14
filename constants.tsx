import { MenuItem, Table, Category, Waiter, Floor } from './types';

export const CATEGORIES: Category[] = ['Starters', 'Mains', 'Desserts', 'Drinks', 'Specials'];

export const INITIAL_FLOORS: Floor[] = [
  { id: 'f1', name: 'Main Hall', width: 20, height: 20 },
  { id: 'f2', name: 'Terrace', width: 15, height: 15 },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Truffle Mushroom Arancini',
    description: 'Golden risotto spheres with wild porcini, black truffle, and aged parmesan.',
    price: 450,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=600',
    stock: 12
  },
  {
    id: 'm2',
    name: 'Chilean Sea Bass',
    description: 'Miso-glazed sea bass, bok choy, and ginger-infused dashi broth.',
    price: 1250,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600',
    stock: 8
  },
  {
    id: 'm3',
    name: 'Wagyu Burger',
    description: 'A5 Wagyu, truffle aioli, brioche, and triple-cooked fries.',
    price: 950,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
    stock: 15
  }
];

export const INITIAL_TABLES: Table[] = [
  { id: 't1', number: 1, capacity: 2, status: 'Available', x: 2, y: 2, width: 2, height: 2, floorId: 'f1', rotation: 0 },
  { id: 't2', number: 2, capacity: 4, status: 'Available', x: 6, y: 2, width: 3, height: 2, floorId: 'f1', rotation: 0 },
  { id: 't4', number: 4, capacity: 6, status: 'Available', x: 2, y: 6, width: 4, height: 3, floorId: 'f1', rotation: 0 },
  { id: 't7', number: 7, capacity: 4, status: 'Available', x: 5, y: 5, width: 3, height: 3, floorId: 'f2', rotation: 45 },
];

export const INITIAL_WAITERS: Waiter[] = [
  { 
    id: 'w1', 
    name: 'Arjun Mehta', 
    role: 'Head Server',
    status: 'Active', 
    assignedTables: ['t1', 't2'], 
    shiftStart: '09:00', 
    shiftEnd: '17:00', 
    leaveDates: [] 
  },
  { 
    id: 'w2', 
    name: 'Sanya Sharma', 
    role: 'Captain',
    status: 'Active', 
    assignedTables: ['t3', 't5'], 
    shiftStart: '10:00', 
    shiftEnd: '18:00', 
    leaveDates: [] 
  },
];