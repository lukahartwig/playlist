import useSWR, { preload, Fetcher } from "swr";
import { RecentlyPlayedResponse } from "@/pages/api/recently-played";

const fetcher: Fetcher<RecentlyPlayedResponse, string> = (url) =>
  fetch(url).then((res) => res.json());

preload("/api/recently-played", fetcher);

export function useRecentlyPlayedTracks() {
  return useSWR("/api/recently-played", fetcher);
}
