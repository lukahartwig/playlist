import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { queryRows } from "@/lib/db";

export default async function HomePage() {
  const tracks = await queryRows<{
    id: string;
    title: string;
    played_at: string;
    artist: string;
    artist_id: string;
    album: string;
    album_id: string;
    album_cover_url: string;
    album_cover_height: number;
    album_cover_width: number;
  }>(`
    SELECT
      spt.id     AS id,
      st.name    AS title,
      played_at,
      sa.name    AS artist,
      sa.id      AS artist_id,
      s.name     AS album,
      s.id       AS album_id,
      sai.url    AS album_cover_url,
      sai.height AS album_cover_height,
      sai.width  AS album_cover_width
    FROM spotify_played_tracks spt
      LEFT JOIN spotify_tracks st on st.id = spt.spotify_track_id
      LEFT JOIN spotify_artist_tracks a on st.id = a.spotify_track_id
      LEFT JOIN spotify_artists sa on a.spotify_artist_id = sa.id
      LEFT JOIN spotify_albums s on st.spotify_album_id = s.id
      LEFT JOIN spotify_album_images sai on st.spotify_album_id = sai.spotify_album_id
    WHERE
      DATE(played_at) > (NOW() - INTERVAL 7 DAY)
      AND a.position = 0
      AND sai.height = 64
    ORDER BY played_at DESC
    LIMIT 10
  `);

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
