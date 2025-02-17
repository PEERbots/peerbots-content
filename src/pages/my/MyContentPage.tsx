import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

import CheckAuth from "../../components/checkAuth";
import ContentRow from "../../components/contentRow";
import amplitude from "amplitude-js";
import { db } from "../../../firebase";
import { useFirebaseAuth } from "../../state/AuthProvider";

export default function MyContentPage() {
  const { userInDb } = useFirebaseAuth();
  const [content, setContent] = useState([]);

  const fetchUserContent = async () => {
    if (userInDb && userInDb.id) {
      const userReference = doc(db, "users", userInDb.id);
      // Get their content
      const contentQuery = query(
        collection(db, "content"),
        where("owner", "==", userReference)
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

  useEffect(() => {
    fetchUserContent();
  }, [userInDb]);

  useEffect(() => {
    amplitude.getInstance().logEvent("Viewed Page: My Content");
  }, []);

  return (
    <div>
      <CheckAuth>
        <div>
          <ContentRow
            content={content.filter((contentItem) => {
              return contentItem.data.copyOf;
            })}
          >
            <h3 className="text-xl">Your Copied Content</h3>
          </ContentRow>
          <ContentRow
            content={content.filter((contentItem) => {
              return !contentItem.data.copyOf;
            })}
          >
            <h3 className="text-xl">Your Authored Content</h3>
          </ContentRow>
        </div>
      </CheckAuth>
    </div>
  );
}
