import useSWR, { Fetcher } from "swr";
import { Album } from "@/pages/api/album/[id]";

const fetcher: Fetcher<Album, string> = (url) =>
  fetch(url).then((res) => res.json());

export function useAlbumDetails(id?: string) {
  return useSWR(() => (id ? `/api/album/${id}` : null), fetcher);
}
