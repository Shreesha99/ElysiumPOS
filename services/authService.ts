import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

/* ======================================================
   USER TYPE (this matches what App.tsx expects)
====================================================== */

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff";
  restaurantId: string;
}

/* ======================================================
   INTERNAL MAPPER
====================================================== */

const mapUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

  if (!userDoc.exists()) {
    throw new Error("User profile not found");
  }

  const data = userDoc.data();

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    name: data.name,
    role: data.role,
    restaurantId: data.restaurantId,
  };
};

/* ======================================================
   AUTH SERVICE
====================================================== */

export const authService = {
  /* ---------- LOGIN ---------- */
  login: async (email: string, password: string): Promise<User> => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return await mapUser(cred.user);
  },

  /* ---------- REGISTER ---------- */
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<User> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      /* STEP 1: Create temporary user profile */
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        role: "admin",
        restaurantId: null,
        createdAt: new Date(),
      });

      /* STEP 2: Create restaurant */
      const restaurantRef = await addDoc(collection(db, "restaurants"), {
        name: `${name}'s Restaurant`,
        ownerId: uid,
        createdAt: new Date(),
      });

      const restaurantId = restaurantRef.id;

      /* STEP 3: Update user with restaurantId */
      await setDoc(
        doc(db, "users", uid),
        {
          restaurantId,
        },
        { merge: true }
      );

      return {
        id: uid,
        email,
        name,
        role: "admin",
        restaurantId,
      };
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  /* ---------- LOGOUT ---------- */
  logout: async () => {
    await signOut(auth);
  },

  /* ---------- SYNC CURRENT USER (minimal) ---------- */
  getCurrentUser: (): User | null => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || "",
      role: "admin",
      restaurantId: "",
    };
  },

  /* ---------- REAL AUTH LISTENER ---------- */
  subscribe: (callback: (user: User | null) => void) => {
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
