import StarRating from "./StarRating";
import { Text } from "@peerbots/core";
import { Review } from "../types/review";

export default function SummaryRating({ reviews }: { reviews: Review[] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <Text size="xs" color="muted" className="text-center">
        No reviews yet
      </Text>
    );
  }

  const averageRating =
    reviews.reduce((sum, { data }) => sum + (data.rating || 0), 0) /
    reviews.length;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <StarRating value={averageRating} size="sm" readOnly />
      <Text size="xs" color="muted" className="text-center">
        ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
      </Text>
    </div>
  );
}
