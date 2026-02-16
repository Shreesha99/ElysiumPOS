import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { getRestaurantId } from "./restaurantContext";
import { Table } from "../types";

export const tableService = {
  async getAll(): Promise<Table[]> {
    const restaurantId = await getRestaurantId();

    const snap = await getDocs(
      collection(db, "restaurants", restaurantId, "tables")
    );

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Table[];
  },

  subscribe(callback: (data: Table[]) => void) {
    let unsubscribe: (() => void) | null = null;

    getRestaurantId().then((restaurantId) => {
      const colRef = collection(db, "restaurants", restaurantId, "tables");

      unsubscribe = onSnapshot(colRef, (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Table[];

        callback(data);
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  },

  async create(table: Omit<Table, "id">) {
    const restaurantId = await getRestaurantId();

    return addDoc(collection(db, "restaurants", restaurantId, "tables"), table);
  },

  async update(id: string, updates: Partial<Table>) {
    const restaurantId = await getRestaurantId();

    return updateDoc(
      doc(db, "restaurants", restaurantId, "tables", id),
      updates
    );
  },

  async delete(id: string) {
    const restaurantId = await getRestaurantId();

    return deleteDoc(doc(db, "restaurants", restaurantId, "tables", id));
  },
};
