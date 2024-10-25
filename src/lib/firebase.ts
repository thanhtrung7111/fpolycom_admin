// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Cấu hình Firebase của bạn (lấy từ Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBENPrMl7KvJ5R7IQialMBs-5LYTDwy7Ts",
  authDomain: "cinemastar-957ee.firebaseapp.com",
  projectId: "cinemastar-957ee",
  storageBucket: "cinemastar-957ee.appspot.com",
  messagingSenderId: "449818294179",
  appId: "1:449818294179:web:322839cf693e2850454c16",
};

const app = initializeApp(firebaseConfig);

// Lấy instance của Firebase Storage
const storage = getStorage(app);

export { storage };
