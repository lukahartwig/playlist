import { z } from "zod";
import { queryOne, queryRows } from "@/lib/db";
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
  mostPlayed: publicProcedure
    .input(
      z.object({
        size: z.number().max(50).default(10),
        page: z.number().default(1),
      })
    )
    .query(async ({ input }) => {
      const [albumCount, albums] = await Promise.all([
        queryOne<{ count: number }>(
          `SELECT count(*) AS count FROM spotify_albums`
        ),
        queryRows<{
          id: string;
          title: string;
          artist: string;
          artist_id: string;
          album_cover_url: string;
          album_cover_height: number;
          album_cover_width: number;
          total_playtime_ms: string;
        }>(
          `
            SELECT
              sa.id               AS id,
              sa.name             AS title,
              s.name              AS artist,
              s.id                AS artist_id,
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
            WHERE saa.position = 0 AND sai.height = 64
            GROUP BY sa.id, sai.url, s.name, s.id
            ORDER BY total_playtime_ms DESC
            LIMIT :limit OFFSET :offset
          `,
          {
            limit: input.size,
            offset: (input.page - 1) * input.size,
          }
        ),
      ]);

      return {
        items: albums.slice(0, input.size).map((album) => ({
          ...album,
          total_playtime_ms: parseInt(album.total_playtime_ms),
        })),
        page: input.page,
        size: input.size,
        total: albumCount.count,
      };
    }),
  mostPlayedByArtist: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
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
        [input]
      );

      return albums.map((album) => ({
        ...album,
        total_playtime_ms: parseInt(album.total_playtime_ms),
      }));
    }),
});
