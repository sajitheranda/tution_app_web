// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXdTMGdHrbHoYlhOrLc-_KBaZfmXQcFs4",
  authDomain: "mytution-8738d.firebaseapp.com",
  projectId: "mytution-8738d",
  storageBucket: "mytution-8738d.firebasestorage.app",
  messagingSenderId: "137293375610",
  appId: "1:137293375610:web:447a3cdeef9d255b1ab3c3",
  measurementId: "G-5Q8GT67MDS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);