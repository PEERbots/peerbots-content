import firebaseApp from "../firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  doc,
  getDocs,
  documentId,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import ContentCard from "./contentCard";

export default function ContentRow({ content, children }) {
  const [authors, setAuthors] = useState([]);
  const [ratings, setRatings] = useState([]);
  const db = getFirestore(firebaseApp);
  const fetchContentRowDetails = async () => {
    if (content && content.length > 0) {
      const authorsIds = content.map((doc) => {
        return doc.data.owner.id;
      });

      const authorsQuery = query(
        collection(db, "users"),
        where(documentId(), "in", authorsIds)
      );

      const authorsData = await getDocs(authorsQuery);
      const authorsFromDb = authorsData.docs.map((doc) => {
        return {
          id: doc.id,
          data: doc.data(),
        };
      });
      setAuthors(authorsFromDb);

      const contentReferences = content.map((contentItem) => {
        return doc(collection(db, "content"), contentItem.id);
      });
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("content", "in", contentReferences)
      );

      const reviewsData = await getDocs(reviewsQuery);
      const reviewsFromDb = reviewsData.docs.map((doc) => {
        const docData = doc.data();
        return {
          content: docData.content.id,
          rating: docData.rating,
        };
      });

      const ratingsFromDb = contentReferences.map((contentId) => {
        const reviewsForContent = reviewsFromDb.filter((review) => {
          return review.content == contentId.id;
        });
        const nReviews = reviewsForContent.length;
        return {
          id: contentId.id,
          averageRating:
            nReviews > 0
              ? reviewsForContent.reduce((sum, { rating }) => {
                  return sum + rating;
                }, 0)
              : null,
          nRatings: nReviews,
        };
      });

      setRatings(ratingsFromDb);
    }
  };
  useEffect(() => {
    fetchContentRowDetails();
  }, [content]);
  return (
    <>
      <div className="bg-white shadow-md my-4 mx-2 p-8 rounded w-full">
        <div className="mb-6">{children}</div>
        <div className="max-w-sm w-full lg:max-w-full lg:flex space-x-8">
          {content &&
            authors &&
            content.map((eachContent) => (
              <ContentCard
                key={eachContent.id}
                content={eachContent.data}
                author={
                  authors
                    .filter((author) => {
                      return author.id == eachContent.data.owner.id;
                    })
                    .map((author) => {
                      return author.data;
                    })[0]
                }
                rating={
                  ratings.filter((rating) => {
                    return rating.id == eachContent.id;
                  })[0]
                }
              />
            ))}
        </div>
      </div>
    </>
  );
}
