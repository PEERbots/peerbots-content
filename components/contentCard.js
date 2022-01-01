import Link from "next/link";
import SummaryRating from "./summaryRating";
import TrustedStar from "./trustedStar";
import amplitude from "amplitude-js";

export default function ContentCard({ content, author, reviews, tags }) {
  return (
    <div className="bg-white shadow-lg rounded px-4 pt-4 pb-2 col-span-1 w-full">
      <div className="w-full">
        <div className="flex justify-between mb-1">
          <div className="flex items-center">
            <Link href="/content/[contentId]" as={`/content/${content.id}`}>
              <span
                className="text-gray-900 text-xl text-ellipsis cursor-pointer"
                onClick={() => {
                  amplitude
                    .getInstance()
                    .logEvent("Clicked Link: Content Card - Name", {
                      "Content ID": content.id,
                      "Content Name": content.name,
                      "Content Author": author.data.name,
                      "Author ID": author.id,
                    });
                }}
              >
                {content.name}
              </span>
            </Link>
            <TrustedStar content={content} />
          </div>
          {author ? (
            <div className="text-gray-800">
              <Link href="/[userName]" as={`/${author.id}`}>
                <span
                  onClick={() => {
                    amplitude
                      .getInstance()
                      .logEvent("Clicked Link: Content Card - Author", {
                        "Content ID": content.id,
                        "Content Name": content.name,
                        "Content Author": author.data.name,
                        "Author ID": author.id,
                        "Click Source": "Profile Photo",
                      });
                  }}
                >
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
              <Link href="/[userName]" as={`/${author.id}`}>
                <span
                  className="ml-1 text-xs cursor-pointer"
                  onClick={() => {
                    amplitude
                      .getInstance()
                      .logEvent("Clicked Link: Content Card - Author", {
                        "Content ID": content.id,
                        "Content Name": content.name,
                        "Content Author": author.data.name,
                        "Author ID": author.id,
                        "Click Source": "Author Name",
                      });
                  }}
                >
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
          <p className="text-gray-700 line-clamp-2">{content.description}</p>
          <p className="font-bold text-dark-primary cursor-pointer">
            <Link href="/content/[contentId]" as={`/content/${content.id}`}>
              <a>Read more...</a>
            </Link>
          </p>
        </div>
        <div>
          {tags &&
            tags.map((eachTag) => (
              <Link
                key={eachTag.id}
                href="/tag/[tagId]"
                as={`/tag/${eachTag.id}`}
              >
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
        <div className="flex items-center justify-between my-4 w-full">
          <div className="text-gray-900 text-sm leading-none">
            {content.price == 0 ? (
              <span className="uppercase">Free</span>
            ) : (
              <span>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(content.price)}
              </span>
            )}
          </div>
          <div className="">
            <SummaryRating reviews={reviews} />
          </div>
          <div className="">
            <Link href="/content/[contentId]" as={`/content/${content.id}`}>
              <button className="btn-primary flex items-center m-0">
                <span className="text-xl">+</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
