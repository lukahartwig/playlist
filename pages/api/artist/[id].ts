import { NextRequest } from "next/server";
import { queryOne } from "@/lib/db";

export const config = {
  runtime: "experimental-edge",
};

export interface Artist {
  id: string;
  name: string;
  playcount: number;
}

export default async function handler(req: NextRequest) {
  const id = req.url.split("/").pop();
  const artist = await queryOne<Artist>(
    `
    SELECT sa.id AS id, sa.name AS name, count(spt.id) AS playcount
    FROM spotify_artists sa
             LEFT JOIN spotify_artist_tracks sat on sa.id = sat.spotify_artist_id
             LEFT JOIN spotify_played_tracks spt on sat.spotify_track_id = spt.spotify_track_id
    WHERE sa.id = ?
    GROUP BY sa.id
    LIMIT 1;
  `,
    [id]
  );

  return new Response(JSON.stringify(artist), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, s-maxage=300, stale-while-revalidate=60",
    },
  });
}
