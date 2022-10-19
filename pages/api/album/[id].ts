import { NextRequest } from "next/server";
import { queryOne } from "@/lib/db";

export const config = {
  runtime: "experimental-edge",
};

export interface Album {
  id: string;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
}

export default async function handler(req: NextRequest) {
  const id = req.url.split("/").pop();
  const artist = await queryOne<Album>(
    `
    SELECT id, name, release_date, release_date_precision, total_tracks, type
    FROM spotify_albums sa
    WHERE sa.id = ?
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
