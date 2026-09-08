import { useState } from "react";

export interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = "md",
  className = "",
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const starSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`Rating: ${value.toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = displayValue >= star;
        const isHalfFilled = !isFilled && displayValue >= star - 0.5;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(null)}
            className={`${readOnly ? "cursor-default" : "cursor-pointer transition-transform hover:scale-110"} p-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded`}
            aria-label={readOnly ? undefined : `${star} star${star > 1 ? "s" : ""}`}
          >
            <svg
              className={`${starSizes[size]} ${
                isFilled
                  ? "text-amber-400 fill-amber-400"
                  : isHalfFilled
                    ? "text-amber-400 fill-amber-400/50"
                    : "text-gray-300 fill-gray-100"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
