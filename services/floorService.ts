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
import { Floor } from "../types";

export const floorService = {
  async getAll(): Promise<Floor[]> {
    const restaurantId = await getRestaurantId();

    const snap = await getDocs(
      collection(db, "restaurants", restaurantId, "floors")
    );

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Floor[];
  },

  async create(floor: Omit<Floor, "id">) {
    const restaurantId = await getRestaurantId();

    return addDoc(collection(db, "restaurants", restaurantId, "floors"), floor);
  },

  async update(id: string, updates: Partial<Floor>) {
    const restaurantId = await getRestaurantId();

    return updateDoc(
      doc(db, "restaurants", restaurantId, "floors", id),
      updates
    );
  },

  async delete(id: string) {
    const restaurantId = await getRestaurantId();

    return deleteDoc(doc(db, "restaurants", restaurantId, "floors", id));
  },
};
