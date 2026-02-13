
import React from 'react';
import { MenuItem, Table, Category } from './types';

export const CATEGORIES: Category[] = ['Starters', 'Mains', 'Desserts', 'Drinks', 'Specials'];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Truffle Mushroom Arancini',
    description: 'Crispy risotto balls with wild mushrooms and truffle oil.',
    price: 14.50,
    category: 'Starters',
    image: 'https://picsum.photos/seed/arancini/400/300',
    stock: 25
  },
  {
    id: 'm2',
    name: 'Pan-Seared Sea Bass',
    description: 'Served with lemon caper butter and seasonal greens.',
    price: 28.00,
    category: 'Mains',
    image: 'https://picsum.photos/seed/seabass/400/300',
    stock: 12
  },
  {
    id: 'm3',
    name: 'Wagyu Beef Burger',
    description: 'Brioche bun, aged cheddar, caramelized onions, and truffle fries.',
    price: 24.00,
    category: 'Mains',
    image: 'https://picsum.photos/seed/wagyu/400/300',
    stock: 15
  },
  {
    id: 'm4',
    name: 'Burrata Salad',
    description: 'Creamy burrata, heirloom tomatoes, basil pesto, and balsamic glaze.',
    price: 16.00,
    category: 'Starters',
    image: 'https://picsum.photos/seed/burrata/400/300',
    stock: 20
  },
  {
    id: 'm5',
    name: 'Valrhona Chocolate Fondant',
    description: 'Warm chocolate cake with a molten center and vanilla bean gelato.',
    price: 12.00,
    category: 'Desserts',
    image: 'https://picsum.photos/seed/fondant/400/300',
    stock: 30
  },
  {
    id: 'm6',
    name: 'Signature Old Fashioned',
    description: 'Small-batch bourbon, bitters, and orange peel.',
    price: 15.00,
    category: 'Drinks',
    image: 'https://picsum.photos/seed/cocktail/400/300',
    stock: 100
  },
  {
    id: 'm7',
    name: 'Lobster Ravioli',
    description: 'Handmade pasta stuffed with fresh lobster in a saffron cream sauce.',
    price: 32.00,
    category: 'Specials',
    image: 'https://picsum.photos/seed/lobster/400/300',
    stock: 8
  }
];

export const TABLES: Table[] = [
  { id: 't1', number: 1, capacity: 2, status: 'Available' },
  { id: 't2', number: 2, capacity: 4, status: 'Occupied', currentOrderId: 'o1' },
  { id: 't3', number: 3, capacity: 4, status: 'Available' },
  { id: 't4', number: 4, capacity: 6, status: 'Reserved' },
  { id: 't5', number: 5, capacity: 2, status: 'Dirty' },
  { id: 't6', number: 6, capacity: 4, status: 'Available' },
  { id: 't7', number: 7, capacity: 8, status: 'Occupied', currentOrderId: 'o2' },
  { id: 't8', number: 8, capacity: 2, status: 'Available' },
];
