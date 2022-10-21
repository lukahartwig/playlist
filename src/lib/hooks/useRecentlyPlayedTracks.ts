import { trpc } from "@/utils/trpc";

export function useRecentlyPlayedTracks() {
  return trpc.track.recentlyPlayed.useQuery();
}
