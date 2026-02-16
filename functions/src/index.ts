import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

/* ======================================================
   CREATE STAFF USER
====================================================== */
export const createStaffUser = onCall(
  { region: "us-central1" },
  async (request) => {
    const auth = request.auth;

    if (!auth) {
      throw new HttpsError("unauthenticated", "You must be logged in.");
    }

    const { name, email, password } = request.data as {
      name: string;
      email: string;
      password: string;
    };

    if (!name || !email || !password || password.length < 6) {
      throw new HttpsError("invalid-argument", "Invalid data.");
    }

    // 1️⃣ Check admin
    const adminSnap = await admin.firestore().doc(`users/${auth.uid}`).get();

    if (!adminSnap.exists || adminSnap.data()?.role !== "admin") {
      throw new HttpsError(
        "permission-denied",
        "Only admins can create staff."
      );
    }

    const restaurantId = adminSnap.data()?.restaurantId;

    if (!restaurantId) {
      throw new HttpsError("failed-precondition", "Admin has no restaurant.");
    }

    // 2️⃣ Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // 3️⃣ Store staff inside restaurant subcollection
    await admin
      .firestore()
      .doc(`restaurants/${restaurantId}/waiters/${userRecord.uid}`)
      .set({
        id: userRecord.uid,
        name,
        email,
        role: "staff",
        restaurantId,
        status: "Offline",
        leaveDates: [], // ✅ IMPORTANT
        shiftStart: "09:00", // ✅ IMPORTANT
        shiftEnd: "18:00", // ✅ IMPORTANT
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return { success: true };
  }
);

/* ======================================================
   DELETE STAFF USER
====================================================== */
export const deleteStaffUser = onCall(
  { region: "us-central1" },
  async (request) => {
    const auth = request.auth;

    if (!auth) {
      throw new HttpsError("unauthenticated", "You must be logged in.");
    }

    const { uid } = request.data as { uid: string };

    if (!uid) {
      throw new HttpsError("invalid-argument", "Missing UID.");
    }

    const adminSnap = await admin.firestore().doc(`users/${auth.uid}`).get();

    if (!adminSnap.exists || adminSnap.data()?.role !== "admin") {
      throw new HttpsError(
        "permission-denied",
        "Only admins can delete staff."
      );
    }

    const restaurantId = adminSnap.data()?.restaurantId;

    if (!restaurantId) {
      throw new HttpsError("failed-precondition", "Admin has no restaurant.");
    }

    // 1️⃣ Delete from restaurant subcollection
    await admin
      .firestore()
      .doc(`restaurants/${restaurantId}/waiters/${uid}`)
      .delete();

    // 2️⃣ Delete from Firebase Auth
    await admin.auth().deleteUser(uid);

    return { success: true };
  }
);
