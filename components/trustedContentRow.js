import { useState, useEffect } from "react";
import firebaseApp from "../firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  limit,
  getDocs,
  documentId,
} from "firebase/firestore";
import ContentRow from "./contentRow";

export default function TrustedContentRow() {
  const [trustedContent, setTrustedContent] = useState([]);
  const [authors, setAuthors] = useState([]);
  const db = getFirestore(firebaseApp);
  const fetchTrustedContent = async () => {
    const q = query(
      collection(db, "content"),
      where("public", "==", true),
      where("trusted", "==", true),
      limit(10)
    );
    const data = await getDocs(q);
    const trustedContentFromDb = data.docs.map((doc) => {
      return {
        id: doc.id,
        data: doc.data(),
      };
    });

    const authorsReferences = trustedContentFromDb.map((doc) => {
      return doc.data.owner.id;
    });

    const authorsQuery = query(
      collection(db, "users"),
      where(documentId(), "in", authorsReferences)
    );

    const authorsData = await getDocs(authorsQuery);
    const authorsFromDb = authorsData.docs.map((doc) => {
      return {
        id: doc.id,
        data: doc.data(),
      };
    });
    setAuthors(authorsFromDb);
    setTrustedContent(trustedContentFromDb);
  };

  useEffect(() => {
    fetchTrustedContent();
  }, []);
  return (
    <>
      <ContentRow content={trustedContent} authors={authors}>
        <h3 className="text-xl font-bold">Trusted Content</h3>
        <p className="text-sm">Content trusted by the Peerbots team.</p>
      </ContentRow>
    </>
  );
}
