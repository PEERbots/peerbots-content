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
  const db = getFirestore(firebaseApp);
  const fetchLatestContent = async () => {
    const q = query(collection(db, "content"), where("public", "==", true));
    const data = await getDocs(q);
    data.forEach((doc) => {
      console.log(doc.data());
      setLatestContent([...latestContent, { id: doc.id, data: doc.data() }]);
    });
  };

  useEffect(() => {
    fetchLatestContent();
  }, []);

  return (
    <LatestContentContext.Provider value={{ content: latestContent }}>
      {children}
    </LatestContentContext.Provider>
  );
};

export const useLatestContent = () => useContext(LatestContentContext);
