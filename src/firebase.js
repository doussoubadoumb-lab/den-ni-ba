import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC7brNX38yQR16YE53ZyJXvIUdrefR5S-4",
  authDomain: "den-ni-ba.firebaseapp.com",
  projectId: "den-ni-ba",
  storageBucket: "den-ni-ba.firebasestorage.app",
  messagingSenderId: "762925809696",
  appId: "1:762925809696:web:e6eb86661830ed919c3c45"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);