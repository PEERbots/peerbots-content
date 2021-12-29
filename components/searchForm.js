import { useRef } from "react";
import { useRouter } from "next/router";

export default function SearchForm() {
  const router = useRouter();
  const searchQueryRef = useRef();
  const submitSearchQuery = (e) => {
    e.preventDefault();
    router.push({
      pathname: "/search",
      query: { q: searchQueryRef.current.value },
    });
  };

  return (
    <div className="mr-3">
      <form className="rounded" onSubmit={submitSearchQuery}>
        <div className="flex items-center">
          <input
            type="text"
            ref={searchQueryRef}
            name="search"
            className="input-base border-2"
            placeholder="Search..."
          ></input>
          <button
            className="bg-primary input-base border-2 border-l items-center"
            type="submit"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
