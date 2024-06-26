import {
  Timestamp,
  addDoc,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import ContentRow from "../../components/contentRow";
import Link from "next/link";
import { Rating } from "@mui/material";
import SummaryRating from "../../components/summaryRating";
import TrustedStar from "../../components/trustedStar";
import amplitude from "amplitude-js";
import firebaseApp from "../../firebase";
import { useFirebaseAuth } from "../../auth";
import { useRouter } from "next/router";

export default function ContentPage() {
  const { user, userInDb } = useFirebaseAuth();

  const [contentInfo, setContentInfo] = useState({});
  const [author, setAuthor] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [copiesCount, setCopiesCount] = useState(null);
  const [salesCount, setSalesCount] = useState(null);
  const [tags, setTags] = useState([]);

  const [original, setOriginal] = useState({});

  const [contentAuthored, setContentAuthored] = useState(false);
  const [contentPurchased, setContentPurchased] = useState(false);
  const [copies, setCopies] = useState([]);

  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const updateNameInput = useRef();
  const updateDescriptionInput = useRef();

  const [hasReview, setHasReview] = useState(false);
  const [userReview, setUserReview] = useState({});
  const [newUserReviewRating, setNewUserReviewRating] = useState(0);
  const reviewDescriptionInput = useRef();

  const copyAsInput = useRef();
  const descriptionParagraph = useRef();
  const [isDescriptionLong, setIsDescriptionLong] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const db = getFirestore(firebaseApp);

  const router = useRouter();
  const { contentId } = router.query;

  function calculateIsDescriptionLong() {
    // https://stackoverflow.com/questions/52169520/how-can-i-check-whether-line-clamp-is-enabled
    if (descriptionParagraph.current) {
      const sh = descriptionParagraph.current.scrollHeight;
      const ch = descriptionParagraph.current.clientHeight;
      if (sh > 0 && ch > 0) {
        setIsDescriptionLong(sh > ch);
      }
    }
  }

  const updateReview = async (e) => {
    e.preventDefault();
    if (contentPurchased && Object.keys(userInDb).length > 0) {
      if (hasReview) {
        const updatedReviewData = await updateDoc(
          doc(db, "reviews", userReview.id),
          {
            rating: newUserReviewRating,
            description: reviewDescriptionInput.current.value,
          }
        );
      } else {
        const newReview = {
          content: doc(db, "content", contentId),
          user: doc(db, "users", userInDb.id),
          rating: newUserReviewRating,
          description: reviewDescriptionInput.current.value,
        };
        const addedReviewData = await addDoc(
          collection(db, "reviews"),
          newReview
        );
      }
      fetchUserReview();
      fetchReviews();
    }
  };

  const updateName = async (e) => {
    e.preventDefault();
    const contentRef = doc(db, "content", contentId);
    await updateDoc(contentRef, { name: updateNameInput.current.value });
    setEditingName(false);
    fetchContentDetails();
  };

  const updateDescription = async (e) => {
    e.preventDefault();
    const contentRef = doc(db, "content", contentId);
    await updateDoc(contentRef, {
      description: updateDescriptionInput.current.value,
    });
    setEditingDescription(false);
    fetchContentDetails();
  };

  const listPublicly = async (e) => {
    if (contentAuthored) {
      const contentRef = doc(db, "content", contentId);
      await updateDoc(contentRef, { public: true, price: 0 });
      fetchContentDetails();
    }
  };

  // Copied from peerbots-controller-web. Needs refactor to cloud fundtions that both repos call for Firebase-related editing
  const updateTemplatesInfoForContent = async (contentID) => {
    const contentTemplates = await getDocs(
      collection(db, "content", contentID, "templates")
    );
    const templatesInfo = contentTemplates.docs.map((eachTemplate) => {
      let eachTemplatesData = eachTemplate.data();
      return {
        id: eachTemplate.id,
        title: eachTemplatesData.title,
        ...(eachTemplatesData.description && {
          description: eachTemplatesData.description,
        }),
      };
    });
    const updatedContent = await updateDoc(doc(db, "content", contentID), {
      templatesInfo: templatesInfo,
    });
    return updatedContent;
  };

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

    const newContentData = await addDoc(collection(db, "content"), newContent);

    if (contentInfo.templatesInfo && contentInfo.templatesInfo.length > 0) {
      const allTemplates = await getDocs(
        collection(db, "content", contentId, "templates")
      );
      allTemplates.forEach((templateDoc) => {
        addDoc(
          collection(db, "content", newContentData.id, "templates"),
          templateDoc.data()
        );
      });
    }

    await updateTemplatesInfoForContent(newContentData.id);

    router.push(`/content/${newContentData.id}`);
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

  const fetchOriginal = async () => {
    if (contentInfo.copyOf) {
      const originalInDb = await getDoc(contentInfo.copyOf);
      setOriginal(originalInDb.data());
    }
  };

  const fetchAuthor = async (contentInfoFromDb) => {
    const authorRef = doc(db, "users", contentInfoFromDb.owner.id);
    const author = await getDoc(authorRef);
    const authorInfo = author.data();
    setAuthor(authorInfo);
  };

  const fetchTags = async (contentInfoFromDb) => {
    if (contentInfoFromDb.tags) {
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
    } else {
      setTags([]);
    }
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

  const fetchUserReview = async () => {
    if (userInDb && Object.keys(userInDb).length > 0 && contentPurchased) {
      const userReviewQuery = query(
        collection(db, "reviews"),
        where("content", "==", doc(db, "content", contentId)),
        where("user", "==", doc(db, "users", userInDb.id))
      );
      const reviewsData = await getDocs(userReviewQuery);
      if (reviewsData.docs.length > 0) {
        setUserReview({
          id: reviewsData.docs[0].id,
          data: reviewsData.docs[0].data(),
        });
        setHasReview(true);
      } else {
        setHasReview(false);
        setUserReview({});
      }
    }
  };

  const fetchSalesCount = async () => {
    const contentRef = doc(db, "content", contentId);
    const salesQuery = query(
      collection(db, "sales"),
      where("content", "==", contentRef)
    );
    const salesData = await getDocs(salesQuery);
    setSalesCount(salesData.docs.length);
  };

  const fetchCopiesCount = async () => {
    const contentRef = doc(db, "content", contentId);
    const copiesQuery = query(
      collection(db, "content"),
      where("copyOf", "==", contentRef)
    );
    const copiesData = await getDocs(copiesQuery);
    setCopiesCount(copiesData.docs.length);
  };

  const fetchContentDetails = async () => {
    if (contentId) {
      const contentRef = doc(db, "content", contentId);
      const content = await getDoc(contentRef);

      if (content.exists()) {
        setContentInfo(content.data());
      } else {
        // Go to 404
        router.push("/404", "/not-found");
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
      fetchSalesCount();
      fetchCopiesCount();
      fetchOriginal();
    }
  }, [contentInfo]);

  useEffect(() => {
    if (!user) {
      setCopies([]);
    }
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
    fetchUserReview();
  }, [contentInfo, user, userInDb]);

  useEffect(() => {
    fetchUserReview();
  }, [userInDb, contentPurchased]);

  useEffect(() => {
    amplitude.getInstance().logEvent("Viewed Page: Content Details", {
      "Content ID": contentId,
    });
  }, []);

  useLayoutEffect(() => {
    calculateIsDescriptionLong();
    window.addEventListener("resize", calculateIsDescriptionLong);
    return () =>
      window.removeEventListener("resize", calculateIsDescriptionLong);
  }, [descriptionParagraph.current]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <div className="w-full col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
          {/* Summary section */}
          <div className="bg-white shadow-md my-4 mx-2 rounded p-8">
            <div className="flex items-center">
              <span className="text-2xl flex items-center">
                {contentInfo.name} <TrustedStar content={contentInfo} />
              </span>
              {user && contentAuthored && (
                <button
                  className="border border-gray-400 mx-2 p-2 hover:bg-gray-400 hover:text-white rounded"
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
                  Edit
                </button>
              )}
            </div>
            {editingName && (
              <div>
                <form onSubmit={updateName}>
                  <label>New Name</label>
                  <input
                    type="text"
                    ref={updateNameInput}
                    className="input-base form-input"
                    name="updatedName"
                    defaultValue={contentInfo.name}
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
            <div className="flex">
              <div className="my-2">
                {tags &&
                  tags.map((eachTag) => (
                    <Link
                      key={eachTag.id}
                      href="/tag/[tagId]"
                      as={`/tag/${eachTag.id}`}
                    >
                      <span
                        key={eachTag.id}
                        style={{
                          background: eachTag.data.color,
                          color: eachTag.data.textColor,
                        }}
                        className="rounded-3xl px-2 mx-1 text-xs cursor-pointer"
                      >
                        {eachTag.data.name}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>

          {/* Templates Section */}
          {contentInfo &&
            contentInfo.templatesInfo &&
            contentInfo.templatesInfo.length > 0 && (
              <div className="row-end-auto bg-white shadow-md my-4 mx-2 rounded p-8">
                <h3 className="block text-xl mb-4">Included Templates</h3>
                {contentInfo.templatesInfo.map((template) => {
                  return (
                    <div
                      className="border border-gray-400 mx-2 p-2 rounded inline-block"
                      key={template.id}
                    >
                      {template.title}
                    </div>
                  );
                })}
              </div>
            )}

          {/* Description Section */}
          <div className="row-end-auto bg-white shadow-md my-4 mx-2 rounded p-8">
            <div>
              {user && contentAuthored && (
                <div className="mb-4">
                  <h3 className="inline-block text-xl">Description</h3>
                  <button
                    className="border border-gray-400 mx-2 p-2 hover:bg-gray-400 hover:text-white rounded"
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
                    Edit
                  </button>
                </div>
              )}
              {editingDescription && (
                <div>
                  <form onSubmit={updateDescription}>
                    <label>New Description</label>
                    <textarea
                      type="text"
                      ref={updateDescriptionInput}
                      className="input-base form-input"
                      name="updatedDescription"
                      defaultValue={contentInfo.description}
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
              <p
                className={`${
                  isDescriptionExpanded ? "line-clamp-none" : "line-clamp-5"
                } `}
                ref={descriptionParagraph}
              >
                {contentInfo.description}
              </p>
              {isDescriptionLong && !isDescriptionExpanded && (
                <p className="font-bold text-dark-primary cursor-pointer">
                  <a
                    onClick={() => {
                      setIsDescriptionExpanded(true);
                    }}
                  >
                    Read more...
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1">
          {/* Public Listing Section */}
          {user &&
            contentAuthored &&
            !contentInfo.copyOf &&
            !contentInfo.public && (
              <div className="bg-white shadow-md my-4 mx-2 rounded p-8 text-center">
                <div className="text-sm mb-2">
                  Listing content will make it publicly available to others for
                  free! Listing content publicly will allow others to copy it
                  and use it on the Peerbots app.{" "}
                </div>
                <div className="text-sm font-bold mb-2">
                  Once content is public it can not be made private.
                </div>
                <div className="mt-2">
                  <button className="btn-primary" onClick={listPublicly}>
                    List this publicly for free!
                  </button>
                </div>
              </div>
            )}

          {/* Acquisition or Statistics Section */}
          {contentInfo.public && !contentInfo.copyOf && (
            <div className="bg-white shadow-md my-4 mx-2 rounded p-8 text-center">
              <div className="text-center">
                <div className="text-sm mb-2">
                  This content is available for
                </div>
                {contentInfo.price == 0 ? (
                  <span className="uppercase text-2xl text-green-700 font-bold">
                    Free
                  </span>
                ) : (
                  <span className="text-2xl text-accent-two font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(contentInfo.price)}
                  </span>
                )}
              </div>

              {user ? (
                <>
                  {!(contentAuthored || contentPurchased) && (
                    <div>
                      <button
                        className="btn-primary mt-4"
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
                        + Acquire
                      </button>{" "}
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-2">
                  <span className="text-sm">
                    You must sign in to acquire content.
                  </span>
                  <button className="btn-primary" disabled>
                    + Acquire
                  </button>
                </div>
              )}

              {/* Sales, Copies and Rating */}
              <div className="text-center my-2 mt-8">
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 inline-block mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  {salesCount} sales{" "}
                </span>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 inline-block mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    />
                  </svg>
                  {copiesCount} copies
                </span>
              </div>
              <div className="text-center">
                {!contentInfo.copyOf && contentInfo.public && reviews && (
                  <SummaryRating reviews={reviews} />
                )}
              </div>
            </div>
          )}

          {/* Link to original section */}
          {contentInfo.copyOf && (
            <div className="bg-white shadow-md my-4 mx-2 rounded p-8">
              <div className="text-center">
                This is a copy of
                <div>
                  <Link
                    href="/content/[contentId]"
                    as={`/content/${contentInfo.copyOf.id}`}
                  >
                    <a className="underline decoration-primary text-primary hover:text-dark-primary hover:decoration-dark-primary font-bold">
                      {original.name}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Copy this content section */}
          {user && (contentAuthored || contentPurchased) && (
            <div className="bg-white shadow-md my-4 mx-2 rounded p-8 text-center">
              <form onSubmit={copyContent}>
                <label className="block mb-2">Copy As</label>
                <input
                  type="text"
                  ref={copyAsInput}
                  className="input-base form-input w-full text-gray-700"
                  name="copyAs"
                  defaultValue={`Copy of ${contentInfo.name}`}
                ></input>
                <button
                  className="btn-primary mt-4"
                  type="submit"
                  onClick={copyContent}
                >
                  Copy to App!
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      {contentInfo.public && !contentInfo.copyOf && reviews.length > 0 && (
        <div className="bg-white shadow-md my-4 mx-2 rounded p-8">
          <div className="mb-6">
            {user && contentPurchased && (
              <div className="bg-white rounded my-4">
                {hasReview ? (
                  <span className="font-bold">Update your review</span>
                ) : (
                  <span className="font-bold">Write a review</span>
                )}
                <form onSubmit={updateReview}>
                  <div>
                    New Rating:
                    <Rating
                      max={5}
                      onChange={(e, value) => {
                        setNewUserReviewRating(value);
                      }}
                      className="p-4"
                    />
                  </div>
                  <div>
                    <label>Review:</label>
                    {hasReview ? (
                      <input
                        type="input"
                        className="input-base"
                        ref={reviewDescriptionInput}
                        placeholder="Review Details"
                        defaultValue={userReview.data.description}
                      />
                    ) : (
                      <input
                        type="input"
                        className="input-base"
                        ref={reviewDescriptionInput}
                        placeholder="Review Details"
                      />
                    )}
                    <button className="btn-primary" type="submit">
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            )}
            <h3 className="text-xl">Reviews</h3>
            <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 lg:gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white shadow-lg rounded p-4 w-64 mx-auto"
                >
                  <div className="flex justify-between mb-2">
                    <div>
                      <Rating
                        value={review.data.rating}
                        max={5}
                        readOnly
                        size="small"
                      />
                    </div>

                    <div className="align-middle">
                      <span>
                        <img
                          src={
                            reviewers.filter((reviewer) => {
                              return reviewer.id == review.data.user.id;
                            })[0].data.photoUrl
                          }
                          className="rounded-full h-6 w-6 inline-block mr-1"
                        ></img>
                      </span>
                      <span className="text-sm">
                        {
                          reviewers.filter((reviewer) => {
                            return reviewer.id == review.data.user.id;
                          })[0].data.name
                        }
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    {review.data.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Copies Section */}
      <div>
        {copies.length > 0 ? (
          <div>
            <ContentRow content={copies}>
              <h3 className="text-xl">Your copies</h3>
            </ContentRow>
          </div>
        ) : (
          <div>{""}</div>
        )}
      </div>
    </div>
  );
}
