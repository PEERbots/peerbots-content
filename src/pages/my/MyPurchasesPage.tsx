import {
  collection,
  doc,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { EmptyState, Heading } from "@peerbots/core";

import CheckAuth from "../../components/checkAuth";
import ContentRow from "../../components/contentRow";
import { db } from "../../../firebase";
import { useFirebaseAuth } from "../../state/AuthProvider";
import { Content } from "../../types/content";

export default function MyPurchasesPage() {
  const { userInDb } = useFirebaseAuth();
  const [purchasedContent, setPurchasedContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchasedContent = async () => {
    if (userInDb && userInDb.id) {
      setLoading(true);
      const userReference = doc(db, "users", userInDb.id);
      const purchasesQuery = query(
        collection(db, "sales"),
        where("buyer", "==", userReference)
      );
      const purchasesData = await getDocs(purchasesQuery);
      const purchasedContentIds = purchasesData.docs.map(
        (doc) => doc.data().content.id
      );

      if (purchasedContentIds.length > 0) {
        const contentQuery = query(
          collection(db, "content"),
          where(documentId(), "in", purchasedContentIds)
        );
        const contentData = await getDocs(contentQuery);
        const contentFromDb = contentData.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        })) as Content[];
        setPurchasedContent(contentFromDb);
      } else {
        setPurchasedContent([]);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasedContent();
  }, [userInDb]);

  return (
    <CheckAuth>
      <div className="py-4">
        <Heading level={2} className="mb-6 text-gray-900 font-bold">
          My Acquired Content
        </Heading>

        {!loading && purchasedContent.length === 0 ? (
          <EmptyState
            title="No acquired interactions yet"
            description="When you acquire content or behavior packs from the marketplace, they will appear here."
            icon="document"
            primaryAction={{
              label: "Browse Marketplace",
              render: <Link to="/" />,
            }}
            className="max-w-xl mx-auto my-8 bg-white border border-gray-200/80 rounded-2xl p-8"
          />
        ) : (
          <ContentRow
            content={purchasedContent}
            title="Acquired Interactions"
            description="Templates and behaviors you have acquired from the Peerbots community."
          />
        )}
      </div>
    </CheckAuth>
  );
}
