import Head from "next/head";
import LatestContentRow from "../components/latestContentRow";
import TrustedContentRow from "../components/trustedContentRow";
import { useEffect } from "react";
import amplitude from "amplitude-js";
import SearchForm from "../components/searchForm";
import ContentRow from "../components/contentRow";

export default function Home() {
  useEffect(() => {
    amplitude.getInstance().logEvent("Viewed Page: Home");
  }, []);

  return (
    <div>
      <Head>
        <title>Peerbots Content</title>
        <meta
          name="description"
          content="Author and share content for the Peerbots app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="lg:hidden">
          <ContentRow content={[]}>
            <SearchForm />
          </ContentRow>
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
