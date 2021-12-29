import { useRouter } from "next/router";
import firebaseApp from "../firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import ContentRow from "../components/contentRow";
import amplitude from "amplitude-js";

export default function ProfilePage() {
  const router = useRouter();
  const { username } = router.query;
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [content, setContent] = useState([]);
  const db = getFirestore(firebaseApp);

  const fetchUserDetails = async () => {
    if (username) {
      // Look for someone with username username
      const usernameQuery = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const userData = await getDocs(usernameQuery);
      if (userData.docs.length > 0) {
        const userInfoByUsername = userData.docs[0].data();
        setUserInfo(userInfoByUsername);
        setUserId(userData.docs[0].id);
      } else {
        // If they don't exist look for someone with id username
        const userRef = doc(db, "users", username);
        const userDataByRef = await getDoc(userRef);
        if (userDataByRef.exists()) {
          const userInfoById = userDataByRef.data();
          setUserInfo(userInfoById);
          setUserId(username);
        } else {
          // Go to 404
          router.push("/404", "/not-found");
        }
      }
    }
  };

  const fetchUserContent = async () => {
    if (userId) {
      const userReference = doc(db, "users", userId);
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
    fetchUserDetails();
    amplitude.getInstance().logEvent("Viewed Page: Profile Details", {
      "Profile ID": username,
    });
  }, [username]);

  useEffect(() => {
    fetchUserContent();
  }, [userId]);

  return (
    <div>
      {userInfo ? (
        <div>
          <div>{userInfo.name}</div>
          <div>
            <img src={userInfo.photoUrl}></img>
          </div>
          <div>
            <ContentRow content={content}>
              <h3>Content Authored by {userInfo.name}</h3>
            </ContentRow>
          </div>
        </div>
      ) : (
        {}
      )}
    </div>
  );
}
