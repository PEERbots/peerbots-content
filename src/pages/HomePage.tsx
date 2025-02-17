import LatestContentRow from "../components/latestContentRow";
import SearchForm from "../components/searchForm";
import TrustedContentRow from "../components/trustedContentRow";
import amplitude from "amplitude-js";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    amplitude.getInstance().logEvent("Viewed Page: Home");
  }, []);

  return (
    <div>
      <head>
        <title>Peerbots Content</title>
        <meta
          name="description"
          content="Author and share content for the Peerbots app"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <div>
        <div className="lg:hidden bg-white shadow-md my-4 mx-2 p-8 rounded flex justify-center content-center">
          <SearchForm className="flex-shrink" />
        </div>
        <div>
          <TrustedContentRow />
        </div>
        <div>
          <LatestContentRow />
        </div>
      </div>
    </div>
  );
}
