import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { queryMostRecentlyPlayedTracks } from "@/lib/db";

export default async function HomePage() {
  const tracks = await queryMostRecentlyPlayedTracks();

  return (
    <div className="container mx-auto">
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
          Recently played
        </h3>
        <ul role="list" className="divide-y divide-gray-200">
          {tracks.map((track) => (
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
                    <h3 className="text-sm font-medium">
                      {track.title}{" "}
                      <span className="whitespace-nowrap font-normal italic">
                        by{" "}
                        <Link href={`/artist/${track.artist_id}`}>
                          {track.artist}
                        </Link>
                      </span>
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNowStrict(Date.parse(track.played_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <Link
                    className="text-sm text-gray-500"
                    href={`/album/${track.album_id}`}
                  >
                    {track.album}
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
