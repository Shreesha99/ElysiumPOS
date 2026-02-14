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
import { MenuItem } from "../types";

export const menuService = {
  async getAll(): Promise<MenuItem[]> {
    const restaurantId = await getRestaurantId();

    const snap = await getDocs(
      collection(db, "restaurants", restaurantId, "menu")
    );

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as MenuItem[];
  },

  async create(item: Omit<MenuItem, "id">) {
    const restaurantId = await getRestaurantId();

    return addDoc(collection(db, "restaurants", restaurantId, "menu"), item);
  },

  async update(id: string, updates: Partial<MenuItem>) {
    const restaurantId = await getRestaurantId();

    return updateDoc(doc(db, "restaurants", restaurantId, "menu", id), updates);
  },

  async delete(id: string) {
    const restaurantId = await getRestaurantId();

    return deleteDoc(doc(db, "restaurants", restaurantId, "menu", id));
  },
};
