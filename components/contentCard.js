export default function ContentCard({ content, author, rating, tags }) {
  return (
    <>
      <div className="bg-white shadow-lg rounded p-4 w-72">
        <div className="space-y-1 w-full">
          <div className=" flex justify-between">
            <div>
              <span className="text-gray-900 text-base text-ellipsis">
                {content.name}
              </span>
            </div>
            {author ? (
              <div className="text-gray-800">
                <span>
                  {author.photoUrl ? (
                    <img
                      src={author.photoUrl}
                      className="h-8 inline-block rounded-full"
                    ></img>
                  ) : (
                    <img
                      src="profile_pic.png"
                      className="h-8 inline-block rounded-full"
                    ></img>
                  )}
                </span>
                <span className="ml-1 text-xs">{author.name}</span>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="flex justify-between">
            <div>
              {rating ? (
                <>
                  {rating.nRatings > 0 ? (
                    <span>
                      <span className="text-accent-hc font-bold px-2 text-base">
                        {rating.averageRating}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 inline-block"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </span>
                      <span className="text-sm">
                        ({rating.nRatings} reviews)
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs">No reviews yet</span>
                  )}
                </>
              ) : (
                <span>No rating</span>
              )}
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              {content.trusted ? (
                <span>
                  <svg
                    className="h-6 w-6"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_3_129)">
                      <path
                        d="M13.2592 14.488C13.2592 15.3856 13.0192 15.5872 12.2768 15.3792C11.5104 15.1648 10.8272 14.7616 10.1456 14.3616C9.46401 13.9616 8.81602 13.5359 8.17281 13.0912C8.12567 13.0485 8.06437 13.0248 8.00078 13.0248C7.93719 13.0248 7.87589 13.0484 7.82881 13.0912C6.80876 13.8157 5.74374 14.4746 4.64001 15.064C4.2822 15.2637 3.89585 15.4072 3.49438 15.4895C3.16157 15.5455 3.00001 15.4319 2.93755 15.0976C2.83677 14.544 2.95193 14.0047 3.04953 13.4672H3.04959C3.25011 12.4197 3.51735 11.3862 3.84959 10.3728C3.89037 10.2898 3.89641 10.1941 3.86641 10.1067C3.83636 10.0193 3.77276 9.94749 3.68958 9.90713C2.64161 9.15995 1.59998 8.40473 0.68958 7.48153C0.456767 7.25851 0.258847 7.0018 0.102393 6.71992C-0.0880201 6.35189 -0.0176067 6.11831 0.348793 5.91992C0.772754 5.71981 1.22786 5.59372 1.69439 5.54711C2.8759 5.38883 4.06719 5.31508 5.2592 5.32632C5.32414 5.33825 5.39117 5.32294 5.4445 5.28387C5.49778 5.24481 5.53263 5.18549 5.54075 5.11991C5.86075 3.94871 6.18075 2.78071 6.74878 1.69751C6.91758 1.33235 7.15935 1.00569 7.45919 0.737515C7.85441 0.417515 8.22081 0.428715 8.59679 0.777515C9.00319 1.15511 9.24961 1.6383 9.47518 2.12951C9.90127 3.09197 10.2402 4.09058 10.488 5.11351C10.4946 5.18404 10.5302 5.24862 10.5864 5.29174C10.6426 5.33487 10.7141 5.35263 10.784 5.3407C12.064 5.36471 13.344 5.39507 14.608 5.5983C14.9413 5.64278 15.2683 5.72601 15.5824 5.84633C16.0336 6.03195 16.104 6.24794 15.856 6.66393C15.6971 6.91647 15.5096 7.15002 15.2976 7.35991C14.3856 8.3071 13.3408 9.09911 12.3024 9.89591C12.2483 9.92669 12.2078 9.97674 12.1891 10.0361C12.1704 10.0955 12.1749 10.1597 12.2016 10.2159C12.5935 11.3322 12.9105 12.4734 13.1504 13.6319C13.2074 13.9143 13.2437 14.2003 13.2592 14.4879L13.2592 14.488Z"
                        fill="#46D9D9"
                      />
                      <path
                        d="M7.57728 5.336H8.44928L10.8893 11H9.73728L9.20928 9.704H6.75328L6.24128 11H5.11328L7.57728 5.336ZM8.85728 8.84L7.98528 6.536L7.09728 8.84H8.85728Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_3_129">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              ) : (
                <span></span>
              )}
            </div>
          </div>
          <div className="text-sm">
            <p className="text-gray-700 line-clamp-2">{content.description}</p>
            <p className="font-bold text-dark-primary cursor-pointer">
              <a>Read more...</a>
            </p>
          </div>
          <div>
            {tags &&
              tags.map((eachTag) => (
                <span
                  key={eachTag.id}
                  style={{
                    background: eachTag.data.color,
                    color: eachTag.data.textColor,
                  }}
                  className="rounded-3xl px-2 mx-1 text-xs"
                >
                  {eachTag.data.name}
                </span>
              ))}
          </div>
          <div className="flex items-center justify-between">
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
            <div>
              <button className="btn-primary">+</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
