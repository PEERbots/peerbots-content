import Layout from "../components/layout";
import "../styles/globals.css";
import { useEffect } from "react";
import amplitude from "amplitude-js";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    amplitude.getInstance().init("290e764df692652a81bab2f2835bb44e");
  }, []);
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
