import {
  collection,
  documentId,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { EmptyState, Heading } from "@peerbots/core";

import ContentRow from "../components/contentRow";
import algoliaApp from "../../algolia";
import { db } from "../../firebase";
import { Content } from "../types/content";

export default function SearchResults() {
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q") || "";

  const fetchSearchResults = async () => {
    setLoading(true);
    if (queryFromUrl) {
      try {
        const contentResults = await algoliaApp.searchSingleIndex({
          indexName: "Content Index",
          searchParams: {
            query: queryFromUrl,
            filters: "public:true",
          },
        });

        const contentIds = contentResults.hits.map((hit) => hit.objectID);

        if (contentIds.length > 0) {
          const firebaseQuery = query(
            collection(db, "content"),
            where("public", "==", true),
            where(documentId(), "in", contentIds.slice(0, 10)),
            limit(10)
          );
          const data = await getDocs(firebaseQuery);
          const searchResultsFromDb = data.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          })) as Content[];
          setSearchResults(searchResultsFromDb);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Error searching content", err);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSearchResults();
  }, [queryFromUrl]);

  return (
    <div className="py-4">
      {searchResults.length > 0 ? (
        <ContentRow
          content={searchResults}
          title={`Search results for '${queryFromUrl}'`}
        />
      ) : !loading ? (
        <div className="py-8">
          <Heading level={3} className="mb-6 text-gray-900 font-bold">
            Search results for &ldquo;{queryFromUrl}&rdquo;
          </Heading>
          <EmptyState
            title="No matching content found"
            description={`We couldn't find any interaction templates matching "${queryFromUrl}". Try searching with broader keywords or browse trusted content on the homepage.`}
            icon="search"
            primaryAction={{
              label: "Explore Marketplace Home",
              render: <Link to="/" />,
            }}
            className="max-w-xl mx-auto my-8 bg-white border border-gray-200/80 rounded-2xl p-8"
          />
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500">
          Searching marketplace...
        </div>
      )}
    </div>
  );
}
