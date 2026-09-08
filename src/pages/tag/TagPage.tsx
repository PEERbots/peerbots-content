import {
  collection,
  doc,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Heading, Text } from "@peerbots/core";

import ContentRow from "../../components/contentRow";
import { db } from "../../../firebase";
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
      const contentFromDb = contentData.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      })) as Content[];
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
    <div className="py-4">
      {tagInfo && tagInfo.data ? (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                Category
              </span>
            </div>
            <Heading level={2} className="text-gray-900 font-bold mb-2">
              {tagInfo.data.name}
            </Heading>
            {tagInfo.data.description && (
              <Text size="md" color="muted">
                {tagInfo.data.description}
              </Text>
            )}
          </div>

          <div>
            {content.length > 0 ? (
              <ContentRow
                content={content}
                title={`Interactions tagged with "${tagInfo.data.name}"`}
              />
            ) : (
              <div className="py-8 text-center text-gray-500">
                No templates found for this tag yet.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500">Loading tag...</div>
      )}
    </div>
  );
}
