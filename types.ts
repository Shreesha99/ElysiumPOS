import { Timestamp } from "firebase/firestore";

export type Category =
  | "Starters"
  | "Mains"
  | "Desserts"
  | "Drinks"
  | "Specials";
export type OrderType = "Dining" | "Takeaway";
export type StaffStatus = "Active" | "On Break" | "Offline" | "On Leave";
export type FoodType = "Veg" | "NonVeg" | "Egg";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
  foodType: FoodType;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Waiter {
  id: string;
  name: string;
  role: string;
  status: StaffStatus;
  assignedTables: string[]; // Table IDs
  shiftStart: string;
  shiftEnd: string;
  leaveDates: string[]; // ISO Strings
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
  status: "Available" | "Occupied" | "Reserved" | "Dirty";
  currentOrderId?: string;
  floorId: string; // reference to Floor
  // Spatial data for 3D floor map (grid units)
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export type KitchenStation = "Grill" | "Fry" | "Drinks" | "Dessert" | "General";

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;

  status: "Queued" | "Preparing" | "Ready" | "Served";
  station: KitchenStation;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
}

export interface Order {
  id: string;
  tableId: string | null;
  floorId: string | null;
  status: "Pending" | "Preparing" | "Served" | "Paid" | "Voided";
  orderType: "Dining" | "Takeaway";
  paymentStatus: "Unpaid" | "Paid";
  items: OrderItem[];
  total: number;
  waiterId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  startedPreparingAt?: Timestamp;
  servedAt?: Timestamp;
  paidAt?: Timestamp;
  voidedAt?: Timestamp;
  voidedBy?: string;
}

export interface BusinessInsight {
  title: string;
  value: string;
  trend: "up" | "down" | "neutral";
  description: string;
  category: "Revenue" | "Operations" | "Menu" | "Customer";
  impact: "High" | "Medium" | "Low";
}
