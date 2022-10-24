import { trpc } from "@/utils/trpc";

export function useArtistAlbums(artistId: string) {
  return trpc.album.mostPlayedByArtist.useQuery(artistId, {
    enabled: !!artistId,
  });
}
