-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migraitons
/*
CREATE TABLE `spotify_album_images` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`height` int,
	`width` int,
	`url` varchar(191) NOT NULL,
	`spotify_album_id` varchar(191) NOT NULL
);

CREATE TABLE `spotify_albums` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`release_date` datetime(3) NOT NULL,
	`release_date_precision` text NOT NULL,
	`total_tracks` int NOT NULL,
	`type` text NOT NULL,
	`uri` text NOT NULL
);

CREATE TABLE `spotify_artist_albums` (
	`spotify_artist_id` varchar(191) NOT NULL,
	`spotify_album_id` varchar(191) NOT NULL,
	`position` int NOT NULL
);
ALTER TABLE `spotify_artist_albums` ADD PRIMARY KEY(`spotify_artist_id`,`spotify_album_id`);

CREATE TABLE `spotify_artist_tracks` (
	`spotify_artist_id` varchar(191) NOT NULL,
	`spotify_track_id` varchar(191) NOT NULL,
	`position` int NOT NULL
);
ALTER TABLE `spotify_artist_tracks` ADD PRIMARY KEY(`spotify_artist_id`,`spotify_track_id`);

CREATE TABLE `spotify_artists` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`uri` text NOT NULL
);

CREATE TABLE `spotify_credentials` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`access_token` text NOT NULL,
	`refresh_token` text NOT NULL,
	`expires_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3))
);

CREATE TABLE `spotify_cursor` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`cursor` text NOT NULL,
	`updated_at` datetime(3)
);

CREATE TABLE `spotify_played_tracks` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`played_at` datetime(3) NOT NULL,
	`spotify_track_id` varchar(191) NOT NULL,
	`popularity` int NOT NULL
);

CREATE TABLE `spotify_tracks` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`duration_ms` int NOT NULL,
	`explicit` tinyint NOT NULL,
	`uri` text NOT NULL,
	`spotify_album_id` varchar(191) NOT NULL
);

CREATE UNIQUE INDEX `spotify_album_images_url_key` ON `spotify_album_images` (`url`);
CREATE INDEX `spotify_album_images_spotify_album_id_idx` ON `spotify_album_images` (`spotify_album_id`);
CREATE INDEX `spotify_artist_albums_spotify_artist_id_idx` ON `spotify_artist_albums` (`spotify_artist_id`);
CREATE INDEX `spotify_artist_albums_spotify_album_id_idx` ON `spotify_artist_albums` (`spotify_album_id`);
CREATE INDEX `spotify_artist_tracks_spotify_artist_id_idx` ON `spotify_artist_tracks` (`spotify_artist_id`);
CREATE INDEX `spotify_artist_tracks_spotify_track_id_idx` ON `spotify_artist_tracks` (`spotify_track_id`);
CREATE INDEX `spotify_played_tracks_played_at_idx` ON `spotify_played_tracks` (`played_at`);
CREATE INDEX `spotify_played_tracks_spotify_track_id_idx` ON `spotify_played_tracks` (`spotify_track_id`);
CREATE INDEX `spotify_tracks_spotify_album_id_idx` ON `spotify_tracks` (`spotify_album_id`);
*/