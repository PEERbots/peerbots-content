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
} from "firebase/firestore";
import { useState, useEffect } from "react";

export default function ContentPage() {
  const [contentInfo, setContentInfo] = useState({});
  const [author, setAuthor] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [tags, setTags] = useState([]);
  const db = getFirestore(firebaseApp);

  const router = useRouter();
  const { contentId } = router.query;

  const fetchContentDetails = async () => {
    if (contentId) {
      const contentRef = doc(db, "content", contentId);
      const content = await getDoc(contentRef);

      if (content.exists()) {
        const contentInfoFromDb = content.data();
        setContentInfo(contentInfoFromDb);
        const authorRef = doc(db, "users", contentInfoFromDb.owner.id);
        const author = await getDoc(authorRef);
        const authorInfo = author.data();
        setAuthor(authorInfo);

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
        const reviewersQuery = query(
          collection(db, "users"),
          where(documentId(), "in", reviewersIds)
        );
        const reviewersData = await getDocs(reviewersQuery);
        const reviewersFromDb = reviewersData.docs.map((doc) => {
          return { id: doc.id, data: doc.data() };
        });
        console.log(reviewers);
        setReviewers(reviewersFromDb);
        setReviews(reviewsFromDb);
      } else {
        // Go to 404
      }
    }
  };
  useEffect(() => {
    fetchContentDetails();
  }, [contentId]);
  return (
    <div>
      <div>{contentInfo.name}</div>
      <div>
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
            <span className="ml-1 text-xs">{author.name}</span>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div>
        {reviews ? (
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
          <span>No rating</span>
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
      <div>{contentInfo.description}</div>
      <div>
        <h3>Reviews</h3>
        {reviews &&
          reviews.map((review) => (
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
      </div>
    </div>
  );
}
