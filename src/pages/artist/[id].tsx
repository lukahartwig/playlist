import { useRouter } from "next/router";
import { ArtistAlbumGrid } from "@/components/ArtistAlbumGrid";

export default function ArtistDetailPage() {
  const { query } = useRouter();
  return <ArtistAlbumGrid artistId={query.id as string} />;
}
