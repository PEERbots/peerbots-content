import {
  Timestamp,
  addDoc,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button, Heading, Text, Icon } from "@peerbots/core";

import ContentRow from "../../components/contentRow";
import StarRating from "../../components/StarRating";
import SummaryRating from "../../components/summaryRating";
import TrustedStar from "../../components/trustedStar";
import { db } from "../../../firebase";
import { useFirebaseAuth } from "../../state/AuthProvider";
import { Content, ContentData } from "../../types/content";
import { UserRecord } from "../../types/user";
import { Review } from "../../types/review";
import { Tag } from "../../types/tag";
import profilePic from "../../assets/profile_pic.png";

export default function ContentPage() {
  const { user, userInDb } = useFirebaseAuth();

  const [contentInfo, setContentInfo] = useState<Content | null>(null);
  const [author, setAuthor] = useState<UserRecord | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewers, setReviewers] = useState<UserRecord[]>([]);
  // const [copiesCount, setCopiesCount] = useState(null);
  const [salesCount, setSalesCount] = useState<number | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);

  const [original, setOriginal] = useState<Content | null>(null);

  const [contentAuthored, setContentAuthored] = useState<boolean>(false);
  const [contentPurchased, setContentPurchased] = useState<boolean>(false);
  const [copies, setCopies] = useState<Content[]>([]);

  const [editingName, setEditingName] = useState<boolean>(false);
  const [editingDescription, setEditingDescription] = useState<boolean>(false);
  const updateNameInput = useRef<HTMLInputElement>(null);
  const updateDescriptionInput = useRef<HTMLTextAreaElement>(null);

  const [hasReview, setHasReview] = useState<boolean>(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [newUserReviewRating, setNewUserReviewRating] = useState(0);
  const reviewDescriptionInput = useRef<HTMLInputElement>(null);

  const copyAsInput = useRef<HTMLInputElement>(null);
  const descriptionParagraph = useRef<HTMLParagraphElement>(null);
  const [isDescriptionLong, setIsDescriptionLong] = useState<boolean>(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const { contentId } = useParams();

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

  const updateReview = async (e: FormEvent) => {
    e.preventDefault();
    if (
      contentPurchased &&
      userInDb !== null &&
      Object.keys(userInDb).length > 0
    ) {
      if (hasReview && userReview !== null && reviewDescriptionInput.current) {
        await updateDoc(doc(db, "reviews", userReview.id), {
          rating: newUserReviewRating,
          description: reviewDescriptionInput.current.value,
        });
      } else {
        if (reviewDescriptionInput.current && contentId) {
          const newReview = {
            content: doc(db, "content", contentId),
            user: doc(db, "users", userInDb.id),
            rating: newUserReviewRating,
            description: reviewDescriptionInput.current.value,
          };
          await addDoc(collection(db, "reviews"), newReview);
        }
      }
      fetchUserReview();
      fetchReviews();
    }
  };

  const updateName = async (e: FormEvent) => {
    e.preventDefault();
    if (contentId && updateNameInput.current) {
      const contentRef = doc(db, "content", contentId);
      await updateDoc(contentRef, { name: updateNameInput.current.value });
      setEditingName(false);
      fetchContentDetails();
    }
  };

  const updateDescription = async (e: FormEvent) => {
    e.preventDefault();
    if (contentId && updateDescriptionInput.current) {
      const contentRef = doc(db, "content", contentId);
      await updateDoc(contentRef, {
        description: updateDescriptionInput.current.value,
      });
      setEditingDescription(false);
      fetchContentDetails();
    }
  };

  const listPublicly = async () => {
    if (contentAuthored && contentId) {
      const contentRef = doc(db, "content", contentId);
      await updateDoc(contentRef, { public: true, price: 0 });
      fetchContentDetails();
    }
  };

  // Copied from peerbots-controller-web. Needs refactor to cloud fundtions that both repos call for Firebase-related editing
  const updateTemplatesInfoForContent = async (contentID: string) => {
    const contentTemplates = await getDocs(
      collection(db, "content", contentID, "templates")
    );
    const templatesInfo = contentTemplates.docs.map((eachTemplate) => {
      const eachTemplatesData = eachTemplate.data();
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

  const copyContent = async (e: FormEvent) => {
    e.preventDefault();
    if (
      contentId &&
      copyAsInput.current &&
      contentInfo !== null &&
      userInDb !== null
    ) {
      const contentName = copyAsInput.current.value;
      const newContent: ContentData = {
        ...contentInfo.data,
        name: contentName,
        originalName: contentInfo.data.name,
        copyOf: doc(db, "content", contentId),
        copyDate: Timestamp.now(),
        public: false,
        trusted: false,
        owner: doc(db, "users", userInDb.id),
      };

      const newContentData = await addDoc(
        collection(db, "content"),
        newContent
      );

      if (
        contentId &&
        contentInfo.data.templatesInfo &&
        contentInfo.data.templatesInfo.length > 0
      ) {
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

      navigate(`/content/${newContentData.id}`);
    }
  };

  const checkContentOwned = async (content: Content) => {
    if (contentId && userInDb && Object.keys(userInDb).length > 0) {
      if (userInDb.id == content.data.owner.id) {
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
    if (
      !(contentAuthored || contentPurchased) &&
      userInDb !== null &&
      contentId
    ) {
      await addDoc(collection(db, "sales"), {
        buyer: doc(db, "users", userInDb.id),
        content: doc(db, "content", contentId),
        datetime: Timestamp.now(),
      });
      setContentPurchased(true);
    }
  };

  const fetchCopies = async () => {
    if (userInDb !== null && contentId) {
      const copiesQuery = query(
        collection(db, "content"),
        where("owner", "==", doc(db, "users", userInDb.id)),
        where("copyOf", "==", doc(db, "content", contentId))
      );
      const data = await getDocs(copiesQuery);
      const copiesInDb = data.docs.map((doc) => {
        return {
          id: doc.id,
          data: doc.data(),
        };
      }) as Content[];
      setCopies(copiesInDb);
    }
  };

  const fetchOriginal = async () => {
    if (contentInfo !== null && contentInfo.data.copyOf) {
      const originalInDb = await getDoc(
        doc(db, "content", contentInfo.data.copyOf.id)
      );
      setOriginal({
        id: originalInDb.id,
        data: originalInDb.data(),
      } as Content);
    }
  };

  const fetchAuthor = async (contentInfoFromDb: Content) => {
    const authorRef = doc(db, "users", contentInfoFromDb.data.owner.id);
    const author = await getDoc(authorRef);
    const authorInfo = { id: author.id, data: author.data() } as UserRecord;
    setAuthor(authorInfo);
  };

  const fetchTags = async (contentInfoFromDb: Content) => {
    if (contentInfoFromDb.data.tags) {
      const tagsIds = contentInfoFromDb.data.tags.map((tag) => {
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
      }) as Tag[];
      setTags(tagsFromDb);
    } else {
      setTags([]);
    }
  };

  const fetchReviews = async () => {
    if (contentId) {
      const contentRef = doc(db, "content", contentId);
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("content", "==", contentRef)
      );
      const reviewsData = await getDocs(reviewsQuery);
      const reviewsFromDb = reviewsData.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          data: { ...d, userId: d.user.id, contentId: d.content.id },
        };
      }) as Review[];

      const reviewersIds = reviewsFromDb.map((review) => review.data.userId);
      if (reviewersIds.length > 0) {
        const reviewersQuery = query(
          collection(db, "users"),
          where(documentId(), "in", reviewersIds)
        );
        const reviewersData = await getDocs(reviewersQuery);
        const reviewersFromDb = reviewersData.docs.map((doc) => {
          return { id: doc.id, data: doc.data() };
        }) as UserRecord[];
        setReviewers(reviewersFromDb);
        setReviews(reviewsFromDb);
      } else {
        setReviewers([]);
        setReviews([]);
      }
    }
  };

  const fetchUserReview = async () => {
    if (
      contentId &&
      userInDb &&
      Object.keys(userInDb).length > 0 &&
      contentPurchased
    ) {
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
        } as Review);
        setHasReview(true);
      } else {
        setHasReview(false);
        setUserReview(null);
      }
    }
  };

  const fetchSalesCount = async () => {
    if (contentId) {
      const contentRef = doc(db, "content", contentId);
      const salesQuery = query(
        collection(db, "sales"),
        where("content", "==", contentRef)
      );
      const salesData = await getDocs(salesQuery);
      setSalesCount(salesData.docs.length);
    }
  };

  // TODO: Figure out a way to structure data where it makes sense to give away this information
  // const fetchCopiesCount = async () => {
  //   const contentRef = doc(db, "content", contentId);
  //   const copiesQuery = query(
  //     collection(db, "content"),
  //     where("copyOf", "==", contentRef)
  //   );
  //   const copiesData = await getDocs(copiesQuery);
  //   setCopiesCount(copiesData.docs.length);
  // };

  const fetchContentDetails = async () => {
    if (contentId) {
      const contentRef = doc(db, "content", contentId);
      const content = await getDoc(contentRef);

      if (content.exists()) {
        setContentInfo({ id: content.id, data: content.data() } as Content);
      } else {
        // Go to 404
        navigate("/not-found");
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
      // fetchCopiesCount();
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
      checkContentOwned(contentInfo).then((isOwned) => {
        if (isOwned) {
          fetchCopies();
        }
      });
    }
    fetchUserReview();
  }, [contentInfo, user, userInDb]);

  useEffect(() => {
    fetchUserReview();
  }, [userInDb, contentPurchased]);

  useLayoutEffect(() => {
    calculateIsDescriptionLong();
    window.addEventListener("resize", calculateIsDescriptionLong);
    return () =>
      window.removeEventListener("resize", calculateIsDescriptionLong);
  }, [descriptionParagraph.current]);

  const isFree = contentInfo?.data.price === 0 || !contentInfo?.data.price;
  const canOpenInController =
    (contentInfo?.data.public && isFree) || contentAuthored || contentPurchased;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Column (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Card */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 min-w-0">
                <Heading level={2} className="text-gray-900 font-bold truncate">
                  {contentInfo && contentInfo.data.name}
                </Heading>
                {contentInfo && <TrustedStar content={contentInfo} />}
              </div>

              {user && contentAuthored && (
                <Button
                  variant="outline"
                  color="neutral"
                  size="sm"
                  onClick={() => setEditingName(true)}
                  className="flex items-center gap-1.5"
                >
                  <Icon name="pencilSquare" className="w-3.5 h-3.5" />
                  <span>Edit Name</span>
                </Button>
              )}
            </div>

            {editingName && contentInfo && (
              <form onSubmit={updateName} className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Edit Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    ref={updateNameInput}
                    defaultValue={contentInfo.data.name}
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

            {author && (
              <div className="flex items-center gap-2 mb-4">
                <Text size="xs" color="muted">
                  Authored by
                </Text>
                <Link
                  to={`/u/${author.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-peerbots-darkteal"
                >
                  <img
                    src={author.data.photoUrl || profilePic}
                    alt={author.data.name || "Author"}
                    className="h-6 w-6 rounded-full object-cover border border-gray-200"
                  />
                  <span>{author.data.name}</span>
                </Link>
              </div>
            )}

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                {tags.map((eachTag) => (
                  <Link
                    key={eachTag.id}
                    to={`/tag/${eachTag.id}`}
                    className="text-xs px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-peerbots-teal/15 hover:text-peerbots-darkteal transition-colors"
                  >
                    {eachTag.data.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Included Templates Section */}
          {contentInfo &&
            contentInfo.data.templatesInfo &&
            contentInfo.data.templatesInfo.length > 0 && (
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
                <Heading level={4} className="mb-4 text-gray-900 font-bold">
                  Included Templates ({contentInfo.data.templatesInfo.length})
                </Heading>
                <div className="flex flex-wrap gap-2">
                  {contentInfo.data.templatesInfo.map((template) => (
                    <div
                      key={template.id}
                      className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 font-medium"
                    >
                      {template.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Description Section */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <Heading level={4} className="text-gray-900 font-bold">
                Description
              </Heading>
              {user && contentAuthored && (
                <Button
                  variant="outline"
                  color="neutral"
                  size="sm"
                  onClick={() => setEditingDescription(true)}
                  className="flex items-center gap-1.5"
                >
                  <Icon name="pencilSquare" className="w-3.5 h-3.5" />
                  <span>Edit Description</span>
                </Button>
              )}
            </div>

            {editingDescription && contentInfo && (
              <form onSubmit={updateDescription} className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Edit Description
                </label>
                <textarea
                  ref={updateDescriptionInput}
                  defaultValue={contentInfo.data.description}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-peerbots-teal mb-3"
                />
                <div className="flex gap-2">
                  <Button color="primary" size="sm" type="submit">
                    Save Description
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

            <p
              ref={descriptionParagraph}
              className={`text-gray-700 text-sm leading-relaxed whitespace-pre-line ${
                isDescriptionExpanded ? "line-clamp-none" : "line-clamp-5"
              }`}
            >
              {contentInfo?.data.description || "No description provided."}
            </p>
            {isDescriptionLong && !isDescriptionExpanded && (
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded(true)}
                className="mt-2 text-sm font-semibold text-peerbots-darkteal hover:underline cursor-pointer"
              >
                Read more...
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Column (1 col on lg) */}
        <div className="space-y-6">
          {/* Main Action & Pricing Card */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-4">
            <div>
              <Text size="xs" color="muted" className="uppercase tracking-wider font-semibold mb-1">
                Pricing
              </Text>
              {isFree ? (
                <span className="text-3xl font-extrabold text-emerald-600 uppercase">
                  Free
                </span>
              ) : (
                <span className="text-3xl font-extrabold text-gray-900">
                  {contentInfo?.data.price &&
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(contentInfo.data.price)}
                </span>
              )}
            </div>

            {/* Launch directly in Peerbots Controller */}
            {canOpenInController && contentId && (
              <div className="pt-2">
                <a
                  href={`https://app.peerbots.org/dash/control?importMarketplaceContent=${contentId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-block"
                >
                  <Button
                    color="teal"
                    size="lg"
                    radius="pill"
                    className="w-full flex items-center justify-center gap-2 font-bold shadow-sm"
                  >
                    <span>Open in Peerbots App</span>
                    <Icon name="externalLink" className="w-4 h-4" />
                  </Button>
                </a>
                <Text size="xs" color="muted" className="mt-2">
                  Loads this template straight into the controller
                </Text>
              </div>
            )}

            {/* Acquire Paid / Non-authored Content */}
            {!contentAuthored && !contentPurchased && !isFree && (
              <div>
                {user ? (
                  <Button
                    color="primary"
                    size="lg"
                    onClick={acquireContent}
                    className="w-full font-bold"
                  >
                    + Acquire Content
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Text size="xs" color="muted">
                      Sign in to acquire this item
                    </Text>
                    <Button color="primary" size="lg" disabled className="w-full">
                      + Acquire Content
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Sales & Ratings Meta */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-around text-xs text-gray-500">
              {salesCount !== null && (
                <span>{salesCount} {salesCount === 1 ? "acquisition" : "acquisitions"}</span>
              )}
              {reviews.length > 0 && <SummaryRating reviews={reviews} />}
            </div>
          </div>

          {/* Copy to App Section */}
          {user && contentInfo && (contentAuthored || contentPurchased) && (
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs text-center">
              <Heading level={4} className="mb-3 text-gray-900 font-bold">
                Duplicate for Personal Edits
              </Heading>
              <form onSubmit={copyContent} className="space-y-3">
                <input
                  type="text"
                  ref={copyAsInput}
                  defaultValue={`Copy of ${contentInfo.data.name}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-peerbots-teal"
                />
                <Button color="neutral" variant="outline" size="sm" type="submit" className="w-full">
                  Create Personal Copy
                </Button>
              </form>
            </div>
          )}

          {/* Publish Section for Authors */}
          {user &&
            contentAuthored &&
            contentInfo &&
            !contentInfo.data.copyOf &&
            !contentInfo.data.public && (
              <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-xs text-center space-y-3">
                <Heading level={4} className="text-gray-900 font-bold">
                  Publish to Marketplace
                </Heading>
                <Text size="xs" color="muted">
                  Listing content makes it publicly available for free so other users can discover and use it. Once public, it cannot be made private.
                </Text>
                <Button color="primary" size="md" onClick={listPublicly} className="w-full">
                  Publish for Free
                </Button>
              </div>
            )}

          {/* Copy Origin Reference */}
          {contentInfo?.data.copyOf && original && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center text-xs text-gray-600">
              <span>This interaction is adapted from </span>
              <Link
                to={`/content/${contentInfo.data.copyOf.id}`}
                className="font-bold text-peerbots-darkteal hover:underline"
              >
                {original.data.name}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      {contentInfo && contentInfo.data.public && !contentInfo.data.copyOf && (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3} className="text-gray-900 font-bold">
              Reviews & Ratings ({reviews.length})
            </Heading>
          </div>

          {/* Review Submission Form */}
          {user && contentPurchased && (
            <form onSubmit={updateReview} className="mb-8 p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
              <Heading level={4} className="text-gray-900 font-bold">
                {hasReview ? "Update Your Review" : "Write a Review"}
              </Heading>

              <div className="flex items-center gap-3">
                <Text size="sm" className="font-semibold text-gray-700">
                  Your Rating:
                </Text>
                <StarRating
                  value={newUserReviewRating}
                  onChange={(rating) => setNewUserReviewRating(rating)}
                  size="md"
                />
              </div>

              <div>
                <input
                  type="text"
                  ref={reviewDescriptionInput}
                  defaultValue={userReview?.data?.description || ""}
                  placeholder="Share your thoughts on this content..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-peerbots-teal"
                />
              </div>

              <Button color="primary" size="sm" type="submit">
                {hasReview ? "Update Review" : "Submit Review"}
              </Button>
            </form>
          )}

          {/* Review Cards Grid */}
          {reviews.length === 0 ? (
            <Text size="sm" color="muted">
              No reviews yet. Be the first to share your experience!
            </Text>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((review) => {
                const reviewer = reviewers.find((r) => r.id === review.data.userId);
                return (
                  <div
                    key={review.id}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <StarRating value={review.data.rating} readOnly size="sm" />
                        {reviewer && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <img
                              src={reviewer.data.photoUrl || profilePic}
                              alt={reviewer.data.name || "Reviewer"}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span>{reviewer.data.name}</span>
                          </div>
                        )}
                      </div>
                      <Text size="sm" className="text-gray-800">
                        {review.data.description}
                      </Text>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* User's Copies of this Content */}
      {copies.length > 0 && (
        <ContentRow content={copies} title="Your Saved Copies of this Template" />
      )}
    </div>
  );
}
