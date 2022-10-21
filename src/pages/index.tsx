import Head from "next/head";
import { RecentlyPlayedTracks } from "@/components/RecentlyPlayedTracks";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Playlist | Overview</title>
        <meta
          name="description"
          content="Follow my recently played music on Spotify."
        />
      </Head>
      <div className="container mx-auto">
        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
          <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
            Recently played
          </h3>
          <RecentlyPlayedTracks />
        </div>
      </div>
    </>
  );
}
