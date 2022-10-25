import Image from "next/image";
import Link from "next/link";
import { queryRows } from "@/lib/db";
import { Playtime } from "@/components/Playtime";

type PageParams = Record<string, string>;
interface PageProps {
  params?: PageParams;
  searchParams?: Record<string, string | string[]>;
}

export default async function ArtistDetailPage({ params }: PageProps) {
  const albums = await queryRows<{
    id: string;
    title: string;
    type: string;
    album_cover_url: string;
    album_cover_height: number;
    album_cover_width: number;
    total_playtime_ms: string;
  }>(
    `
      SELECT
        sa.id               AS id,
        sa.name             AS title,
        sa.type             AS type,
        sai.url             AS album_cover_url,
        sai.height          AS album_cover_height,
        sai.width           AS album_cover_width,
        sum(st.duration_ms) AS total_playtime_ms
      FROM spotify_albums sa
        LEFT JOIN spotify_tracks st on sa.id = st.spotify_album_id
        LEFT JOIN spotify_played_tracks spt on st.id = spt.spotify_track_id
        LEFT JOIN spotify_album_images sai on st.spotify_album_id = sai.spotify_album_id
        LEFT JOIN spotify_artist_albums saa on sa.id = saa.spotify_album_id
        LEFT JOIN spotify_artists s on saa.spotify_artist_id = s.id
      WHERE s.id = ? AND sai.height = 300
      GROUP BY sa.id, sai.url, s.name, s.id
      ORDER BY total_playtime_ms DESC
      `,
    [params?.id]
  );

  return (
    <div className="mx-auto max-w-7xl overflow-hidden py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-[minmax(min-content,_300px)] gap-y-10 gap-x-6 sm:grid-cols-[repeat(2,_minmax(min-content,_300px))] lg:grid-cols-[repeat(3,_minmax(min-content,_300px))] lg:gap-x-8">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/album/${album.id}`}
            className="group text-sm"
          >
            <div className="overflow-hidden rounded-lg group-hover:opacity-75">
              <Image
                src={album.album_cover_url}
                alt={album.title}
                height={album.album_cover_height}
                width={album.album_cover_width}
              />
            </div>
            <h3 className="mt-4 font-medium text-gray-900">{album.title}</h3>
            <p className="italic text-gray-500">{album.type}</p>
            <p className="mt-2 font-medium text-gray-900">
              <Playtime durationMs={Number(album.total_playtime_ms)} />
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
