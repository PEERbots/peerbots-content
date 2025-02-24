import { FormEvent, useRef } from "react";
import { useNavigate } from "react-router";

export function SearchForm() {
  const navigate = useNavigate();
  const searchQueryRef = useRef<HTMLInputElement>(null);
  const submitSearchQuery = (e: FormEvent) => {
    e.preventDefault();
    if (searchQueryRef.current) {
      navigate(`/search?q=${searchQueryRef.current.value}`);
    }
  };

  return (
    <form
      className="rounded"
      onSubmit={(e) => {
        submitSearchQuery(e);
      }}
    >
      <div className="flex items-center">
        <input
          type="text"
          ref={searchQueryRef}
          name="search"
          className="input-base border-2"
          placeholder="Search for content"
        ></input>
        <button
          className="bg-primary input-base border-2 border-l items-center cursor-pointer"
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
  );
}
