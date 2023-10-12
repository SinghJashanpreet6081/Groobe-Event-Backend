// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYTXxBszCyUjwxPB4B-6sWLkXVKxiwnj8",
  authDomain: "groobe-event-portal.firebaseapp.com",
  projectId: "groobe-event-portal",
  storageBucket: "groobe-event-portal.appspot.com",
  messagingSenderId: "955121158818",
  appId: "1:955121158818:web:9240de9a33527314cae5fb",
  measurementId: "G-2221G36ETP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);