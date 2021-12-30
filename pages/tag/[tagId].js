import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import ContentRow from "../../components/contentRow";
// import ContentRow from "../components/contentRow";
import amplitude from "amplitude-js";
import firebaseApp from "../../firebase";
import { useRouter } from "next/router";

export default function TagPage() {
  const router = useRouter();
  const { tagId } = router.query;
  const [content, setContent] = useState([]);
  const [tagDescriptionData, setTagDescriptionData] = useState([]);
  const [tagName, setTagName] = useState("");
  const [tagDescription, setTagDescription] = useState("");
  const db = getFirestore(firebaseApp);

  const fetchTagContent = async () => {
    if (tagId) {
      const tagReference = doc(db, "tags", tagId);
      const contentQuery = query(
        collection(db, "content"),
        where("tags", "array-contains", tagReference),
        where("public", "==", true)
      );
      const contentData = await getDocs(contentQuery);
      const contentFromDb = contentData.docs.map((doc) => {
        return {
          id: doc.id,
          data: doc.data(),
        };
      });
      setContent(contentFromDb);
    }
  };

  const fetchTagData = async () => {
    if (tagId) {
      const tagDataQuery = query(
        collection(db, "tags"),
        where(documentId(), "==", tagId)
      );
      const tagData = await getDocs(tagDataQuery);
      const tagDataFromDb = tagData.docs.map((doc) => {
        return {
          id: doc.id,
          data: doc.data(),
        };
      });
      setTagDescriptionData(tagDataFromDb);
      setTagName(tagDataFromDb[0].data.name);
      setTagDescription(tagDataFromDb[0].data.description);
    }
  };

  useEffect(() => {
    fetchTagData();
    fetchTagContent();
  }, [tagId]);

  return (
    <div>
      {tagDescriptionData ? (
        <>
          <div className="bg-white flex">Tag: {tagName}</div>
          <div className="bg-white flex">Description: {tagDescription}</div>
          <div>
            {content ? (
              <div>
                <ContentRow content={content}>
                  <h3>Content with the tag: {tagName}</h3>
                </ContentRow>
              </div>
            ) : (
              <div>
                No content found for the tag: {tagDescriptionData[0].data.name}
              </div>
            )}
          </div>
        </>
      ) : (
        <div>No tag found for tag ID: {tagId}</div>
      )}
    </div>
  );
}
