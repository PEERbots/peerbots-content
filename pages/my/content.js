import { useState, useEffect } from "react";
import CheckAuth from "../../components/checkAuth";
import ContentRow from "../../components/contentRow";
import { useFirebaseAuth } from "../../auth";
import firebaseApp from "../../firebase";
import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import amplitude from "amplitude-js"

export default function MyContentPage() {
  const { userInDb } = useFirebaseAuth();
  const [content, setContent] = useState([]);
  const db = getFirestore(firebaseApp);

  const fetchUserContent = async () => {
    console.log(userInDb);
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
        <div> Your Content page</div>
        <div>
          <ContentRow
            content={content.filter((contentItem) => {
              return contentItem.data.public;
            })}
          >
            <h3>Your Public Content</h3>
          </ContentRow>
          <ContentRow
            content={content.filter((contentItem) => {
              return !contentItem.data.public;
            })}
          >
            <h3>Your Private Content</h3>
          </ContentRow>
        </div>
      </CheckAuth>
    </div>
  );
}
