import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

import CheckAuth from "../../components/checkAuth";
import ContentRow from "../../components/contentRow";
import { db } from "../../../firebase";
import { useFirebaseAuth } from "../../state/AuthProvider";
import { Content } from "../../types/content";

export default function MyListingsPage() {
  const { userInDb } = useFirebaseAuth();
  const [content, setContent] = useState<Content[]>([]);

  const fetchUserListings = async () => {
    if (userInDb && userInDb.id) {
      const userReference = doc(db, "users", userInDb.id);
      // Get their content
      const contentQuery = query(
        collection(db, "content"),
        where("owner", "==", userReference),
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

  useEffect(() => {
    fetchUserListings();
  }, [userInDb]);

  return (
    <div>
      <CheckAuth>
        <div>
          <ContentRow
            content={content}
            title="Your Listed Content"
          ></ContentRow>
        </div>
      </CheckAuth>
    </div>
  );
}
