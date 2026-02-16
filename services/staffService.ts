import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

import { db } from "./firebase";
import { getRestaurantId } from "./restaurantContext";
import { Waiter } from "../types";

export const staffService = {
  /* =========================
     GET ALL STAFF
  ========================== */
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

  /* =========================
     CREATE STAFF (AUTH + DB)
  ========================== */
  async create(name: string, email: string, password: string): Promise<void> {
    const createStaffUser = httpsCallable(functions, "createStaffUser");

    await createStaffUser({
      name,
      email,
      password,
    });
  },

  /* =========================
     UPDATE STAFF
  ========================== */
  async update(id: string, updates: Partial<Waiter>) {
    const restaurantId = await getRestaurantId();

    return updateDoc(
      doc(db, "restaurants", restaurantId, "waiters", id),
      updates
    );
  },

  /* =========================
     DELETE STAFF
  ========================== */
  async delete(id: string) {
    const deleteStaffUser = httpsCallable(functions, "deleteStaffUser");
    await deleteStaffUser({ uid: id });
  },
};
