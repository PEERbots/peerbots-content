import { Rating } from "@mui/material";
import { Review } from "../types/review";

export default function SummaryRating({ reviews }: { reviews: Review[] }) {
  return (
    <>
      {reviews && reviews.length > 0 ? (
        <span>
          <div className="text-center">
            <Rating
              value={
                reviews.reduce((sum, { data }) => {
                  return sum + data.rating;
                }, 0) / reviews.length
              }
              size="small"
              readOnly
            />
          </div>
          <div className="text-xs text-center">({reviews.length} reviews)</div>
        </span>
      ) : (
        <span className="text-xs text-center">No reviews yet</span>
      )}
    </>
  );
}
