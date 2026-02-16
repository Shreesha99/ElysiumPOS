import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

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

    const adminSnap = await admin.firestore().doc(`users/${auth.uid}`).get();

    if (!adminSnap.exists || adminSnap.data()?.role !== "admin") {
      throw new HttpsError(
        "permission-denied",
        "Only admins can create staff."
      );
    }

    const restaurantId = adminSnap.data()?.restaurantId;

    // 1️⃣ Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // 2️⃣ Store staff inside restaurant subcollection
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
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return { success: true };
  }
);

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

    // 1️⃣ Delete Firestore doc
    await admin
      .firestore()
      .doc(`restaurants/${restaurantId}/waiters/${uid}`)
      .delete();

    // 2️⃣ Delete Firebase Auth user
    await admin.auth().deleteUser(uid);

    return { success: true };
  }
);
