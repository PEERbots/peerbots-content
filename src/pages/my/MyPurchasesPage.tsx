import {
  collection,
  doc,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import CheckAuth from "../../components/checkAuth";
import ContentRow from "../../components/contentRow";
import { db } from "../../../firebase";
import { useFirebaseAuth } from "../../state/AuthProvider";
import { Content } from "../../types/content";

export default function MyPurchasesPage() {
  const { userInDb } = useFirebaseAuth();
  const [purchasedContent, setPurchasedContent] = useState<Content[]>([]);

  const fetchPurchasedContent = async () => {
    if (userInDb && userInDb.id) {
      const userReference = doc(db, "users", userInDb.id);
      // Get their purchased content Ids
      const purchasesQuery = query(
        collection(db, "sales"),
        where("buyer", "==", userReference)
      );
      const purchasesData = await getDocs(purchasesQuery);
      const purchasedContentIds = purchasesData.docs.map((doc) => {
        return doc.data().content.id;
      });

      // Get purchased content
      const contentQuery = query(
        collection(db, "content"),
        where(documentId(), "in", purchasedContentIds)
      );
      const contentData = await getDocs(contentQuery);
      const contentFromDb = contentData.docs.map((doc) => {
        return {
          id: doc.id,
          data: doc.data(),
        };
      }) as Content[];
      setPurchasedContent(contentFromDb);
    }
  };

  useEffect(() => {
    fetchPurchasedContent();
  }, [userInDb]);

  return (
    <div>
      <CheckAuth>
        <div>
          <ContentRow
            content={purchasedContent}
            title="Purchased Content"
          ></ContentRow>
        </div>
      </CheckAuth>
    </div>
  );
}
