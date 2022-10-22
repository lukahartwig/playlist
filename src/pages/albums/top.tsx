import { MostPlayedAlbums } from "@/components/MostPlayedAlbums";
import { useRouter } from "next/router";

export default function TopArtistsPage() {
  const router = useRouter();
  const page = Number(router.query.page ?? 1);

  return (
    <MostPlayedAlbums
      page={page}
      nextHref={`/albums/top?page=${page + 1}`}
      prevHref={`/albums/top?page=${page > 1 ? page - 1 : 1}`}
    />
  );
}
