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
      const contentResults = await algoliaApp.searchSingleIndex({
        indexName: "Content Index",
        searchParams: {
          query: queryFromUrl,
          filters: "public:true",
        },
      });

      const contentIds = contentResults.hits.map((hit) => {
        return hit.objectID;
      });

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
    <>
      {searchResults.length > 0 ? (
        <ContentRow
          content={searchResults}
          title={`Search results for '${queryFromUrl}'`}
        />
      ) : (
        <div className="bg-white shadow-md my-4 mx-2 p-8 rounded block">
          <h3 className="text-xl font-bold">
            Search results for {queryFromUrl}
          </h3>
          <div className="my-4">No results found</div>
        </div>
      )}
    </>
  );
}
