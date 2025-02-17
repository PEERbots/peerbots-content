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
import amplitude from "amplitude-js";
import { db } from "../../firebase";
import { useSearchParams } from "react-router";

export default function SearchResults() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const contentIndex = algoliaApp.initIndex("Content Index");

  const fetchSearchResults = async () => {
    if (q) {
      const contentResults = await contentIndex.search(q);
      const contentIds = contentResults.hits.map((contentHit) => {
        return contentHit.objectID;
      });

      const q = query(
        collection(db, "content"),
        where("public", "==", true),
        where(documentId(), "in", contentIds.slice(0, 10)),
        limit(10)
      );
      const data = await getDocs(q);
      const searchResultsFromDb = data.docs.map((doc) => {
        return {
          id: doc.id,
          data: doc.data(),
        };
      });
      setSearchResults(searchResultsFromDb);
    }
  };

  useEffect(() => {
    fetchSearchResults();
    amplitude.getInstance().logEvent("Viewed Page: Search Results", {
      "Search Query": q,
    });
  }, [q]);

  return (
    <ContentRow content={searchResults}>
      <h3 className="text-xl">
        Search results for &quot;<span className="font-bold">{q}</span>&quot;
      </h3>
    </ContentRow>
  );
}
