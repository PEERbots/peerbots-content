import { Rating } from "@mui/material";

export default function SummaryRating({ reviews }) {
  return (
    <>
      {reviews && reviews.length > 0 ? (
        <span>
          <div className="text-center">
            <Rating
              value={
                +parseFloat(
                  reviews.reduce((sum, { data }) => {
                    return sum + data.rating;
                  }, 0) / reviews.length
                ).toFixed(2)
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
