import { Link } from "react-router";
import SummaryRating from "./summaryRating";
import TrustedStar from "./trustedStar";
import { UserRecord } from "../types/user";
import { firebaseDoc } from "../types/firebase_helper_types";
import { Tag } from "../types/tag";
import { Content } from "../types/content";
import { Review } from "../types/review";

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
  return (
    <div className="bg-white shadow-lg rounded px-4 pt-4 pb-2 col-span-1 w-full">
      <div className="w-full">
        <div className="flex justify-between mb-1">
          <div className="flex items-center">
            <Link to={`/content/${content.id}`}>
              <span className="text-gray-900 text-xl text-ellipsis cursor-pointer">
                {content.data.name}
              </span>
            </Link>
            <TrustedStar content={content} />
          </div>
          {author ? (
            <div className="text-gray-800">
              <Link to={`/u/${author.id}`}>
                <span>
                  {author.data.photoUrl ? (
                    <img
                      src={author.data.photoUrl}
                      className="h-8 inline-block rounded-full cursor-pointer"
                    ></img>
                  ) : (
                    <img
                      src="profile_pic.png"
                      className="h-8 inline-block rounded-full cursor-pointer"
                    ></img>
                  )}
                </span>
              </Link>
              <Link to={`/u/${author.id}`}>
                <span className="ml-1 text-xs cursor-pointer">
                  {author.data.name}
                </span>
              </Link>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="flex justify-between mb-1">
          <div className="text-sm text-gray-600 flex items-center"></div>
        </div>
        <div className="text-sm">
          <p className="text-gray-700 line-clamp-2">
            {content.data.description}
          </p>
          <p className="font-bold text-dark-primary cursor-pointer">
            <Link to={`/content/${content.id}`}>
              <a>Read more...</a>
            </Link>
          </p>
        </div>
        <div>
          {tags &&
            tags.map((eachTag) => (
              <Link key={eachTag.id} to={`/tag/${eachTag.id}`}>
                <span
                  key={eachTag.id}
                  style={{
                    background: eachTag.data.color,
                    color: eachTag.data.textColor,
                  }}
                  className="rounded-3xl px-2 mx-1 text-xs cursor-pointer"
                >
                  {eachTag.data.name}
                </span>
              </Link>
            ))}
        </div>
        {content.data.copyOf ? (
          <div className="text-center my-4 text-xs">
            This is a copy.{" "}
            <Link to={`/content/${content.data.copyOf.id}`}>
              <a className="underline decoration-primary text-primary hover:text-dark-primary hover:decoration-dark-primary font-bold">
                View original.
              </a>
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-between my-4 w-full">
            <div className="text-gray-900 text-sm leading-none">
              {content.data.price == 0 ? (
                <span className="uppercase text-green-700 font-bold ">
                  Free
                </span>
              ) : (
                <span>
                  {content.data.price &&
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(content.data.price)}
                </span>
              )}
            </div>
            <div className="">
              <SummaryRating reviews={reviews} />
            </div>
            <div className="">
              <Link to={`/content/${content.id}`}>
                <button className="btn-primary flex items-center m-0">
                  <span className="text-xl">+</span>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
