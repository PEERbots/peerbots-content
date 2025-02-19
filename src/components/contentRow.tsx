import {
  collection,
  doc,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import ContentCard from "./contentCard";
import { db } from "../../firebase";
import { firebaseDoc } from "../types/firebase_helper_types";
import { Tag } from "../types/tag";
import { Review } from "../types/review";
import { Content } from "../types/content";

export default function ContentRow({
  content,
  title,
  description,
}: {
  content: Content[];
  title?: string;
  description?: string;
}) {
  const [authors, setAuthors] = useState<firebaseDoc[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

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

      const tagsIds = content
        .filter((d) => d.data.tags)
        .map((doc) => {
          console.log(doc);
          return doc.data.tags.flat().map((tag: Tag) => {
            return tag.id;
          });
        })
        .flat();

      if (tagsIds.length > 0) {
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
      }

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
          id: doc.id,
          data: {
            ...docData,
            userId: docData.user.id,
            contentId: docData.content.id,
          },
        };
      }) as Review[];

      setReviews(reviewsFromDb);
    }
  };
  useEffect(() => {
    fetchContentRowDetails();
  }, [content]);
  return (
    <>
      <div className="bg-white shadow-md my-4 mx-2 p-8 rounded block">
        {title && (
          <div className="mb-6">
            <h3 className="text-xl font-bold">{title}</h3>
            {description && <p className="text-sm">{description}</p>}
          </div>
        )}
        <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {content &&
            authors &&
            content.map((eachContent) => (
              <ContentCard
                key={eachContent.id}
                content={eachContent}
                author={
                  authors.filter((author) => {
                    return author.id == eachContent.data.owner.id;
                  })[0]
                }
                reviews={reviews.filter((review) => {
                  return review.data.contentId == eachContent.id;
                })}
                tags={
                  eachContent.data.tags
                    ? tags.filter((tag) => {
                        return eachContent.data.tags
                          .map((t) => {
                            return t.id;
                          })
                          .includes(tag.id);
                      })
                    : []
                }
              />
            ))}
        </div>
      </div>
    </>
  );
}
