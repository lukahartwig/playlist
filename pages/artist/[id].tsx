import { useRouter } from "next/router";
import { useArtistDetails } from "@/lib/hooks/useArtistDetails";

export default function ArtistDetailPage() {
  const { query } = useRouter();
  const { data } = useArtistDetails(query.id as string);

  if (data) {
    return (
      <h1>
        {data.name} played {data.playcount} times
      </h1>
    );
  }

  return <div>Loading...</div>;
}
