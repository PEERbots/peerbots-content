// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWw9mXSsG84XyCd3I3_0DTpi5WSopzr88",
  authDomain: "peerbots-content-testing.firebaseapp.com",
  projectId: "peerbots-content-testing",
  storageBucket: "peerbots-content-testing.appspot.com",
  messagingSenderId: "562003244790",
  appId: "1:562003244790:web:ebfb2ebe93e67ecd3fded7",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

if (process.env.NODE_ENV == "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  console.log("Theoretically connected emulators");
}

export { auth, db };
