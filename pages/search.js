import ContentRow from "../components/contentRow";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import algoliaApp from "../algolia";
import firebaseApp from "../firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  limit,
  documentId,
  getDocs,
} from "firebase/firestore";
import amplitude from "amplitude-js";

export default function SearchResults() {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState([]);
  const { q } = router.query;
  const contentIndex = algoliaApp.initIndex("Content Index");
  const db = getFirestore(firebaseApp);

  const fetchSearchResults = async () => {
    if (q) {
      const contentResults = await contentIndex.search(q);
      const contentIds = contentResults.hits.map((contentHit) => {
        return contentHit.objectID;
      });

      const q = query(
        collection(db, "content"),
        where("public", "==", true),
        where(documentId(), "in", contentIds),
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
    <ContentRow content={searchResults}>Search Results for {q}:</ContentRow>
  );
}
