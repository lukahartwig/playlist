import { z } from "zod";
import { queryOne, queryRows } from "@/lib/db";
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
    LIMIT 1;`,
      [input]
    );
  }),
  mostPlayed: publicProcedure
    .input(
      z.object({
        size: z.number().max(50).default(10),
        page: z.number().default(1),
      })
    )
    .query(async ({ input }) => {
      const [artistCount, artists] = await Promise.all([
        queryOne<{ count: number }>(
          `SELECT count(*) AS count FROM spotify_artists`
        ),
        queryRows<Artist>(
          `
            SELECT sa.id, sa.name, count(spt.id) AS playcount
            FROM spotify_artists sa
              LEFT JOIN spotify_artist_tracks sat on sa.id = sat.spotify_artist_id
              LEFT JOIN spotify_played_tracks spt on sat.spotify_track_id = spt.spotify_track_id
            GROUP BY sa.id
            ORDER BY playcount DESC
            LIMIT :limit OFFSET :offset
          `,
          {
            limit: input.size,
            offset: (input.page - 1) * input.size,
          }
        ),
      ]);

      return {
        items: artists.slice(0, input.size),
        page: input.page,
        size: input.size,
        total: artistCount.count,
      };
    }),
});
