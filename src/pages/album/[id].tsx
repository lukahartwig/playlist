import { useRouter } from "next/router";
import { useAlbumDetails } from "@/lib/hooks/useAlbumDetails";

export default function AlbumDetailPage() {
  const { query } = useRouter();
  const { data } = useAlbumDetails(query.id as string);

  if (data) {
    return (
      <>
        <h1>{data.name}</h1>
      </>
    );
  }

  return <div>Loading...</div>;
}
