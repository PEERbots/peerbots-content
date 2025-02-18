import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import ContentRow from "./contentRow";
import { Content } from "../types/content";

export default function LatestContentRow() {
  const [latestContent, setLatestContent] = useState<Content[]>([]);
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
    }) as Content[];

    setLatestContent(latestContentFromDb);
  };

  useEffect(() => {
    fetchLatestContent();
  }, []);
  return (
    <>
      <ContentRow content={latestContent} title={"Latest Content"} />
    </>
  );
}
