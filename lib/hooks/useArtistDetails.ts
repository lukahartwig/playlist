import useSWR, { Fetcher } from "swr";
import { Artist } from "@/pages/api/artist/[id]";

const fetcher: Fetcher<Artist, string> = (url) =>
  fetch(url).then((res) => res.json());

export function useArtistDetails(id?: string) {
  return useSWR(() => (id ? `/api/artist/${id}` : null), fetcher);
}
