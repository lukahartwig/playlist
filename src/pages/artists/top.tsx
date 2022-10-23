import Head from "next/head";
import { useRouter } from "next/router";
import { MostPlayedArtists } from "@/components/MostPlayedArtists";

export default function TopArtistsPage() {
  const router = useRouter();
  const page = Number(router.query.page ?? 1);

  return (
    <>
      <Head>
        <title>Playlist | Top Artists</title>
        <meta
          name="description"
          content="My top artists on Spotify based on playtime."
        />
      </Head>
      <MostPlayedArtists
        page={page}
        nextHref={`/artists/top?page=${page + 1}`}
        prevHref={`/artists/top?page=${page > 1 ? page - 1 : 1}`}
      />
    </>
  );
}
