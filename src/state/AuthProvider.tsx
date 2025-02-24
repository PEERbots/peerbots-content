import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactElement,
} from "react";
import { onAuthStateChanged, UserInfo } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { UserRecord } from "../types/user";

const FirebaseAuthContext = createContext<{
  user: UserInfo | null;
  userInDb: UserRecord | null;
}>({ user: null, userInDb: null });

export const FirebaseAuthProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [userInDb, setUserInDb] = useState<UserRecord | null>(null);

  const fetchUserInDbOrAddIfNotFound = async (userToFetch: UserInfo | null) => {
    if (userToFetch) {
      const docSnap = await getDoc(doc(db, "users", userToFetch.uid));
      if (docSnap.exists()) {
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
            ...(userToFetch.email && { email: userToFetch.email }),
            ...(userToFetch.displayName && { name: userToFetch.displayName }),
            ...(userToFetch.photoURL && {
              photoUrl: userToFetch.photoURL,
            }),
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
