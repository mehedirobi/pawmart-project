// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCM44GUzYa22NRqjMDk6R-GAsdmhvV0pjo",
  authDomain: "pawmart-9e69c.firebaseapp.com",
  projectId: "pawmart-9e69c",
  storageBucket: "pawmart-9e69c.firebasestorage.app",
  messagingSenderId: "258293690399",
  appId: "1:258293690399:web:3b5dc9d823d2338584e52a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth (optional, but recommended for use in context)
export const auth = getAuth(app);

// Export default app
export default app;
