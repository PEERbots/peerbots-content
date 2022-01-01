import {
  collection,
  doc,
  documentId,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import ContentRow from "../../components/contentRow";
import amplitude from "amplitude-js";
import firebaseApp from "../../firebase";
import { useRouter } from "next/router";

export default function TagPage() {
  const router = useRouter();
  const { tagId } = router.query;
  const [content, setContent] = useState([]);
  const [tagInfo, setTagInfo] = useState({});
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
      if (tagData.docs.length > 0) {
        const tagDataFromDb = {
          id: tagData.docs[0].id,
          data: tagData.docs[0].data(),
        };
        setTagInfo(tagDataFromDb);
      } else {
        router.push("/404", "/not-found");
      }
    }
  };

  useEffect(() => {
    fetchTagData();
    fetchTagContent();
  }, [tagId]);

  useEffect(() => {
    if (tagInfo && Object.keys(tagInfo).length > 0) {
      amplitude.getInstance().logEvent("Viewed Page: Tag Details", {
        "Tag ID": tagId,
        "Tag Name": tagInfo.data.name,
      });
    }
  }, [tagInfo.data]);

  return (
    <div>
      {tagInfo.data ? (
        <>
          <div className="bg-white shadow-md my-4 mx-2 p-8">
            <h1 className="text-2xl mb-4">
              Tag:{" "}
              <span
                className="rounded-3xl px-2 mx-1"
                style={{
                  background: tagInfo.data.color,
                  color: tagInfo.data.textColor,
                }}
              >
                {tagInfo.data.name}
              </span>
            </h1>
            <p>{tagInfo.data.description}</p>
          </div>
          <div>
            {content ? (
              <div>
                <ContentRow content={content} />
              </div>
            ) : (
              <div>No content found for the tag: {tagInfo.data.name}</div>
            )}
          </div>
        </>
      ) : (
        <div>No tag found for tag ID: {tagId}</div>
      )}
    </div>
  );
}
