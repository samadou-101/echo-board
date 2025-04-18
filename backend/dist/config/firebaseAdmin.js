"use strict";
// import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
// import { getFirestore } from "firebase-admin/firestore";
// import { ServiceAccount } from "firebase-admin";
// // import * as serviceAccount from "../../serviceAccountKey.json";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!);
// const app = !getApps().length
//   ? initializeApp({
//       credential: cert(serviceAccount as ServiceAccount),
//     })
//   : getApp();
// export const db = getFirestore(app);
const admin = __importStar(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const base64 = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64;
if (!base64) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_BASE64 is not set");
}
const serviceAccount = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
// Export Firestore to use in other parts of your app
const db = admin.firestore();
exports.db = db;
