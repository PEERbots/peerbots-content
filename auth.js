import { useState, useEffect, createContext, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "./firebase";

const FirebaseAuthContext = createContext();

export const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unlisten = onAuthStateChanged(auth, (user) => {
      user ? setUser(user) : setUser(null);
    });
    return () => {
      unlisten();
    };
  }, []);

  return (
    <FirebaseAuthContext.Provider value={{ user }}>{children}</FirebaseAuthContext.Provider>
  );
};

export const useFirebaseAuth = () => useContext(FirebaseAuthContext);
