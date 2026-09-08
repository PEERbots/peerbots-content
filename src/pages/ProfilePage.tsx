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
import { useNavigate, useParams } from "react-router";
import { Button, Heading, Text } from "@peerbots/core";

import ContentRow from "../components/contentRow";
import { db } from "../../firebase";
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
          navigate("/not-found");
        }
      }
    }
  };

  const fetchUserContent = async () => {
    if (userId) {
      const userReference = doc(db, "users", userId);
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
      const newUsername = updateUsernameInput.current.value.trim();
      const usernameQuery = query(
        collection(db, "users"),
        where("username", "==", newUsername)
      );
      const usersWithUsername = await getDocs(usernameQuery);
      if (usersWithUsername.docs.length > 0) {
        setUsernameErrorMessage(
          "Username is already taken. Please try another."
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
      setViewerIsAuthor(userInDb.id === userId);
    } else {
      setViewerIsAuthor(false);
    }
  }, [userInDb, userId]);

  return (
    <div>
      {userInfo ? (
        <div className="space-y-6">
          {/* User Profile Header Card */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={userInfo.data.photoUrl || profilePic}
                  alt={userInfo.data.name}
                  className="rounded-full h-16 w-16 object-cover border-2 border-peerbots-teal/30"
                />
                <div>
                  <Heading level={2} className="text-gray-900 font-bold">
                    {userInfo.data.name}
                  </Heading>
                  {userInfo.data.username && (
                    <Text size="sm" color="muted">
                      @{userInfo.data.username}
                    </Text>
                  )}
                </div>
              </div>

              {user && viewerIsAuthor && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    color="neutral"
                    size="sm"
                    onClick={() => setEditingName(true)}
                  >
                    Edit Name
                  </Button>
                  <Button
                    variant="outline"
                    color="neutral"
                    size="sm"
                    onClick={() => setEditingUsername(true)}
                  >
                    Edit Handle
                  </Button>
                  <Button
                    variant="outline"
                    color="neutral"
                    size="sm"
                    onClick={() => setEditingDescription(true)}
                  >
                    Edit Bio
                  </Button>
                </div>
              )}
            </div>

            {/* Edit Name Form */}
            {userInDb && editingName && (
              <form onSubmit={updateName} className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  New Display Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    ref={updateNameInput}
                    defaultValue={userInDb.data.name}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-peerbots-teal"
                  />
                  <Button color="primary" size="sm" type="submit">
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    type="button"
                    onClick={() => setEditingName(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Edit Username Form */}
            {userInDb && editingUsername && (
              <form onSubmit={updateUsername} className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  New Username
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    ref={updateUsernameInput}
                    defaultValue={userInDb.data.username}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-peerbots-teal"
                  />
                  <Button color="primary" size="sm" type="submit">
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    type="button"
                    onClick={() => setEditingUsername(false)}
                  >
                    Cancel
                  </Button>
                </div>
                {usernameErrorMessage && (
                  <Text size="xs" color="error">
                    {usernameErrorMessage}
                  </Text>
                )}
              </form>
            )}

            {/* Bio / Description */}
            {userInfo.data.description && (
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {userInfo.data.description}
              </p>
            )}

            {/* Edit Description Form */}
            {userInDb && editingDescription && (
              <form onSubmit={updateDescription} className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  New Bio
                </label>
                <textarea
                  ref={updateDescriptionInput}
                  defaultValue={userInDb.data.description}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-peerbots-teal mb-2"
                />
                <div className="flex gap-2">
                  <Button color="primary" size="sm" type="submit">
                    Save Bio
                  </Button>
                  <Button
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    type="button"
                    onClick={() => setEditingDescription(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* User's Authored Content */}
          <ContentRow
            content={content}
            title={`Content Authored by ${userInfo.data.name}`}
            description="Public interaction templates published by this creator."
          />
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500">Loading profile...</div>
      )}
    </div>
  );
}
