// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Cấu hình Firebase của bạn (lấy từ Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyAM3gAWWv1GDDlJ2NeLjhT2yiILHkv0wmA",
  authDomain: "polyfirebase-e7423.firebaseapp.com",
  databaseURL: "https://polyfirebase-e7423-default-rtdb.firebaseio.com",
  projectId: "polyfirebase-e7423",
  storageBucket: "polyfirebase-e7423.appspot.com",
  messagingSenderId: "1090509867962",
  appId: "1:1090509867962:web:8c277f276cf8e8915eeb83",
};
const app = initializeApp(firebaseConfig);

// Lấy instance của Firebase Storage
const storage = getStorage(app);

export { storage };
