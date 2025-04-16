/* eslint-disable @typescript-eslint/no-unused-vars */
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQXNrgsBr7_SGMb-yz04wKcF8SCFjTS-g",
  authDomain: "echoboard-1f6a6.firebaseapp.com",
  projectId: "echoboard-1f6a6",
  storageBucket: "echoboard-1f6a6.firebasestorage.app",
  messagingSenderId: "643786856276",
  appId: "1:643786856276:web:e6d56b1153ba5bf656dac1",
  measurementId: "G-W6HM4D3Z2V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // Export auth for use in components
