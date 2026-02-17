import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  getDoc,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { getRestaurantId } from "./restaurantContext";
import { Order } from "@/types";
import { canTransition } from "@/core/orderStateMachine";

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

  subscribe(callback: (data: Order[]) => void) {
    let unsubscribe: (() => void) | null = null;

    getRestaurantId().then((restaurantId) => {
      const colRef = query(
        collection(db, "restaurants", restaurantId, "orders"),
        orderBy("createdAt", "desc")
      );

      unsubscribe = onSnapshot(colRef, (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Order[];

        callback(data);
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  },

  async create(order: Omit<Order, "id" | "createdAt" | "updatedAt">) {
    const restaurantId = await getRestaurantId();

    return addDoc(collection(db, "restaurants", restaurantId, "orders"), {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async update(orderId: string, updates: Partial<Order>) {
    const restaurantId = await getRestaurantId();
    const orderRef = doc(db, "restaurants", restaurantId, "orders", orderId);
    let timingUpdates: Partial<Order> = {};

    if (updates.status) {
      if (updates.status === "Preparing") {
        timingUpdates.startedPreparingAt = serverTimestamp() as any;
      }

      if (updates.status === "Served") {
        timingUpdates.servedAt = serverTimestamp() as any;
      }

      if (updates.status === "Paid") {
        timingUpdates.paidAt = serverTimestamp() as any;
      }
    }

    const snapshot = await getDoc(orderRef);
    if (!snapshot.exists()) throw new Error("ORDER_NOT_FOUND");

    const existingOrder = snapshot.data() as Order;

    if (updates.status && updates.status !== existingOrder.status) {
      const valid = canTransition(existingOrder.status, updates.status);
      if (!valid) {
        throw new Error(
          `INVALID_TRANSITION_${existingOrder.status}_TO_${updates.status}`
        );
      }
    }

    return updateDoc(orderRef, {
      ...updates,
      ...timingUpdates,
      updatedAt: serverTimestamp(),
    });
  },

  async updateItemStatus(
    orderId: string,
    menuItemId: string,
    newStatus: "Preparing" | "Ready" | "Served"
  ) {
    const restaurantId = await getRestaurantId();
    const orderRef = doc(db, "restaurants", restaurantId, "orders", orderId);

    const snapshot = await getDoc(orderRef);
    if (!snapshot.exists()) throw new Error("ORDER_NOT_FOUND");

    const order = snapshot.data() as Order;

    const updatedItems = order.items.map((item) => {
      if (item.menuItemId !== menuItemId) return item;

      let timing: any = {};

      if (newStatus === "Preparing") {
        timing.startedAt = Timestamp.now();
      }

      if (newStatus === "Ready") {
        timing.completedAt = Timestamp.now();
      }

      return {
        ...item,
        status: newStatus,
        ...timing,
      };
    });

    return updateDoc(orderRef, {
      items: updatedItems,
      updatedAt: serverTimestamp(),
    });
  },

  async createDiningOrderWithTable(
    order: Omit<Order, "id" | "createdAt" | "updatedAt">,
    tableId: string
  ) {
    const restaurantId = await getRestaurantId();

    const orderRef = doc(collection(db, "restaurants", restaurantId, "orders"));

    const tableRef = doc(db, "restaurants", restaurantId, "tables", tableId);

    await runTransaction(db, async (transaction) => {
      const tableSnap = await transaction.get(tableRef);

      if (!tableSnap.exists()) {
        throw new Error("TABLE_NOT_FOUND");
      }

      const tableData = tableSnap.data();

      if (tableData.status === "Occupied") {
        throw new Error("TABLE_ALREADY_OCCUPIED");
      }

      transaction.set(orderRef, {
        ...order,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      transaction.update(tableRef, {
        status: "Occupied",
        currentOrderId: orderRef.id,
      });
    });

    return orderRef;
  },

  async void(orderId: string, userId: string) {
    const restaurantId = await getRestaurantId();

    return updateDoc(doc(db, "restaurants", restaurantId, "orders", orderId), {
      status: "Voided",
      voidedAt: serverTimestamp(),
      voidedBy: userId,
      updatedAt: serverTimestamp(),
    });
  },
};
