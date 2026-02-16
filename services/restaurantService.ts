import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "./firebase";
import { auth } from "./firebase";

const getRestaurantId = async (): Promise<string> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) throw new Error("User profile missing");

  return userDoc.data().restaurantId;
};

export const orderService = {
  async create(order: any) {
    const restaurantId = await getRestaurantId();
    return addDoc(collection(db, "restaurants", restaurantId, "orders"), order);
  },

  async getAll() {
    const restaurantId = await getRestaurantId();
    const snapshot = await getDocs(
      collection(db, "restaurants", restaurantId, "orders")
    );

    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  },

  subscribe(callback: (data: any[]) => void) {
    let unsubscribe: (() => void) | null = null;

    getRestaurantId().then((restaurantId) => {
      const colRef = collection(db, "restaurants", restaurantId, "orders");

      unsubscribe = onSnapshot(colRef, (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        callback(data);
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  },

  async update(orderId: string, data: any) {
    const restaurantId = await getRestaurantId();
    return updateDoc(
      doc(db, "restaurants", restaurantId, "orders", orderId),
      data
    );
  },

  async delete(orderId: string) {
    const restaurantId = await getRestaurantId();
    return deleteDoc(doc(db, "restaurants", restaurantId, "orders", orderId));
  },
};
