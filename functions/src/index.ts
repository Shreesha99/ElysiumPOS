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

    const { name, pin } = request.data as {
      name: string;
      pin: string;
    };

    if (!name || !pin || pin.length !== 6) {
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

    const staffRef = admin.firestore().collection("staff").doc();

    await staffRef.set({
      id: staffRef.id,
      name,
      role: "staff",
      pin,
      restaurantId,
      status: "Offline",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  }
);
