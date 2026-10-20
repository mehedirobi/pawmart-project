
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB37PnPTfKqPU-gxKfktkh6nBVLDU2c8VA",
  authDomain: "pawmart-2429e.firebaseapp.com",
  projectId: "pawmart-2429e",
  storageBucket: "pawmart-2429e.firebasestorage.app",
  messagingSenderId: "106341547302",
  appId: "1:106341547302:web:8142e6e67266c1ed5695e7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
