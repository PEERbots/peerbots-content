import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { EmptyState, Heading } from "@peerbots/core";

import CheckAuth from "../../components/checkAuth";
import ContentRow from "../../components/contentRow";
import { db } from "../../../firebase";
import { useFirebaseAuth } from "../../state/AuthProvider";
import { Content } from "../../types/content";

export default function MyContentPage() {
  const { userInDb } = useFirebaseAuth();
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserContent = async () => {
    if (userInDb && userInDb.id) {
      setLoading(true);
      const userReference = doc(db, "users", userInDb.id);
      const contentQuery = query(
        collection(db, "content"),
        where("owner", "==", userReference)
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
    fetchUserContent();
  }, [userInDb]);

  const copiedContent = content.filter((item) => Boolean(item.data.copyOf));
  const authoredContent = content.filter((item) => !item.data.copyOf);

  return (
    <CheckAuth>
      <div className="py-4">
        <Heading level={2} className="mb-6 text-gray-900 font-bold">
          My Saved Content
        </Heading>

        {!loading && content.length === 0 ? (
          <EmptyState
            title="You haven't saved or authored any interactions yet"
            description="Explore community interactions on the marketplace, or launch the Peerbots Controller to build your own."
            icon="document"
            primaryAction={{
              label: "Explore Marketplace",
              render: <Link to="/" />,
            }}
            secondaryAction={{
              label: "Launch Controller",
              render: (
                <a
                  href="https://app.peerbots.org/dash/control"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
            }}
            className="max-w-xl mx-auto my-8 bg-white border border-gray-200/80 rounded-2xl p-8"
          />
        ) : (
          <div className="space-y-6">
            {copiedContent.length > 0 && (
              <ContentRow
                content={copiedContent}
                title="Your Copied Interactions"
                description="Templates you have adapted or saved for personal use."
              />
            )}
            {authoredContent.length > 0 && (
              <ContentRow
                content={authoredContent}
                title="Your Authored Content"
                description="Original templates and behavior sets created by you."
              />
            )}
          </div>
        )}
      </div>
    </CheckAuth>
  );
}
