// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWw9mXSsG84XyCd3I3_0DTpi5WSopzr88",
  authDomain: "peerbots-content-testing.firebaseapp.com",
  projectId: "peerbots-content-testing",
  storageBucket: "peerbots-content-testing.appspot.com",
  messagingSenderId: "562003244790",
  appId: "1:562003244790:web:ebfb2ebe93e67ecd3fded7"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp