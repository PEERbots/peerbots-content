import { useLatestContent } from "../providers/latestContent";
import ContentCard from "./contentCard";
export default function LatestContentRow() {
  const content = useLatestContent();

  return (
    <>
      <div>
        <h3>Latest Content</h3>
      </div>
      <div>
        {content &&
          content.content.map((eachContent) => (
            <ContentCard key={eachContent.id} content={eachContent.data} />
          ))}
      </div>
    </>
  );
}
