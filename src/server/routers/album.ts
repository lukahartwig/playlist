import { z } from "zod";
import { queryOne } from "@/lib/db";
import { router, publicProcedure } from "@/server/trpc";

export interface Album {
  id: string;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
}

export const albumRouter = router({
  findOne: publicProcedure.input(z.string()).query(async ({ input }) => {
    return queryOne<Album>(
      `
        SELECT id, name, release_date, release_date_precision, total_tracks, type
        FROM spotify_albums sa
        WHERE sa.id = ?
        `,
      [input]
    );
  }),
});
