import Image from "next/future/image";
import useSWR, { preload, Fetcher } from "swr";
import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";
import { RecentlyPlayedResponse } from "./api/recently-played";

const fetcher: Fetcher<RecentlyPlayedResponse, string> = (url) =>
  fetch(url).then((res) => res.json());

preload("/api/recently-played", fetcher);

export default function HomePage() {
  const { data } = useSWR("/api/recently-played", fetcher);
  return (
    <>
      <div className="container mx-auto">
        <ul role="list" className="divide-y divide-gray-200">
          {data?.tracks.map((track) => (
            <li key={track.id} className="py-4">
              <div className="flex items-center space-x-3">
                <Image
                  className="rounded-full"
                  src={track.album_cover_url}
                  height={track.album_cover_height}
                  width={track.album_cover_width}
                  alt={track.album}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm">
                      <b>{track.title}</b> by&nbsp;{track.artist}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNowStrict(Date.parse(track.played_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">{track.album}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
