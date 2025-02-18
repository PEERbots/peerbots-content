import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import ContentRow from "./contentRow";
import { Content } from "../types/content";

export default function TrustedContentRow() {
  const [trustedContent, setTrustedContent] = useState<Content[]>([]);
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
    }) as Content[];

    setTrustedContent(trustedContentFromDb);
  };

  useEffect(() => {
    fetchTrustedContent();
  }, []);
  return (
    <>
      <ContentRow
        content={trustedContent}
        title={"Trusted Content"}
        description={"Content trusted by the Peerbots team."}
      />
    </>
  );
}
