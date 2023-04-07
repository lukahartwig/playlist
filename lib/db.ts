import { connect, Client } from "@planetscale/database";
import { sql } from "drizzle-orm";
import { and, desc, eq } from "drizzle-orm/expressions";
import { AnyMySqlColumn } from "drizzle-orm/mysql-core";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import {
  spotifyAlbumImages,
  spotifyAlbums,
  spotifyArtistTracks,
  spotifyArtists,
  spotifyPlayedTracks,
  spotifyTracks,
} from "@/migrations/schema";

const client = new Client({
  url: process.env.DATABASE_URL,
});

const connection = connect({
  url: process.env.DATABASE_URL,
});

const db = drizzle(connection);

export async function queryMostRecentlyPlayedTracks(limit = 10) {
  return db
    .select({
      id: spotifyPlayedTracks.id,
      title: spotifyTracks.name,
      played_at: spotifyPlayedTracks.playedAt,
      artist: spotifyArtists.name,
      artist_id: spotifyArtists.id,
      album: spotifyAlbums.name,
      album_id: spotifyAlbums.id,
      album_cover_url: spotifyAlbumImages.url,
      album_cover_height: spotifyAlbumImages.height,
      album_cover_width: spotifyAlbumImages.width,
    })
    .from(spotifyPlayedTracks)
    .leftJoin(
      spotifyTracks,
      eq(spotifyPlayedTracks.spotifyTrackId, spotifyTracks.id)
    )
    .leftJoin(
      spotifyArtistTracks,
      eq(spotifyArtistTracks.spotifyTrackId, spotifyTracks.id)
    )
    .leftJoin(
      spotifyArtists,
      eq(spotifyArtists.id, spotifyArtistTracks.spotifyArtistId)
    )
    .leftJoin(spotifyAlbums, eq(spotifyAlbums.id, spotifyTracks.spotifyAlbumId))
    .leftJoin(
      spotifyAlbumImages,
      eq(spotifyAlbumImages.spotifyAlbumId, spotifyTracks.spotifyAlbumId)
    )
    .where(
      and(
        eq(spotifyArtistTracks.position, 0),
        eq(spotifyAlbumImages.height, 64)
      )
    )
    .orderBy(desc(spotifyPlayedTracks.playedAt))
    .limit(limit);
}

export async function queryTracksByAlbumId(albumId: string) {
  return db
    .select({
      id: spotifyTracks.id,
      title: spotifyTracks.name,
      total_playtime_ms: sum(spotifyTracks.durationMs),
      explicit: spotifyTracks.explicit,
    })
    .from(spotifyTracks)
    .leftJoin(
      spotifyPlayedTracks,
      eq(spotifyTracks.id, spotifyPlayedTracks.spotifyTrackId)
    )
    .where(eq(spotifyTracks.spotifyAlbumId, albumId))
    .groupBy(spotifyTracks.id)
    .orderBy(desc(sql`total_playtime_ms`));
}

export async function queryCountArtists() {
  const rows = await db
    .select({ count: count() })
    .from(spotifyArtists)
    .limit(1);

  return rows[0];
}

export async function queryAlbumDetails(id: string) {
  return queryOne<{
    title: string;
    release_date: string;
    release_date_precision: string;
    album_cover_url: string;
    album_cover_height: number;
    album_cover_width: number;
  }>(
    /*sql*/ `
    SELECT
      name       AS title,
      release_date,
      release_date_precision,
      sai.url    AS album_cover_url,
      sai.height AS album_cover_heigt,
      sai.width  AS album_cover_width
    FROM spotify_albums sa
      LEFT JOIN spotify_album_images sai on sa.id = sai.spotify_album_id
    WHERE sai.height = 300 AND sa.id = ?
    `,
    [id]
  );
}

export async function queryArtistsByPlaytime(page = 1, pageSize = 10) {
  return queryRows<{
    id: string;
    name: string;
    total_playtime_ms: string;
  }>(
    /*sql*/ `
    SELECT sa.id, sa.name, sum(st.duration_ms) AS total_playtime_ms
    FROM spotify_artists sa
      LEFT JOIN spotify_artist_tracks sat on sa.id = sat.spotify_artist_id
      LEFT JOIN spotify_played_tracks spt on sat.spotify_track_id = spt.spotify_track_id
      LEFT JOIN spotify_tracks st on spt.spotify_track_id = st.id
    GROUP BY sa.id
    ORDER BY total_playtime_ms DESC
    LIMIT :limit OFFSET :offset
  `,
    {
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }
  );
}

export async function queryCountAlbums() {
  return queryOne<{ count: number }>(
    /*sql*/ `SELECT count(*) AS count FROM spotify_albums`
  );
}

export async function queryAlbumsByPlaytime(page = 1, pageSize = 10) {
  return queryRows<{
    id: string;
    title: string;
    artist: string;
    artist_id: string;
    album_cover_url: string;
    album_cover_height: number;
    album_cover_width: number;
    total_playtime_ms: string;
  }>(
    /*sql*/ `
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
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }
  );
}

export async function queryAlbumsByArtistId(artistId: string) {
  return queryRows<{
    id: string;
    title: string;
    type: string;
    album_cover_url: string;
    album_cover_height: number;
    album_cover_width: number;
    total_playtime_ms: string;
  }>(
    /*sql*/ `
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
    [artistId]
  );
}

export async function queryTracksByPlaytime(page = 1, pageSize = 10) {
  return queryRows<{
    id: string;
    title: string;
    artist: string;
    artist_id: string;
    album_id: string;
    album_title: string;
    album_cover_url: string;
    album_cover_height: number;
    album_cover_width: number;
    total_playtime_ms: string;
  }>(
    /*sql*/ `
    SELECT
      st.id               AS id,
      st.name             AS title,
      s.name              AS artist,
      s.id                AS artist_id,
      sa.id               AS album_id,
      sa.name             AS album_title,
      sai.url             AS album_cover_url,
      sai.height          AS album_cover_height,
      sai.width           AS album_cover_width,
      sum(st.duration_ms) AS total_playtime_ms
    FROM spotify_tracks st
      LEFT JOIN spotify_albums sa on sa.id = st.spotify_album_id
      LEFT JOIN spotify_played_tracks spt on st.id = spt.spotify_track_id
      LEFT JOIN spotify_album_images sai on st.spotify_album_id = sai.spotify_album_id
      LEFT JOIN spotify_artist_albums saa on sa.id = saa.spotify_album_id
      LEFT JOIN spotify_artists s on saa.spotify_artist_id = s.id
    WHERE saa.position = 0 AND sai.height = 64
    GROUP BY st.id, sai.url, s.name, s.id
    ORDER BY total_playtime_ms DESC
    LIMIT :limit OFFSET :offset
    `,
    {
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }
  );
}

export async function queryCountTracks() {
  return queryOne<{ count: number }>(
    /*sql*/ `SELECT count(*) AS count FROM spotify_tracks`
  );
}

async function queryRows<Row>(
  query: string,
  params?: object | any[]
): Promise<Row[]> {
  const result = await client.execute(query, params, { as: "object" });
  return result.rows as Row[];
}

async function queryOne<Row>(query: string, params?: any[]): Promise<Row> {
  const result = await client.execute(query, params, { as: "object" });
  return result.rows[0] as Row;
}

function count(column: AnyMySqlColumn | "*" = "*") {
  return sql<number>`count(${column})`;
}

function sum(column: AnyMySqlColumn) {
  return sql<number>`sum(${column})`;
}
