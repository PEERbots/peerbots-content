import Head from "next/head";
import { LatestContentProvider } from "../providers/latestContent";
import LatestContentRow from "../components/latestContentRow";

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
          {/* <LatestContentProvider> */}
          <LatestContentRow />
          {/* </LatestContentProvider> */}
        </div>
      </div>
    </div>
  );
}
