import {
  mysqlTable,
  uniqueIndex,
  index,
  varchar,
  int,
  text,
  datetime,
  primaryKey,
  tinyint,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm/sql";

export const spotifyAlbumImages = mysqlTable(
  "spotify_album_images",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    height: int("height"),
    width: int("width"),
    url: varchar("url", { length: 191 }).notNull(),
    spotifyAlbumId: varchar("spotify_album_id", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      urlKey: uniqueIndex("spotify_album_images_url_key").on(table.url),
      spotifyAlbumIdIdx: index("spotify_album_images_spotify_album_id_idx").on(
        table.spotifyAlbumId
      ),
    };
  }
);

export const spotifyAlbums = mysqlTable("spotify_albums", {
  id: varchar("id", { length: 191 }).primaryKey().notNull(),
  name: text("name").notNull(),
  releaseDate: datetime("release_date", { mode: "string", fsp: 3 }).notNull(),
  releaseDatePrecision: text("release_date_precision").notNull(),
  totalTracks: int("total_tracks").notNull(),
  type: text("type").notNull(),
  uri: text("uri").notNull(),
});

export const spotifyArtistAlbums = mysqlTable(
  "spotify_artist_albums",
  {
    spotifyArtistId: varchar("spotify_artist_id", { length: 191 }).notNull(),
    spotifyAlbumId: varchar("spotify_album_id", { length: 191 }).notNull(),
    position: int("position").notNull(),
  },
  (table) => {
    return {
      spotifyArtistIdIdx: index(
        "spotify_artist_albums_spotify_artist_id_idx"
      ).on(table.spotifyArtistId),
      spotifyAlbumIdIdx: index("spotify_artist_albums_spotify_album_id_idx").on(
        table.spotifyAlbumId
      ),
      spotifyArtistAlbumsSpotifyArtistIdSpotifyAlbumId: primaryKey(
        table.spotifyArtistId,
        table.spotifyAlbumId
      ),
    };
  }
);

export const spotifyArtistTracks = mysqlTable(
  "spotify_artist_tracks",
  {
    spotifyArtistId: varchar("spotify_artist_id", { length: 191 }).notNull(),
    spotifyTrackId: varchar("spotify_track_id", { length: 191 }).notNull(),
    position: int("position").notNull(),
  },
  (table) => {
    return {
      spotifyArtistIdIdx: index(
        "spotify_artist_tracks_spotify_artist_id_idx"
      ).on(table.spotifyArtistId),
      spotifyTrackIdIdx: index("spotify_artist_tracks_spotify_track_id_idx").on(
        table.spotifyTrackId
      ),
      spotifyArtistTracksSpotifyArtistIdSpotifyTrackId: primaryKey(
        table.spotifyArtistId,
        table.spotifyTrackId
      ),
    };
  }
);

export const spotifyArtists = mysqlTable("spotify_artists", {
  id: varchar("id", { length: 191 }).primaryKey().notNull(),
  name: text("name").notNull(),
  uri: text("uri").notNull(),
});

export const spotifyCredentials = mysqlTable("spotify_credentials", {
  id: int("id").autoincrement().primaryKey().notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: datetime("expires_at", { mode: "string", fsp: 3 })
    .default(sql`(CURRENT_TIMESTAMP(3))`)
    .notNull(),
});

export const spotifyCursor = mysqlTable("spotify_cursor", {
  id: int("id").autoincrement().primaryKey().notNull(),
  cursor: text("cursor").notNull(),
  updatedAt: datetime("updated_at", { mode: "string", fsp: 3 }),
});

export const spotifyPlayedTracks = mysqlTable(
  "spotify_played_tracks",
  {
    id: int("id").autoincrement().primaryKey().notNull(),
    playedAt: datetime("played_at", { mode: "string", fsp: 3 }).notNull(),
    spotifyTrackId: varchar("spotify_track_id", { length: 191 }).notNull(),
    popularity: int("popularity").notNull(),
  },
  (table) => {
    return {
      playedAtIdx: index("spotify_played_tracks_played_at_idx").on(
        table.playedAt
      ),
      spotifyTrackIdIdx: index("spotify_played_tracks_spotify_track_id_idx").on(
        table.spotifyTrackId
      ),
    };
  }
);

export const spotifyTracks = mysqlTable(
  "spotify_tracks",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    name: text("name").notNull(),
    durationMs: int("duration_ms").notNull(),
    explicit: tinyint("explicit").notNull(),
    uri: text("uri").notNull(),
    spotifyAlbumId: varchar("spotify_album_id", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      spotifyAlbumIdIdx: index("spotify_tracks_spotify_album_id_idx").on(
        table.spotifyAlbumId
      ),
    };
  }
);
