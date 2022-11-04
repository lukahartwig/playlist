import { Client } from "@planetscale/database";

const client = new Client({
  url: process.env.DATABASE_URL,
  fetch: (url, init) =>
    fetch(url, {
      cache: "no-store",
      ...init,
    }),
});

export async function queryMostRecentlyPlayedTracks() {
  return queryRows<{
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
}

export async function queryTracksByAlbumId(albumId: string) {
  return queryRows<{
    id: string;
    title: string;
    total_playtime_ms: string;
    explicit: boolean;
  }>(
    `
    SELECT
      st.id,
      st.name          AS title,
      sum(duration_ms) AS total_playtime_ms,
      explicit
    FROM spotify_tracks st
      LEFT JOIN spotify_played_tracks spt on st.id = spt.spotify_track_id
    WHERE st.spotify_album_id = ?
    GROUP BY st.id
    ORDER BY total_playtime_ms DESC
  `,
    [albumId]
  );
}

export async function queryCountArtists() {
  return queryOne<{ count: number }>(
    `SELECT count(*) AS count FROM spotify_artists`
  );
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
    `
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
    `
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
    `SELECT count(*) AS count FROM spotify_albums`
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
    [artistId]
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
