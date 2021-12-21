export default function ContentCard({ content }) {
  return (
    <>
      <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white shadow-lg rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
        <div className="space-y-1">
          <div className=" flex content-between">
            <div>
              <span className="text-gray-900 text-xl">{content.name}</span>
            </div>
            <div className="text-gray-800">
              <span>Img</span>
              <span>Owner</span>
            </div>
          </div>
          <div className="flex content-between">
            <div>Reviews</div>
            <div className="text-sm text-gray-600 flex items-center">
              {content.trusted ? (
                <span>Trusted</span>
              ) : (
                <span>You on your own </span>
              )}
            </div>
          </div>
          <div>
            <p className="text-gray-700 text-base">{content.description}</p>
          </div>
          <div>Tags</div>
          <div className="flex items-center content-between">
            <div className="text-gray-900 text-sm leading-none">
              {content.price == 0 ? (
                <span className="uppercase">Free</span>
              ) : (
                <span>${content.price}</span>
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
