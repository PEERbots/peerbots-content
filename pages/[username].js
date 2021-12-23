import { useRouter } from "next/router";
import firebaseApp from "../firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  doc,
  getDocs,
  documentId,
  getDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { username } = router.query;
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
      } else {
        // If they don't exist look for someone with id username
        const userRef = doc(db, "users", username);
        const userData = await getDoc(userRef);
        if (userData.exists()) {
          const userInfoById = userData.data();
          setUserInfo(userInfoById);
        } else {
          // Go to 404
        }
      }
      // Get their content
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, [username]);

  return (
    <div>
      {userInfo ? (
        <div>
          <div>{userInfo.name}</div>
          <div>
            <img src={userInfo.photoUrl}></img>
          </div>
        </div>
      ) : (
        {}
      )}
    </div>
  );
}
