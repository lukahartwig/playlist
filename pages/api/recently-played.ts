import { NextRequest } from "next/server";
import { queryRows } from "../../lib/db";

export const config = {
  runtime: "experimental-edge",
};

interface Track {
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
}

export interface RecentlyPlayedResponse {
  tracks: Track[];
}

export default async function handler(req: NextRequest) {
  const tracks = await queryRows<Track>(`
    SELECT spt.id     AS id,
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
    WHERE a.position = 0 AND sai.height = 64
    ORDER BY played_at DESC
    LIMIT 10
  `);

  const body: RecentlyPlayedResponse = {
    tracks: tracks.map((track) => ({
      ...track,
      played_at: new Date(track.played_at).toISOString(),
    })),
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, s-maxage=300, stale-while-revalidate=60",
    },
  });
}
