import { Link } from "react-router";
import { Card, Button, Heading, Text } from "@peerbots/core";

import SummaryRating from "./summaryRating";
import TrustedStar from "./trustedStar";
import { UserRecord } from "../types/user";
import { Tag } from "../types/tag";
import { Content } from "../types/content";
import { Review } from "../types/review";
import profilePic from "../assets/profile_pic.png";

export default function ContentCard({
  content,
  author,
  reviews,
  tags,
}: {
  content: Content;
  author: UserRecord;
  reviews: Review[];
  tags: Tag[];
}) {
  const isFree = content.data.price === 0 || !content.data.price;

  return (
    <Card
      variant="surface"
      padding="sm"
      radius="lg"
      className="flex flex-col justify-between h-full group"
    >
      <div>
        {/* Header: Title and Author Avatar */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Link
              to={`/content/${content.id}`}
              className="text-gray-900 font-bold hover:text-peerbots-darkteal transition-colors truncate"
            >
              <Heading level={4} className="truncate text-base">
                {content.data.name}
              </Heading>
            </Link>
            <TrustedStar content={content} />
          </div>

          {author && (
            <Link
              to={`/u/${author.id}`}
              title={author.data.name}
              className="shrink-0 group/author"
            >
              <img
                src={author.data.photoUrl || profilePic}
                alt={author.data.name || "Author"}
                className="h-7 w-7 rounded-full object-cover border border-gray-200 group-hover/author:ring-1 group-hover/author:ring-peerbots-teal"
              />
            </Link>
          )}
        </div>

        {/* Description snippet */}
        <Text size="sm" color="muted" className="line-clamp-2 mb-3">
          {content.data.description || "No description provided."}
        </Text>

        {/* Subtle Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((eachTag) => (
              <Link
                key={eachTag.id}
                to={`/tag/${eachTag.id}`}
                className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 hover:bg-peerbots-teal/10 hover:text-peerbots-darkteal transition-colors"
              >
                {eachTag.data.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Price, Rating, and Action */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <div>
          {isFree ? (
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Free
            </span>
          ) : (
            <span className="text-sm font-bold text-gray-900">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(content.data.price!)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <SummaryRating reviews={reviews} />
          <Link to={`/content/${content.id}`}>
            <Button size="sm" color="primary" variant="solid">
              View
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
