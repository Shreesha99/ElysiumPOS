import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const getRestaurantId = async (): Promise<string> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  const userSnap = await getDoc(doc(db, "users", uid));
  if (!userSnap.exists()) throw new Error("User profile missing");

  const restaurantId = userSnap.data().restaurantId;
  if (!restaurantId) throw new Error("Restaurant not configured");

  return restaurantId;
};
