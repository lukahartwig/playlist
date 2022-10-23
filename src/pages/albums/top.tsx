import Head from "next/head";
import { useRouter } from "next/router";
import { MostPlayedAlbums } from "@/components/MostPlayedAlbums";

export default function TopArtistsPage() {
  const router = useRouter();
  const page = Number(router.query.page ?? 1);

  return (
    <>
      <Head>
        <title>Playlist | Top Artists</title>
        <meta
          name="description"
          content="My top albums on Spotify based on playtime."
        />
      </Head>
      <MostPlayedAlbums
        page={page}
        nextHref={`/albums/top?page=${page + 1}`}
        prevHref={`/albums/top?page=${page > 1 ? page - 1 : 1}`}
      />
    </>
  );
}
