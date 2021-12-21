import { useState, useEffect } from "react";
import firebaseApp from "../firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import ContentRow from "./contentRow";

export default function TrustedContentRow() {
  const [trustedContent, setTrustedContent] = useState([]);
  const db = getFirestore(firebaseApp);
  const fetchTrustedContent = async () => {
    const q = query(
      collection(db, "content"),
      where("trusted", "==", true),
      limit(10)
    );
    const data = await getDocs(q);
    const newTrustedContent = data.docs.map((doc) => {
      return {
        id: doc.id,
        data: doc.data(),
      };
    });
    setTrustedContent(newTrustedContent);
  };

  useEffect(() => {
    fetchTrustedContent();
  }, []);
  return (
    <>
      <ContentRow content={trustedContent}>
        <h3 className="text-xl font-bold">Trusted Content</h3>
        <p className="text-sm">Content trusted by the Peerbots team.</p>
      </ContentRow>
    </>
  );
}
