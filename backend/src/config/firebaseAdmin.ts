import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { ServiceAccount } from "firebase-admin";
import * as serviceAccount from "../../serviceAccountKey.json"; // adjust path if needed

const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
    })
  : getApp();

export const db = getFirestore(app);
