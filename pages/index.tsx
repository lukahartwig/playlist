import useSWR, { preload, Fetcher } from "swr";
import { RecentlyPlayedResponse } from "./api/recently-played";

const fetcher: Fetcher<RecentlyPlayedResponse, string> = (url) =>
  fetch(url).then((res) => res.json());

preload("/api/recently-played", fetcher);

export default function HomePage() {
  const { data } = useSWR("/api/recently-played", fetcher);
  return (
    <>
      <h1>Recently played</h1>
      <ul>
        {data?.tracks.map((track) => (
          <li key={track.id}>
            {track.played_at}: {track.artist} - {track.title}
          </li>
        ))}
      </ul>
    </>
  );
}
