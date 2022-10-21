import { z } from "zod";
import { queryOne } from "@/lib/db";
import { router, publicProcedure } from "@/server/trpc";

export interface Artist {
  id: string;
  name: string;
  playcount: number;
}

export const artistRouter = router({
  findOne: publicProcedure.input(z.string()).query(async ({ input }) => {
    return queryOne<Artist>(
      `
    SELECT sa.id AS id, sa.name AS name, count(spt.id) AS playcount
    FROM spotify_artists sa
             LEFT JOIN spotify_artist_tracks sat on sa.id = sat.spotify_artist_id
             LEFT JOIN spotify_played_tracks spt on sat.spotify_track_id = spt.spotify_track_id
    WHERE sa.id = ?
    GROUP BY sa.id
    LIMIT 1;
  `,
      [input]
    );
  }),
});
