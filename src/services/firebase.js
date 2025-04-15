import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB45CK4FS8GC3Jc7TtMnjHFgZ8UILjk6b4",
  authDomain: "mentor-app-28614.firebaseapp.com",
  projectId: "mentor-app-28614",
  storageBucket: "mentor-app-28614.firebasestorage.app",
  messagingSenderId: "590210469611",
  appId: "1:590210469611:web:56d4ade1c94d9d9c8738ae",
  measurementId: "G-EFLP2T5BPM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
