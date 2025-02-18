import {
  collection,
  doc,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import ContentRow from "../../components/contentRow";
import { db } from "../../../firebase";
import { useNavigate, useParams } from "react-router";
import { Content } from "../../types/content";
import { Tag } from "../../types/tag";

export default function TagPage() {
  const navigate = useNavigate();
  const { tagId } = useParams();
  const [content, setContent] = useState<Content[]>([]);
  const [tagInfo, setTagInfo] = useState<Tag | null>(null);

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
      }) as Content[];
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
        } as Tag;
        setTagInfo(tagDataFromDb);
      } else {
        navigate("/not-found");
      }
    }
  };

  useEffect(() => {
    fetchTagData();
    fetchTagContent();
  }, [tagId]);

  return (
    <div>
      {tagInfo && tagInfo.data ? (
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
