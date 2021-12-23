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

export default function LatestContentRow() {
  const [latestContent, setLatestContent] = useState([]);
  const [authors, setAuthors] = useState([]);
  const db = getFirestore(firebaseApp);
  const fetchLatestContent = async () => {
    const q = query(
      collection(db, "content"),
      where("public", "==", true),
      limit(10)
    );
    const data = await getDocs(q);
    const latestContentFromDb = data.docs.map((doc) => {
      return {
        id: doc.id,
        data: doc.data(),
      };
    });

    const authorsReferences = latestContentFromDb.map((doc) => {
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
    setLatestContent(latestContentFromDb);
  };

  useEffect(() => {
    fetchLatestContent();
  }, []);
  return (
    <>
      <ContentRow content={latestContent} authors={authors}>
        <h3 className="text-xl font-bold">Latest Content</h3>
      </ContentRow>
    </>
  );
}
