import ContentRow from "../components/contentRow";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function SearchResults() {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState([]);
  const { q } = router.query;

  const fetchSearchResults = async () => {
    if (q) {
      console.log(q);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [q]);

  return (
    <ContentRow content={searchResults}>Search Results for {q}:</ContentRow>
  );
}
