import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FormEvent, useEffect, useRef, useState } from "react";

import ContentRow from "../components/contentRow";
import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router";
import { useFirebaseAuth } from "../state/AuthProvider";
import { UserRecord } from "../types/user";
import { Content } from "../types/content";
import profilePic from "../assets/profile_pic.png";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserRecord | null>(null);
  const [content, setContent] = useState<Content[]>([]);

  const { user, userInDb } = useFirebaseAuth();
  const [viewerIsAuthor, setViewerIsAuthor] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [editingDescription, setEditingDescription] = useState<boolean>(false);
  const [editingUsername, setEditingUsername] = useState<boolean>(false);
  const updateNameInput = useRef<HTMLInputElement>(null);
  const updateDescriptionInput = useRef<HTMLTextAreaElement>(null);
  const updateUsernameInput = useRef<HTMLInputElement>(null);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");

  const fetchUserDetails = async () => {
    if (username) {
      // Look for someone with username username
      const usernameQuery = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const userData = await getDocs(usernameQuery);
      if (userData.docs.length > 0) {
        const userInfoByUsername = {
          id: userData.docs[0].id,
          data: userData.docs[0].data(),
        } as UserRecord;
        setUserInfo(userInfoByUsername);
        setUserId(userData.docs[0].id);
      } else {
        // If they don't exist look for someone with id username
        const userRef = doc(db, "users", username);
        const userDataByRef = await getDoc(userRef);
        if (userDataByRef.exists()) {
          const userInfoById = {
            id: userDataByRef.id,
            data: userDataByRef.data(),
          } as UserRecord;
          setUserInfo(userInfoById);
          setUserId(username);
        } else {
          // Go to 404
          navigate("/not-found");
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
      }) as Content[];
      setContent(contentFromDb);
    }
  };

  const updateName = async (e: FormEvent) => {
    e.preventDefault();
    if (userId && updateNameInput.current) {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { name: updateNameInput.current.value });
      setEditingName(false);
      fetchUserDetails();
    }
  };

  const updateDescription = async (e: FormEvent) => {
    e.preventDefault();
    if (userId && updateDescriptionInput.current) {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        description: updateDescriptionInput.current.value,
      });
      setEditingDescription(false);
      fetchUserDetails();
    }
  };

  const updateUsername = async (e: FormEvent) => {
    e.preventDefault();
    if (userId && updateUsernameInput.current) {
      const newUsername = updateUsernameInput.current.value;
      const usernameQuery = query(
        collection(db, "users"),
        where("username", "==", newUsername)
      );
      const usersWithUsername = await getDocs(usernameQuery);
      if (usersWithUsername.docs.length > 0) {
        setUsernameErrorMessage(
          "Username is already taken. Try another one please."
        );
      } else {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          username: newUsername,
        });
        setEditingUsername(false);
        setUsernameErrorMessage("");
        fetchUserDetails();
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [username]);

  useEffect(() => {
    fetchUserContent();
  }, [userId]);

  useEffect(() => {
    if (userInDb && userId && Object.keys(userInDb).length > 0) {
      setViewerIsAuthor(userInDb.id == userId);
    } else {
      setViewerIsAuthor(false);
    }
  }, [userInDb, userId]);

  return (
    <div>
      {userInfo ? (
        <>
          <div className="bg-white shadow-md my-4 mx-2 p-8 rounded">
            <div className="mb-8">
              <img
                src={
                  userInfo.data.photoUrl ? userInfo.data.photoUrl : profilePic
                }
                className="rounded-full h-12 w-12 inline-block mr-4"
              />
              {userInfo.data.name}
              {user && viewerIsAuthor && (
                <button
                  className="border border-gray-400 m-2 p-2 hover:bg-gray-400 hover:text-white rounded"
                  onClick={() => {
                    setEditingName(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 inline-block"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>{" "}
                  Edit name
                </button>
              )}
            </div>
            {userInDb && editingName && (
              <div>
                <form onSubmit={updateName}>
                  <label>New Name</label>
                  <input
                    type="text"
                    ref={updateNameInput}
                    className="input-base form-input"
                    name="updatedName"
                    defaultValue={userInDb.data.name}
                  ></input>
                  <button
                    className="btn-primary"
                    type="submit"
                    onClick={updateName}
                  >
                    {" "}
                    Update Name
                  </button>
                  <button
                    onClick={() => {
                      setEditingName(false);
                    }}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}
            <div>
              {userInfo.data.description && (
                <span>{userInfo.data.description}</span>
              )}
              {user && viewerIsAuthor && (
                <button
                  className="border border-gray-400 m-2 p-2 hover:bg-gray-400 hover:text-white rounded"
                  onClick={() => {
                    setEditingDescription(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 inline-block"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>{" "}
                  Edit description
                </button>
              )}
            </div>
            {userInDb && editingDescription && (
              <div>
                <form onSubmit={updateDescription}>
                  <label>New Description</label>
                  <textarea
                    ref={updateDescriptionInput}
                    className="input-base form-input"
                    name="updatedDescription"
                    defaultValue={userInDb.data.description}
                  ></textarea>
                  <button
                    className="btn-primary"
                    type="submit"
                    onClick={updateDescription}
                  >
                    {" "}
                    Update Description
                  </button>
                  <button
                    onClick={() => {
                      setEditingDescription(false);
                    }}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}
            <div>
              {user && viewerIsAuthor && userInfo.data.username && (
                <span>
                  Username: <span>{userInfo.data.username}</span>
                </span>
              )}
              {user && viewerIsAuthor && (
                <button
                  className="border border-gray-400 m-2 p-2 hover:bg-gray-400 hover:text-white rounded"
                  onClick={() => {
                    setEditingUsername(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 inline-block"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>{" "}
                  Edit username
                </button>
              )}
            </div>
            {userInDb && editingUsername && (
              <div>
                <form onSubmit={updateUsername}>
                  <label>New username</label>
                  <input
                    type="text"
                    ref={updateUsernameInput}
                    className="input-base form-input"
                    name="updatedusername"
                    defaultValue={userInDb.data.username}
                  ></input>
                  <button
                    className="btn-primary"
                    type="submit"
                    onClick={updateUsername}
                  >
                    {" "}
                    Update username
                  </button>
                  <button
                    onClick={() => {
                      setEditingUsername(false);
                    }}
                  >
                    Cancel
                  </button>
                  <span className="text-secondary text-sm mx-4">
                    {usernameErrorMessage}
                  </span>
                </form>
              </div>
            )}
          </div>
          <div>
            <div>
              <ContentRow
                content={content}
                title={`Content authored by ${userInfo.data.name}`}
              ></ContentRow>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
