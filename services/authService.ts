import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff";
  restaurantId: string;
}

/* =========================
   INTERNAL USER MAPPER
========================= */
const mapUser = async (firebaseUser: FirebaseUser): Promise<AppUser> => {
  const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

  if (!userDoc.exists()) {
    await signOut(auth);
    throw new Error("User profile not found");
  }

  const data = userDoc.data();

  if (!data.restaurantId) {
    await signOut(auth);
    throw new Error("Restaurant not assigned");
  }

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    name: data.name,
    role: data.role,
    restaurantId: data.restaurantId,
  };
};

export const authService = {
  /* =========================
     LOGIN
  ========================== */
  login: async (email: string, password: string): Promise<AppUser> => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return await mapUser(cred.user);
  },

  /* =========================
     REGISTER ADMIN ONLY
  ========================== */
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AppUser> => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    // Create user profile
    await setDoc(doc(db, "users", uid), {
      name,
      email,
      role: "admin",
      restaurantId: null,
      createdAt: new Date(),
    });

    // Create restaurant
    const restaurantRef = await addDoc(collection(db, "restaurants"), {
      name: `${name}'s Restaurant`,
      ownerId: uid,
      createdAt: new Date(),
    });

    const restaurantId = restaurantRef.id;

    await setDoc(doc(db, "users", uid), { restaurantId }, { merge: true });

    return {
      id: uid,
      email,
      name,
      role: "admin",
      restaurantId,
    };
  },

  logout: async () => {
    await signOut(auth);
  },

  subscribe: (callback: (user: AppUser | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        callback(null);
        return;
      }

      try {
        const user = await mapUser(firebaseUser);
        callback(user);
      } catch {
        callback(null);
      }
    });
  },
};
