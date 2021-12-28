import { useRouter } from "next/router";
import { useRef } from "react";

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
        <>
            <div className="lg:flex items-center lg:justify-center">
                  <div className="flex border-2 rounded">
                    <form onSubmit={submitSearchQuery}>
                      <input
                        type="text"
                        ref={searchQueryRef}
                        name="search"
                        className="input-base"
                        placeholder="Search..."
                      ></input>
                      <button className="input-base border-l" type="submit">
                        <svg
                          className="w-6 h-6 text-gray-600"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </div>
        </>
    )
}