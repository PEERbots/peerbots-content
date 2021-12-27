import { useState, useEffect, createContext, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "./firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";

const FirebaseAuthContext = createContext();

export const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInDb, setUserInDb] = useState(null);
  const db = getFirestore(firebaseApp);

  const fetchUserInDb = async () => {
    if (user) {
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", user.email),
        limit(1)
      );
      const data = await getDocs(userQuery);
      const userDataFromDb = { id: data.docs[0].id, data: data.docs[0].data() };
      setUserInDb(userDataFromDb);
    }
  };
  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unlisten = onAuthStateChanged(auth, (user) => {
      user ? setUser(user) : setUser(null);
    });
    return () => {
      unlisten();
    };
  }, []);

  useEffect(() => {
    fetchUserInDb();
  }, [user]);

  return (
    <FirebaseAuthContext.Provider value={{ user, userInDb }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export const useFirebaseAuth = () => useContext(FirebaseAuthContext);
