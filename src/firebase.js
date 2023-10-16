// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiayQJljCkemZHgBry70l-hNlrYAf3S5c",
  authDomain: "groobe-1509e.firebaseapp.com",
  databaseURL: "https://groobe-1509e.firebaseio.com",
  projectId: "groobe-1509e",
  storageBucket: "groobe-1509e.appspot.com",
  messagingSenderId: "128946602858",
  appId: "1:128946602858:web:27fa06bce219133580db13",
  measurementId: "G-VJE04TFE6T"
};

// Initialize Firebase
const apps = initializeApp(firebaseConfig);
//initialize cloud storage and get a reference to the service
const storage1 = getStorage(apps, "gs://groobe-1509e.appspot.com");

// const analytics = getAnalytics(apps);
module.export = storage1;
