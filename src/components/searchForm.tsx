import { useNavigate } from "react-router";
import { SearchInput } from "@peerbots/core";

export function SearchForm({
  defaultValue = "",
  className = "",
}: {
  defaultValue?: string;
  className?: string;
}) {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <SearchInput
        placeholder="Search marketplace content..."
        defaultValue={defaultValue}
        onSearch={handleSearch}
      />
    </div>
  );
}
