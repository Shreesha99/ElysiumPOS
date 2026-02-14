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
import { Waiter } from "../types";

export const staffService = {
  async getAll(): Promise<Waiter[]> {
    const restaurantId = await getRestaurantId();

    const snap = await getDocs(
      collection(db, "restaurants", restaurantId, "waiters")
    );

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Waiter[];
  },

  async create(waiter: Omit<Waiter, "id">) {
    const restaurantId = await getRestaurantId();

    return addDoc(
      collection(db, "restaurants", restaurantId, "waiters"),
      waiter
    );
  },

  async update(id: string, updates: Partial<Waiter>) {
    const restaurantId = await getRestaurantId();

    return updateDoc(
      doc(db, "restaurants", restaurantId, "waiters", id),
      updates
    );
  },

  async delete(id: string) {
    const restaurantId = await getRestaurantId();

    return deleteDoc(doc(db, "restaurants", restaurantId, "waiters", id));
  },
};
