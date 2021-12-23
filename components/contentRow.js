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
import { useState, useEffect } from "react";
import ContentCard from "./contentCard";

export default function ContentRow({ content, children }) {
  const [authors, setAuthors] = useState([]);
  const db = getFirestore(firebaseApp);
  const fetchContentRowDetails = async () => {
    if (content && content.length > 0) {
      const authorsReferences = content.map((doc) => {
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
    }
  };
  useEffect(() => {
    fetchContentRowDetails();
  }, [content]);
  return (
    <>
      <div className="bg-white shadow-md my-4 mx-2 p-8 rounded w-full">
        <div className="mb-6">{children}</div>
        <div className="max-w-sm w-full lg:max-w-full lg:flex space-x-8">
          {content &&
            authors &&
            content.map((eachContent) => (
              <ContentCard
                key={eachContent.id}
                content={eachContent.data}
                author={
                  authors
                    .filter((author) => {
                      return author.id == eachContent.data.owner.id;
                    })
                    .map((author) => {
                      return author.data;
                    })[0]
                }
              />
            ))}
        </div>
      </div>
    </>
  );
}
