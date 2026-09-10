import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { EmptyState, Heading } from "@peerbots/core";

import CheckAuth from "../../components/checkAuth";
import ContentRow from "../../components/contentRow";
import { db } from "../../../firebase";
import { useFirebaseAuth } from "../../state/AuthProvider";
import { Content } from "../../types/content";

export default function MyListingsPage() {
  const { userInDb } = useFirebaseAuth();
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserListings = async () => {
    if (userInDb && userInDb.id) {
      setLoading(true);
      const userReference = doc(db, "users", userInDb.id);
      const contentQuery = query(
        collection(db, "content"),
        where("owner", "==", userReference),
        where("public", "==", true)
      );
      const contentData = await getDocs(contentQuery);
      const contentFromDb = contentData.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      })) as Content[];
      setContent(contentFromDb);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserListings();
  }, [userInDb]);

  return (
    <CheckAuth>
      <div className="py-4">
        <Heading level={2} className="mb-6 text-gray-900 font-bold">
          My Public Listings
        </Heading>

        {!loading && content.length === 0 ? (
          <EmptyState
            title="You haven't published any public interactions yet"
            description="Publish your original templates to the Peerbots Marketplace to share them with teachers, therapists, and robot enthusiasts worldwide."
            icon="document"
            primaryAction={{
              label: "View My Content",
              render: <Link to="/my/content" />,
            }}
            className="max-w-xl mx-auto my-8 bg-white border border-gray-200/80 rounded-2xl p-8"
          />
        ) : (
          <ContentRow
            content={content}
            title="Your Public Marketplace Listings"
            description="These items are publicly visible and downloadable by the community."
          />
        )}
      </div>
    </CheckAuth>
  );
}
