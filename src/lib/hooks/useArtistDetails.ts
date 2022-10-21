import { trpc } from "@/utils/trpc";

export function useArtistDetails(id: string) {
  return trpc.artist.findOne.useQuery(id, {
    enabled: !!id,
  });
}
