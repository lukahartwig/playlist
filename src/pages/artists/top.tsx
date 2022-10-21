import { MostPlayedArtists } from "@/components/MostPlayedArtists";
import { useRouter } from "next/router";

export default function TopArtistsPage() {
  const router = useRouter();
  const page = Number(router.query.page ?? 1);

  return (
    <MostPlayedArtists
      page={page}
      nextHref={`/artists/top?page=${page + 1}`}
      prevHref={`/artists/top?page=${page > 1 ? page - 1 : 1}`}
    />
  );
}
