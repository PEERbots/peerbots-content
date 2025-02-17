import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import ContentRow from "./contentRow";

export default function TrustedContentRow() {
  const [trustedContent, setTrustedContent] = useState([]);
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

    setTrustedContent(trustedContentFromDb);
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
