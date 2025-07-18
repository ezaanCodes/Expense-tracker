// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDhicMiNj5mtKj2DRYdo5vxMpwwaknrA8w",
    authDomain: "expensetracker-67907.firebaseapp.com",
    projectId: "expensetracker-67907",
    storageBucket: "expensetracker-67907.firebasestorage.app",
    messagingSenderId: "506430217121",
    appId: "1:506430217121:web:9de1b82847c9aedc4989e0",
    measurementId: "G-1NG389130D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);

export { app, auth, analytics }