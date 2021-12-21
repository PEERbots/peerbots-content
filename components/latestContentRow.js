// import { useLatestContent } from "../providers/latestContent";
import { useState, useEffect } from "react";
import ContentCard from "./contentCard";
import firebaseApp from "../firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";

export default function LatestContentRow() {
  const [latestContent, setLatestContent] = useState([]);

  const db = getFirestore(firebaseApp);

  const fetchLatestContent = async () => {
    const q = query(
      collection(db, "content"),
      where("public", "==", true),
      limit(10)
    );
    const data = await getDocs(q);
    const newLatestContent = data.docs.map((doc) => {
      return {
        id: doc.id,
        data: doc.data(),
      };
    });
    setLatestContent(newLatestContent);
  };

  useEffect(() => {
    fetchLatestContent();
  }, []);

  return (
    <>
      <div>
        <h3>Latest Content</h3>
      </div>
      <div className="max-w-sm w-full lg:max-w-full lg:flex">
        {latestContent &&
          latestContent.map((eachContent) => (
            <ContentCard key={eachContent.id} content={eachContent.data} />
          ))}
      </div>
    </>
  );
}
