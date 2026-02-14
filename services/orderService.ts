import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { getRestaurantId } from "./restaurantContext";
import { Order } from "../types";

export const orderService = {
  async getAll(): Promise<Order[]> {
    const restaurantId = await getRestaurantId();

    const snap = await getDocs(
      collection(db, "restaurants", restaurantId, "orders")
    );

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Order[];
  },

  async create(order: Omit<Order, "id">) {
    const restaurantId = await getRestaurantId();

    return addDoc(collection(db, "restaurants", restaurantId, "orders"), order);
  },

  async update(orderId: string, updates: Partial<Order>) {
    const restaurantId = await getRestaurantId();

    return updateDoc(
      doc(db, "restaurants", restaurantId, "orders", orderId),
      updates
    );
  },

  async delete(orderId: string) {
    const restaurantId = await getRestaurantId();

    return deleteDoc(doc(db, "restaurants", restaurantId, "orders", orderId));
  },
};
