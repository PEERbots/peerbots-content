import { useRouter } from "next/router";
import firebaseApp from "../../firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  doc,
  getDocs,
  documentId,
  getDoc,
  addDoc,
  Timestamp,
  limit,
} from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import amplitude from "amplitude-js";
import Link from "next/link";
import ContentRow from "../../components/contentRow";

import { useFirebaseAuth } from "../../auth";

export default function ContentPage() {
  const { user, userInDb } = useFirebaseAuth();

  const [contentInfo, setContentInfo] = useState({});
  const [author, setAuthor] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [tags, setTags] = useState([]);
  const [contentAuthored, setContentAuthored] = useState(false);
  const [contentPurchased, setContentPurchased] = useState(false);
  const [copies, setCopies] = useState([]);

  const copyAsInput = useRef();

  const db = getFirestore(firebaseApp);

  const router = useRouter();
  const { contentId } = router.query;

  const copyContent = async (e) => {
    e.preventDefault();
    const contentName = copyAsInput.current.value;
    let newContent = contentInfo;
    newContent.name = contentName;
    newContent.originalName = contentInfo.name;
    newContent.copyOf = doc(db, "content", contentId);
    newContent.copyDate = Timestamp.now();
    newContent.public = false;
    newContent.trusted = false;
    newContent.owner = doc(db, "users", userInDb.id);

    const data = await addDoc(collection(db, "content"), newContent);

    router.push(`/content/${data.id}`);
  };

  const checkContentOwned = async (content) => {
    if (userInDb && Object.keys(userInDb).length > 0) {
      if (userInDb.id == content.owner.id) {
        setContentAuthored(true);
        setContentPurchased(false);
        return true;
      }
      setContentAuthored(false);

      const q = query(
        collection(db, "sales"),
        where("content", "==", doc(db, "content", contentId)),
        where("buyer", "==", doc(db, "users", userInDb.id)),
        limit(1)
      );

      const data = await getDocs(q);

      setContentPurchased(data.docs.length > 0);

      return data.docs.length > 0;
    }
  };

  const acquireContent = async () => {
    if (!(contentAuthored || contentPurchased)) {
      const data = await addDoc(collection(db, "sales"), {
        buyer: doc(db, "users", userInDb.id),
        content: doc(db, "content", contentId),
        datetime: Timestamp.now(),
      });
      setContentPurchased(true);
    }
  };

  const fetchCopies = async () => {
    const copiesQuery = query(
      collection(db, "content"),
      where("copyOf", "==", doc(db, "content", contentId)),
      where("owner", "==", doc(db, "users", userInDb.id))
    );
    const data = await getDocs(copiesQuery);
    const copiesInDb = data.docs.map((doc) => {
      return {
        id: doc.id,
        data: doc.data(),
      };
    });
    setCopies(copiesInDb);
  };

  const fetchAuthor = async (contentInfoFromDb) => {
    const authorRef = doc(db, "users", contentInfoFromDb.owner.id);
    const author = await getDoc(authorRef);
    const authorInfo = author.data();
    setAuthor(authorInfo);
  };

  const fetchTags = async (contentInfoFromDb) => {
    const tagsIds = contentInfoFromDb.tags.map((tag) => {
      return tag.id;
    });
    const tagsQuery = query(
      collection(db, "tags"),
      where(documentId(), "in", tagsIds)
    );
    const tagsData = await getDocs(tagsQuery);
    const tagsFromDb = tagsData.docs.map((doc) => {
      return {
        id: doc.id,
        data: doc.data(),
      };
    });
    setTags(tagsFromDb);
  };

  const fetchReviews = async () => {
    const contentRef = doc(db, "content", contentId);
    const reviewsQuery = query(
      collection(db, "reviews"),
      where("content", "==", contentRef)
    );
    const reviewsData = await getDocs(reviewsQuery);
    const reviewsFromDb = reviewsData.docs.map((doc) => {
      return {
        id: doc.id,
        data: doc.data(),
      };
    });

    const reviewersIds = reviewsFromDb.map((review) => review.data.user.id);
    if (reviewersIds.length > 0) {
      const reviewersQuery = query(
        collection(db, "users"),
        where(documentId(), "in", reviewersIds)
      );
      const reviewersData = await getDocs(reviewersQuery);
      const reviewersFromDb = reviewersData.docs.map((doc) => {
        return { id: doc.id, data: doc.data() };
      });
      setReviewers(reviewersFromDb);
      setReviews(reviewsFromDb);
    } else {
      setReviewers([]);
      setReviews([]);
    }
  };

  const fetchContentDetails = async () => {
    if (contentId) {
      const contentRef = doc(db, "content", contentId);
      const content = await getDoc(contentRef);

      if (content.exists()) {
        setContentInfo(content.data());
      } else {
        // Go to 404
      }
    }
  };
  useEffect(() => {
    fetchContentDetails();
  }, [contentId]);

  useEffect(() => {
    if (contentInfo && Object.keys(contentInfo).length != 0) {
      fetchAuthor(contentInfo);
      fetchTags(contentInfo);
      fetchReviews();
    }
  }, [contentInfo]);

  useEffect(() => {
    if (
      contentInfo &&
      userInDb &&
      Object.keys(contentInfo).length != 0 &&
      Object.keys(userInDb).length != 0
    ) {
      const contentOwned = checkContentOwned(contentInfo);
      if (contentOwned) {
        fetchCopies();
      }
    }
  }, [contentInfo, userInDb]);

  useEffect(() => {
    amplitude.getInstance().logEvent("Viewed Page: Content Details", {
      "Content ID": contentId,
    });
  }, []);

  return (
    <div>
      <div className="bg-white shadow-md my-4 mx-2 rounded p-4">
        <div className="">
          <h1 className="text-2xl">{contentInfo.name}</h1>
        </div>
        <div>
          <span className="text-xs">Authored by</span>
          {author ? (
            <div className="text-gray-800">
              <span>
                {author.photoUrl ? (
                  <img
                    src={author.photoUrl}
                    className="h-8 inline-block rounded-full"
                  ></img>
                ) : (
                  <img
                    src="profile_pic.png"
                    className="h-8 inline-block rounded-full"
                  ></img>
                )}
              </span>
              <span className="ml-1 text-base">{author.name}</span>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div>
          {tags &&
            tags.map((eachTag) => (
              <span
                key={eachTag.id}
                style={{
                  background: eachTag.data.color,
                  color: eachTag.data.textColor,
                }}
                className="rounded-3xl px-2 mx-1 text-xs"
              >
                {eachTag.data.name}
              </span>
            ))}
        </div>
      </div>
      <div className="bg-white shadow-md my-4 mx-2 rounded p-4 ">
        <div>{contentInfo.description}</div>
      </div>

      <div className="bg-white shadow-md my-4 mx-2 rounded p-4 ">
        {!contentInfo.copyOf ? (
          <div>
            {reviews.length > 0 ? (
              <>
                <h3>Reviews</h3>
                {reviews.map((review) => (
                  <div key={review.id}>
                    <div>{review.data.rating}</div>
                    <div>
                      <div>
                        <img
                          src={
                            reviewers.filter((reviewer) => {
                              return reviewer.id == review.data.user.id;
                            })[0].data.photoUrl
                          }
                        ></img>
                      </div>
                      <div>
                        {
                          reviewers.filter((reviewer) => {
                            return reviewer.id == review.data.user.id;
                          })[0].data.name
                        }
                      </div>
                    </div>
                    <div>{review.data.description}</div>
                  </div>
                ))}
              </>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div>{""}</div>
        )}
      </div>

      <div>
        <div>
          {!contentInfo.copyOf && reviews ? (
            <>
              {reviews.length > 0 ? (
                <span>
                  <span className="text-accent-hc font-bold px-2 text-base">
                    {reviews.reduce((sum, { data }) => {
                      return sum + data.rating;
                    }, 0) / reviews.length}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 inline-block"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </span>
                  <span className="text-sm">({reviews.length} reviews)</span>
                </span>
              ) : (
                <span className="text-xs">No reviews yet</span>
              )}
            </>
          ) : (
            <span>{""}</span>
          )}
        </div>
        <div>
          {contentInfo.copyOf ? (
            <span>
              This is a copy of{" "}
              <Link
                href="/content/[contentId]"
                as={`/content/${contentInfo.copyOf.id}`}
              >
                this content
              </Link>
            </span>
          ) : (
            <div>
              {contentInfo.price == 0 ? (
                <span className="uppercase">Free</span>
              ) : (
                <span>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(contentInfo.price)}
                </span>
              )}
            </div>
          )}
        </div>
        {user ? (
          <>
            {contentAuthored || contentPurchased ? (
              <>
                {contentAuthored ? (
                  <span>You authored this content</span>
                ) : (
                  <span>You purchased this content</span>
                )}
                <form onSubmit={copyContent}>
                  <label>Copy As</label>
                  <input
                    type="text"
                    ref={copyAsInput}
                    className="input-base form-input"
                    name="copyAs"
                    placeholder={contentInfo.name}
                  ></input>
                  <button
                    className="btn-primary"
                    type="submit"
                    onClick={copyContent}
                  >
                    {" "}
                    Copy to App!
                  </button>
                </form>
              </>
            ) : (
              <button
                className="btn-primary"
                onClick={() => {
                  amplitude
                    .getInstance()
                    .logEvent(
                      "Clicked Button: Content Details - Acquire Content",
                      {
                        "Content ID": contentId,
                      }
                    );
                  acquireContent();
                }}
              >
                + Acquire Content
              </button>
            )}
          </>
        ) : (
          <div>
            <span className="text-sm">
              You must sign in to acquire content.
            </span>
            <button className="btn-primary" disabled>
              + Acquire Content
            </button>
          </div>
        )}
      </div>

      <div>
        {copies.length > 0 ? (
          <div>
            <ContentRow content={copies}>
              <h3>Your copies</h3>
            </ContentRow>
          </div>
        ) : (
          <div>{""}</div>
        )}
      </div>
    </div>
  );
}
