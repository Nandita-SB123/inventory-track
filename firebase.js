// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMoahaNAO88MqxVyWkn4273odJluIux4c",
  authDomain: "inventory-track-d2b5d.firebaseapp.com",
  projectId: "inventory-track-d2b5d",
  storageBucket: "inventory-track-d2b5d.appspot.com",
  messagingSenderId: "15218649424",
  appId: "1:15218649424:web:56c7022bb6ef334a18e455",
  measurementId: "G-BGLXZ0EQSS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore};