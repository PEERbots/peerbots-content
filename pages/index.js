import Head from "next/head";
import LatestContentRow from "../components/latestContentRow";
import TrustedContentRow from "../components/trustedContentRow";

export default function Home() {
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
