import { trpc } from "@/utils/trpc";

export function useAlbumDetails(id: string) {
  return trpc.album.findOne.useQuery(id, {
    enabled: !!id,
  });
}
