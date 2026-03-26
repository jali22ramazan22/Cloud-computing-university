// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBq4QwhOnusTQ9vMl8Jxia16M70oHjIMX4",
  authDomain: "cfo-bot-d6476.firebaseapp.com",
  projectId: "cfo-bot-d6476",
  storageBucket: "cfo-bot-d6476.firebasestorage.app",
  messagingSenderId: "598233385287",
  appId: "1:598233385287:web:5a6001a83fbda12364a462",
  measurementId: "G-ERPYPEX59C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
