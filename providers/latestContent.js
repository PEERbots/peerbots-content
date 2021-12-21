import { useState, useEffect, createContext, useContext } from "react";
import firebaseApp from "../firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const LatestContentContext = createContext();

export const LatestContentProvider = ({ children }) => {
  const [latestContent, setLatestContent] = useState([]);

  useEffect(() => {
    if (latestContent.length == 0) {
      const db = getFirestore(firebaseApp);
      const q = query(collection(db, "content"), where("public", "==", true));
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          setLatestContent([
            ...latestContent,
            { id: doc.id, data: doc.data() },
          ]);
        });
      });
    }
  }, []);

  return (
    <LatestContentContext.Provider value={{ content: latestContent }}>
      {children}
    </LatestContentContext.Provider>
  );
};

export const useLatestContent = () => useContext(LatestContentContext);
