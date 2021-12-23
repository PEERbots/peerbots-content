import ContentCard from "./contentCard";

export default function ContentRow({ content, authors, children }) {
  console.log(authors);
  return (
    <>
      <div className="bg-white shadow-md my-4 mx-2 p-8 rounded w-full">
        <div className="mb-6">{children}</div>
        <div className="max-w-sm w-full lg:max-w-full lg:flex space-x-8">
          {content &&
            authors &&
            content.map((eachContent) => (
              <ContentCard
                key={eachContent.id}
                content={eachContent.data}
                author={
                  authors.filter((author) => {
                    return author.id == eachContent.data.owner.id;
                  })[0].data
                }
              />
            ))}
        </div>
      </div>
    </>
  );
}
