import { useState, useEffect, createContext, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import amplitude from "amplitude-js";

const FirebaseAuthContext = createContext();

export const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInDb, setUserInDb] = useState(null);

  const fetchUserInDbOrAddIfNotFound = async (userToFetch) => {
    if (userToFetch) {
      const docSnap = await getDoc(doc(db, "users", userToFetch.uid));
      if (docSnap.exists()) {
        amplitude.getInstance().setUserId(docSnap.id);
        await updateDoc(doc(db, "users", userToFetch.uid), {
          name: userToFetch.displayName,
          photoUrl: userToFetch.photoURL,
        });
        setUserInDb({
          id: docSnap.id,
          data: docSnap.data(),
        });
      } else {
        await setDoc(doc(db, "users", userToFetch.uid), {
          name: userToFetch.displayName,
          photoUrl: userToFetch.photoURL,
          email: userToFetch.email,
        });
        setUserInDb({
          id: userToFetch.uid,
          data: {
            name: userToFetch.displayName,
            photoUrl: userToFetch.photoURL,
            email: userToFetch.email,
          },
        });
      }
    }
  };
  useEffect(() => {
    const unlisten = onAuthStateChanged(auth, (user) => {
      user ? setUser(user) : setUser(null);
    });
    return () => {
      unlisten();
    };
  }, []);

  useEffect(() => {
    fetchUserInDbOrAddIfNotFound(user);
  }, [user]);

  return (
    <FirebaseAuthContext.Provider value={{ user, userInDb }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export const useFirebaseAuth = () => useContext(FirebaseAuthContext);
