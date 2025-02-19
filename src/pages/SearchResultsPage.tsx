import {
  collection,
  documentId,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import ContentRow from "../components/contentRow";
import algoliaApp from "../../algolia";
import { db } from "../../firebase";
import { useSearchParams } from "react-router";
import { Content } from "../types/content";

export default function SearchResults() {
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q");

  const fetchSearchResults = async () => {
    if (queryFromUrl) {
      const contentResults = algoliaApp.search({
        requests: [
          {
            indexName: "Content Index",
            query: queryFromUrl,
          },
        ],
      });
      const contentIds = (await contentResults).results.map((result) => {
        return result.facetHits;
      });

      console.log(contentIds);

      const firebaseQuery = query(
        collection(db, "content"),
        where("public", "==", true),
        where(documentId(), "in", contentIds.slice(0, 10)),
        limit(10)
      );
      const data = await getDocs(firebaseQuery);
      const searchResultsFromDb = data.docs.map((doc) => {
        return {
          id: doc.id,
          data: doc.data(),
        };
      }) as Content[];
      setSearchResults(searchResultsFromDb);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [queryFromUrl]);

  return (
    <ContentRow
      content={searchResults}
      title={`Search results for ${queryFromUrl}`}
    />
  );
}
