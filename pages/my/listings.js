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
import amplitude from "amplitude-js";

export default function MyListingsPage() {
  const { userInDb } = useFirebaseAuth();
  const [content, setContent] = useState([]);
  const db = getFirestore(firebaseApp);

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
      });
      setContent(contentFromDb);
    }
  };

  useEffect(() => {
    fetchUserListings();
  }, [userInDb]);

  useEffect(() => {
    amplitude.getInstance().logEvent("Viewed Page: My Listings");
  }, []);

  return (
    <div>
      <CheckAuth>
        <div> Listings</div>
        <div>
          <ContentRow content={content}>
            <h3>Your Listed Content</h3>
          </ContentRow>
        </div>
      </CheckAuth>
    </div>
  );
}
