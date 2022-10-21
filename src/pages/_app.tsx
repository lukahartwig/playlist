import { AppProps } from "next/app";
import { Layout } from "@/components/Layout";
import { trpc } from "@/utils/trpc";
import "@/styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default trpc.withTRPC(App);
