// import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
// import { getFirestore } from "firebase-admin/firestore";
// import { ServiceAccount } from "firebase-admin";
// // import * as serviceAccount from "../../serviceAccountKey.json";

// const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!);
// const app = !getApps().length
//   ? initializeApp({
//       credential: cert(serviceAccount as ServiceAccount),
//     })
//   : getApp();

// export const db = getFirestore(app);
import * as admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const base64 = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64;

if (!base64) {
  throw new Error("GOOGLE_SERVICE_ACCOUNT_BASE64 is not set");
}

const serviceAccount = JSON.parse(
  Buffer.from(base64, "base64").toString("utf-8")
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

// Export Firestore to use in other parts of your app
const db = admin.firestore();
export { db };
