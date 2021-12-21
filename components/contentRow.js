import ContentCard from "./contentCard";

export default function ContentRow({ content, children }) {
  return (
    <>
      <div>{children}</div>
      <div className="max-w-sm w-full lg:max-w-full lg:flex">
        {content &&
          content.map((eachContent) => (
            <ContentCard key={eachContent.id} content={eachContent.data} />
          ))}
      </div>
    </>
  );
}
